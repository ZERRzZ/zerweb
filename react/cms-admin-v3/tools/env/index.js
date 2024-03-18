const fs = require('fs');
const path = require('path');

function buildEnv() {
  const rootPath = path.join(process.cwd(), 'scripts');
  const basePath = path.join(rootPath, 'env.base.json');

  let config = {};
  if (fs.existsSync(basePath)) {
    const baseConfig = require(basePath);
    config = {
      ...baseConfig,
    };
  }
  const env = process.argv[2] || 'test';
  const envPath = path.join(rootPath, `env.${env}.json`);
  if (fs.existsSync(envPath)) {
    const envConfig = require(envPath);
    config = {
      ...config,
      ...envConfig,
    };
  } else {
    console.error(`找不到${envPath},请确定文件存在`);
    return;
  }

  config.env = env;
  let platform = {
    android: 'android/app/src/main/assets',
    ios: 'ios',
    web: '/src/constants',
  };
  config.platform &&
    config.platform.forEach((element) => {
      const mockDir = path.join(
        process.cwd(),
        platform[element]
      );
      if (!fs.existsSync(mockDir)) {
        fs.mkdirSync(mockDir);
      }
      buildPlatform(element, platform[element], config);
    });
}

function buildPlatform(platform, output, config) {
  let platformConfig = {};
  platformConfig = traversalNode(config, platform);

  output = path.join(process.cwd(), output, 'env.json');
  platformConfig = Object.assign(
    {
      desc: `自动生成${platform}配置文件，不要编辑本文件！！！`,
    },
    platformConfig
  );

  fs.writeFileSync(
    output,
    `${JSON.stringify(platformConfig, null, 2)}`,
    'utf8'
  );
}

function traversalNode(node, platform) {
  if (typeof node !== 'object') return node;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { ios, web, android, ...newNode } = node;
  if (node[platform]) {
    if (typeof node[platform] !== 'object') {
      return node[platform];
    }

    Object.assign(newNode, {
      ...node[platform],
    });
  }
  for (let key in newNode) {
    newNode[key] = traversalNode(newNode[key], platform);
  }
  return newNode;
}
buildEnv();
