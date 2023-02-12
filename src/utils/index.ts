export const validatePhnoeNubmer = (phone: string) => {
  const isEmpty = phone === '' || phone === null || phone === undefined;
  //判断手机号格式是否正确
  const regExp = /^1[3456789]\d{9}$/;
  return regExp.test(phone) && !isEmpty;
};

export const sleep = (time: number) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(null);
    }, time),
  );

/**
 * 让查询支持分页
 * @param query
 * @param pageSize
 * @param pageNum
 */
export const wrapPageQuery = (
  query: any,
  pageSize?: number,
  pageNum?: number,
) => {
  if (pageSize) {
    query = query.limit(pageSize);
    if (pageNum) {
      query = query.skip(pageSize * (pageNum - 1));
    }
  }
  return query;
};

// 检测url是否正确
export const URL_REG =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
