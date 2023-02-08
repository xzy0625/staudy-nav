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
}: {
  username: string;
  password: string;
}): Promise<IAnyObject> => {
  console.log(username, password, '开始登录');
  return new Promise((resolve, reject) => {
    try {
      app
        .callFunction({
          name: 'login',
          data: {
            username,
            password,
          },
        })
        .then(({ result = {} }: IAnyObject) => {
          console.log(result, '......登录成功');
          if (result.code !== 0) {
            reject('登录失败，请重试');
          }
          resolve(result);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export default login;
