const fs = require('fs');
const path = require('path');
const axios = require('axios');
const prettier = require('prettier');

const generator = require('./serviceGenerator');

async function generateService(service, config) {
  try {
    const res = await axios
      .get(service.apiDoc)
      .then((res) => res.data);
    const code = generator(res, {
      ...config,
      serviceName: service.name,
      ignorePaths: service.ignorePaths,
    });

    if (code) {
      const apiDir = path.join(
        process.cwd(),
        'src',
        'api'
      );
      if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(apiDir, `${service.name}.ts`),
        prettier.format(code, {
          parser: 'babel',
        }),
        'utf-8'
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function generate() {
  const rootPath = path.join(process.cwd(), 'scripts');
  const configFile = path.join(rootPath, 'api.config.js');
  if (!fs.existsSync(configFile)) {
    console.error(
      `找不到${rootPath}/api.config.js,请在项目根目录scripts文件夹下配置api.config.js文件`
    );
    return;
  }

  const config = require(configFile);
  const { services, ...restConfig } = config;

  for (const service of services) {
    await generateService(service, restConfig);
  }
}

generate();
