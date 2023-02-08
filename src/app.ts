// import * as dotenv from 'dotenv'
// import path from 'path';

// dotenv似乎和umi的env冲突了，这里自己处理一下吧，妈的
// dotenv.config({ path: path.resolve(__dirname, './.env')});
import cloudbase from '@cloudbase/js-sdk';
import { getTCBInstance } from './utils/tcb';

// // 初始化云开发
getTCBInstance().tcbLogin();
