import { configWrap } from '@/cube/config_wrap';
import { promiseCache } from '@/cube/promiseWithCache';
import axios from 'axios';

let cache = {};

// 获取标签，缓存promise防止重复调用
const getTags = promiseCache(() => {
  return new Promise(async (resolve, reject) => {
    try {
      const tagsData = await axios(
        'https://json-1300770696.cos.ap-guangzhou.myqcloud.com/tags.json',
      );
      console.log(tagsData.data, '.......');
      // 封装tags之后再返回去
      resolve(configWrap(tagsData?.data || {}));
    } catch (error) {
      reject(error);
    }
  });
});

export default getTags;
