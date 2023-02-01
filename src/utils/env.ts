// import * as dotenv from 'dotenv'
// import path from 'path';

// dotenv似乎和umi的env冲突了，这里自己处理一下吧，妈的
// dotenv.config({ path: path.resolve(__dirname, './.env')});
import env from '../config/env.json';
import envTest from '../config/env.test.json';

// 是否是测试环境
export const ISDEV = process.env.NODE_ENV === "development";

const globalEnv = {} as any;

export const getEnvConfig = () => {
  if (ISDEV) {
    // 测试环境和正式环境可以单独处理，这里先不处理
  }
  if (Object.keys(globalEnv).length) {
    return globalEnv;
  }
  const obj = {...envTest, ...env} as Record<string, any>;
  Object.keys(obj).forEach((item) => {
    globalEnv[`process.env.${item}`] = obj[item];
  })

  return globalEnv
}