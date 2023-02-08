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
