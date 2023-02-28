import { LOGIN_STATUS } from '@/const/index';
import Cookies from 'js-cookie';
// import * as dotenv from 'dotenv'
// import path from 'path';

import { preloadingImages } from './utils';

// dotenv似乎和umi的env冲突了，这里自己处理一下吧，妈的
// dotenv.config({ path: path.resolve(__dirname, './.env')});

function preloader() {
  const arr = [
    'https://csuxzy-1300770696.cos.ap-guangzhou.myqcloud.com/wall1.jpg',
  ];
  // const arrCDN = ['https://csuxzy-1300770696.file.myqcloud.com/wall1.jpg'];
  preloadingImages(arr);
}

// 图片预加载，登录页面的图片太大了，我的CDN又没钱了妈的...
function addLoadEvent(func: any) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function () {
      if (oldonload) {
        oldonload();
      }
      func();
    };
  }
}

// 没有登录就有可能登录
if (!Cookies.get(LOGIN_STATUS)) {
  addLoadEvent(preloader);
}
