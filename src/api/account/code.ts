import axios from 'axios';
import { baseUrlDev, baseUrl, opType } from '../../const/index';

// 发送短信验证吗
const sendCode = ({
  phone = '',
  username = '',
  type = opType.register,
}): Promise<IAnyObject> => {
  return new Promise((resolve, reject) => {
    try {
      return axios({
        method: 'post',
        url: `${baseUrl}tools/getCode`,
        data: {
          phone,
          username,
          type,
        },
      }).then((res: IAnyObject) => {
        resolve(res?.data || {});
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default sendCode;
