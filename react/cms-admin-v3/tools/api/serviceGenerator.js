function generator(input, config) {
  const apis = [];
  const types = new Set();

  try {
    Object.entries(input.paths).forEach(
      ([endPoint, value]) => {
        if (
          config.ignorePaths &&
          config.ignorePaths.length > 0
        ) {
          if (config.ignorePaths.includes(endPoint)) {
            return;
          }
        }

        Object.entries(value).forEach(
          ([method, options]) => {
            // 处理参数
            const parameters = options.parameters
              ?.filter((param) => param.in !== 'header')
              .map(getParamterInfo);

            // 收集参数中的引用
            parameters
              ?.filter((param) => param.type === 'ref')
              .forEach((param) => {
                types.add(param.refType);
              });

            // 处理返回值
            const responseSchema =
              options.responses['200'].schema;
            if (!responseSchema) return;

            const responseRefName = getRefName(
              responseSchema['$ref'],
              config.responseWrap ?? 'ApiResult'
            );
            const response = getResponeType(
              responseRefName
            );

            // 收集返回值中的引用
            if (response.type === 'ref') {
              types.add(response.refType);
            }
            if (
              response.items &&
              response.items.type === 'ref'
            ) {
              types.add(response.items.refType);
            }

            apis.push({
              contentType: options.consumes,
              description:
                options.description ?? options.summary,
              operationId: options.operationId,
              endPoint,
              method,
              parameters,
              response,
            });
          }
        );
      }
    );

    const apiCode = generateApis(apis, config);
    const typeCode = generateTypes(
      types,
      input.definitions
    );
    const importCode = generateImports(config);

    return importCode + '\n' + typeCode + '\n' + apiCode;
  } catch (error) {
    console.error(error);
  }
}

function getRefName(refString, wrapper) {
  let res = refString.replace('#/definitions/', '');
  if (wrapper) {
    res = res
      .replace(`${wrapper}«`, '')
      .replace('»', '')
      .replace('«', '<')
      .replace('»', '>');
  }
  if (/.*[\u4E00-\u9FA5]+.*$/.test(res)) {
    console.warn(`类型名含有中文: ${res}`);
  }
  return res;
}

function getParamterInfo(params) {
  const { schema, ...props } = params;
  let res = { ...props };
  if (schema) {
    const { $ref } = schema;
    if ($ref) {
      res.type = 'ref';
      res.refType = getRefName($ref);
    } else {
      res = {
        ...res,
        ...schema,
      };
    }
  }
  if (res.items) {
    const { $ref } = res.items;
    if ($ref) {
      res.items = {
        type: 'ref',
        refType: getRefName($ref),
      };
    }
  }
  return res;
}

function getRealType(param) {
  switch (param.type) {
    case 'integer':
    case 'number':
    case 'long': {
      if (param.format === 'int64') return 'string';
      return 'number';
    }
    case 'string': {
      if (param.enum) {
        return param.enum
          .map((it) => `"${it}"`)
          .join('|');
      }
      return 'string';
    }
    case 'boolean': {
      return 'boolean';
    }
    case 'array': {
      return `${getRealType(param.items)}[]`;
    }
    case 'object': {
      return 'any';
    }
    case 'file': {
      return 'FormData';
    }
    case 'ref': {
      if (param.refType.startsWith('List<')) {
        const item = param.refType
          .match(/<(.+?)>/g)[0]
          .replace('<', '')
          .replace('>', '');
        return `${item}[]`;
      }
      return param.refType;
    }
    default: {
      throw new Error(
        `无法识别的属性类型: ${JSON.stringify(param)}`
      );
    }
  }
}

function getResponeType(responseType) {
  switch (responseType) {
    case 'integer':
    case 'number':
    case 'string':
    case 'boolean':
    case 'object': {
      return { type: responseType };
    }
    case 'long': {
      return { type: 'string' };
    }
    case 'json':
    case 'JSON': {
      return { type: 'object' };
    }
    default: {
      if (
        responseType.startsWith('List<') ||
        responseType.startsWith('ArrayList<') ||
        responseType.startsWith('Array<')
      ) {
        const item = responseType
          .match(/<(.+?)>/g)[0]
          .replace('<', '')
          .replace('>', '');
        return {
          type: 'array',
          items: getResponeType(item),
        };
      }
      return {
        type: 'ref',
        refType: responseType,
      };
    }
  }
}

function generateCode(target, code) {
  if (typeof target === 'object') {
    for (const key in target) {
      if (typeof target[key] === 'object') {
        code += `${formatToHump(key)}: {\n`;
      }
      code = generateCode(target[key], code);
      if (typeof target[key] === 'object') {
        code += `\n},\n`;
      }
    }
  } else {
    code += target;
  }
  return code;
}

