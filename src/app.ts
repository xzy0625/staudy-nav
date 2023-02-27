// import * as dotenv from 'dotenv'
// import path from 'path';

import { preloadingImages } from './utils';

// dotenv似乎和umi的env冲突了，这里自己处理一下吧，妈的
// dotenv.config({ path: path.resolve(__dirname, './.env')});

function preloader() {
  const arr = ['http://resource.zyxiong.com/static/wall1.8457eb48.jpg'];
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

addLoadEvent(preloader);
