interface IPromiseCache<T, U extends Array<any>> {
  (...args: U): Promise<T>;
  clean: () => void;
}

/**
 * @desc 对一个promiseFn函数进行封装
 * 在pending或fulfilled(resolve)状态时，重复调用返回cache，不会重复执行promiseFn
 * rejected时，清除cache，重新调用将重新执行promiseFn
 * 如果需要手动清除缓存，直接调用 .clean() 方法
 * @param {function} promiseFn 代理函数，需返回promise
 */
export function promiseCache<T, U extends Array<any>>(
  promiseFn: (...args: U) => Promise<T>,
): IPromiseCache<T, U> {
  let cache: Promise<T> | null;

  function promiseCacheInner(...args: U) {
    // 有内存，直接返回内存中的
    if (cache) {
      return cache;
    }
    // 调用并缓存
    cache = promiseFn(...args)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        cache = null;
        throw err;
      });

    return cache;
  }

  // 手动清除缓存
  promiseCacheInner.clean = () => {
    cache = null;
  };

  return promiseCacheInner;
}