function generateApis(apis, config) {
  const apiObj = {};
  apis.forEach((api) => {
    const keys = api.endPoint.split('/').slice(2);
    let targetObj = apiObj;
    for (let i = 0; i < keys.length - 1; ++i) {
      const key = keys[i];
      if (key === config.serviceName) continue;
      if (!targetObj[key]) {
        targetObj[key] = {};
      }
      targetObj = targetObj[key];
    }

    let queryParams = []; // 函数入参params -> query
    let bodyParams = []; // 函数入参data -> body
    api.parameters?.forEach((param) => {
      switch (param.in) {
        case 'query': {
          const lines = [];
          if (param.description) {
            lines.push(`/** ${param.description} */`);
          }
          lines.push(
            `${param.name}${
              param.required ? '' : '?'
            }: ${getRealType(param)};`
          );
          queryParams.push(lines.join('\n'));
          break;
        }
        case 'formData':
        case 'body': {
          bodyParams.push(
            `data${
              !param.required ? '' : '?'
            }: ${getRealType(param)}`
          );
          break;
        }
      }
    });

    if (bodyParams.length > 1) {
      console.warn(
        `忽略接口${api.endPoint}: 接口的body参数多于1个`
      );
      return;
    }

    const funKey = keys.pop();

    let funcParams = '';
    if (queryParams.length > 0) {
      funcParams += `params:{
        ${queryParams.join('\n')}
      }`;
    }
    if (bodyParams.length > 0) {
      funcParams += `${
        queryParams.length > 0 ? ', ' : ''
      }${bodyParams.join(', ')}`;
    }
    funcParams += `${
      funcParams.length > 0 ? ', ' : ''
    }signal?: AbortSignal`;

    const requestLines = [];
    requestLines.push(`url:host + "${api.endPoint}"`);
    requestLines.push(`method:"${api.method}"`);
    requestLines.push(
      `headers:{"Content-Type":"${api.contentType}"}`
    );
    if (queryParams.length > 0) {
      requestLines.push('params');
    }
    if (bodyParams.length > 0) {
      requestLines.push('data');
    }
    requestLines.push('signal');

    const func = `/** ${api.description} */
    ${formatToHump(
      funKey
    )}(${funcParams}): Promise<${getRealType(
      api.response
    )}> {
      return http({${requestLines.join(
        ','
      )}}).then(res => res.data.data);
    },
    `;

    targetObj[funKey] = func;
  });

  return (
    generateCode(apiObj, 'export default {\n') + '};'
  );
}

function generateTypes(types, definitions) {
  let typeObj = {};
  let pendingTypes = new Set();

  generateType(types);
  while (pendingTypes.size > 0) {
    const targetSet = new Set(pendingTypes);
    generateType(targetSet);
  }

  return (
    Object.entries(typeObj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, value]) => value)
      .join('\n')
  );

  function generateType(typeSet) {
    pendingTypes.clear();
    for (const setName of typeSet) {
      let defKey = setName;
      let typeKey = setName;
      let isTemplate = false;

      if (setName.includes('<')) {
        isTemplate = true;
        const templateParameter =
          setName.match(/<(.+?)>/g);
        typeKey = setName.replace(templateParameter, '');
        defKey = setName
          .replace('<', '«')
          .replace('>', '»');

        // 添加模板参数到pendingTypes
        const templateParamTypeName = templateParameter[0]
          .replace('<', '')
          .replace('>', '');
        const templateParamTypeObj = getResponeType(
          templateParamTypeName
        );
        if (
          templateParamTypeObj.type === 'ref' &&
          !typeSet.has(templateParamTypeObj.refType)
        ) {
          pendingTypes.add(templateParamTypeObj.refType);
        }
      }

      if (typeObj[typeKey]) continue;
      if (!definitions[defKey]) continue;

      const { required, properties, description } =
        definitions[defKey];
      const props = [];
      Object.entries(properties).forEach(
        ([key, prop]) => {
          const { type, description } = prop;
          let realType = '';

          try {
            if (type === 'array') {
              if (isTemplate) {
                realType = 'T[]';
              } else {
                realType = getItemType(prop, 1);
              }
            } else {
              realType = getItemType(prop, 0);
            }
          } catch (error) {
            console.error(`${defKey}: ${error}`);
          }

          const lines = [];
          if (description) {
            lines.push(`/** ${description} */`);
          }

          let isRequired =
            required && required.includes(key);
          lines.push(
            `${key}${isRequired ? '' : '?'}: ${realType};`
          );

          props.push(lines.join('\n'));
        }
      );

      typeObj[typeKey] = `${
        description ? `/** ${description} */` : ''
      }
      export type ${typeKey}${isTemplate ? '<T>' : ''} = {
        ${props.join('\n')}
      };\n`;
    }

    function getItemType(prop, level) {
      if (prop.type === 'array') {
        const { items } = prop;
        if (items.type === 'array') {
          return getItemType(items, level + 1);
        } else {
          return getItemType(items, level);
        }
      } else {
        const { $ref } = prop;
        let realType;
        if ($ref) {
          const refTypeName = getRefName($ref);
          const refTypeObj = getResponeType(refTypeName);
          // 若类型在typeSet中不存在，则是新的依赖类型
          if (
            refTypeObj.type === 'ref' &&
            !typeSet.has(refTypeObj.refType)
          ) {
            pendingTypes.add(refTypeObj.refType);
          }
          realType = getRealType(refTypeObj);
        } else {
          realType = getRealType(prop);
        }

        while (level > 0) {
          realType += '[]';
          --level;
        }

        return realType;
      }
    }
  }
}

function generateImports(config) {
  const { httpRoute, envRoute, serviceName } = config;
  return `
  import http from '${httpRoute}'
  import env from '${envRoute}'
  const host = env.host.${serviceName}`;
}

function formatToHump(value) {
  return value
    .replace(/-/g, '_')
    .replace(/_(\w)/g, (_, letter) =>
      letter.toUpperCase()
    );
}

module.exports = generator;
