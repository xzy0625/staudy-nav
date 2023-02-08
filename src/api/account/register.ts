import axios from 'axios';
import { baseUrlDev, baseUrl, opType } from '../../const/index';

// 注册用户
const register = (data: IAnyObject): Promise<IAnyObject> => {
  return new Promise((resolve, reject) => {
    try {
      return axios({
        method: 'post',
        url: `${baseUrl}tools/register`,
        data: {
          ...data,
          type: opType.register,
        },
      }).then((res: IAnyObject) => {
        console.log(res, '......');
        resolve(res?.data || {});
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default register;
