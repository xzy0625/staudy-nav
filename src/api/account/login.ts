import { getTCBInstance } from '@/utils/tcb';

interface IReister {
  username: string;
  password: string;
  phone: string;
  [props: string]: any;
}

const app = getTCBInstance();

// 登录操作
const login = ({
  username,
  password,
  userId,
  type,
}: {
  username?: string;
  password?: string;
  userId: string;
  type: string;
}): Promise<IAnyObject> => {
  // console.log(username, password, userId, type, '开始登录');
  return new Promise((resolve, reject) => {
    try {
      app
        .callFunction({
          name: 'login',
          data: {
            username,
            password,
            userId,
            type,
          },
        })
        .then(({ result = {} }: IAnyObject) => {
          if (result.code !== 0) {
            reject('登录失败，请重试');
          }
          resolve(result?.data?.[0]);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export default login;
