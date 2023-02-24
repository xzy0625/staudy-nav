import { CurrentUser } from '@/models/user';
import { getTCBInstance } from '@/utils/tcb';
import { getDvaApp } from 'umi';

const app = getTCBInstance().app;
const db = app.database();
const collection = db.collection('user');

/**
 * 查询用户
 * @param userId
 */
export function getUserById(userId: string) {
  if (!userId) {
    return null;
  }
  return app
    .callFunction({
      name: 'getUser',
      data: {
        userId,
      },
    })
    .then(({ result }) => {
      console.log(`getUser succeed`);
      return result;
    })
    .catch((e: any) => {
      console.error('getUser error', e);
      return null;
    });
}

/**
 * 修改资源
 * @param resourceId
 * @param resource
 */
export async function updateUser(userId: string, userInfo: CurrentUser) {
  if (!userId || !userInfo) {
    return false;
  }

  const dispatch = getDvaApp()?._store?.dispatch;

  return app
    .callFunction({
      name: 'updateuser',
      data: {
        userId,
        userInfo,
      },
    })
    .then((res: any) => {
      if (res?.result?.code === 0) {
        dispatch({
          type: 'user/setCurrentUser',
          payload: res?.result?.data?.data?.[0] || {},
        });
        console.log(`updateResource succeed, id = ${userId}`, res);
        return res;
      }
      return false;
    })
    .catch((e: any) => {
      console.error(`updateResource error, id = ${userId}`, e);
      return false;
    });
}
