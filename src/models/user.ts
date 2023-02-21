import { likeResource } from '@/services/resource';
import type { Effect, Reducer } from 'umi';

import { message } from 'antd';

export interface CurrentUser {
  _id?: string;
  avatarUrl?: string;
  starResourceIds?: string[];
  likeResourceIds?: string[];
  nickname?: string;
  gender?: number;
  city?: string;
  province?: string;
  country?: string;
  language?: string;
  interests?: string[];
  score?: number;
  title?: string;
  head_img?: string;
  [props: string]: any;
}

export interface SimpleUser {
  _id?: string;
  avatarUrl?: string;
  nickName?: string;
  score?: number;
}

export interface UserModelState {
  currentUser: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    setCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const { userId } = payload;
      if (!userId) {
        return;
      }
      const user = {};
      if (!user) {
        message.error('获取用户信息失败，请刷新重试');
        return;
      }
      yield put({
        type: 'setCurrentUser',
        payload: user,
      });
    },
  },

  reducers: {
    setCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || undefined,
      };
    },
  },
};

export default UserModel;
