import { SHOW_GREETING } from '../const/index';
import { getTCBInstance } from '@/utils/tcb';
import login from '@/api/account/login';
import { stringify } from 'querystring';
import type { Effect, Reducer } from 'umi';
import { history } from 'umi';
import { setAuthority } from '@/utils/authority';
import { getLeftTime, getPageQuery } from '@/utils/index';
import { Button, message, notification } from 'antd';
import Cookies from 'js-cookie';
import { LOGIN_STATUS } from '@/const';
import React from 'react';

export interface LoginType {
  userId?: string;
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: LoginType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    setLoginStatus: Reducer<LoginType>;
  };
}

const notShowToday = () => {
  const expires = getLeftTime();
  // 当天有效
  Cookies.set(SHOW_GREETING, 'yes', { expires });
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    currentAuthority: 'guest',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const user = yield call(login, payload);
      if (!user || !user._id) {
        message.error('登录失败，请检查用户名，密码是否正确!');
        return '登录失败，请检查网络之后重试';
      }
      const loginStatus = {
        userId: user._id,
        currentAuthority: user.authority ?? 'user',
        type: payload.type,
      };
      yield put({
        type: 'setLoginStatus',
        payload: {
          ...loginStatus,
        },
      });
      yield put({
        type: 'user/setCurrentUser',
        payload: user,
      });
      // 不存在则设置
      if (!Cookies.get(LOGIN_STATUS)) {
        // 30 天有效期
        Cookies.set(LOGIN_STATUS, loginStatus, { expires: 30 });
      }
      if (!Cookies.get(SHOW_GREETING)) {
        // Login successfully
        notification.success({
          message: `欢迎回来，尊敬的 ${user.nickname}`,
          description: '请尽情畅游知识海洋',
          top: 64,
        });
        notShowToday();
      }
      if (window.location.pathname === '/login') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            console.log(redirect);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      Cookies.remove(LOGIN_STATUS);
      Cookies.remove(SHOW_GREETING);
      getTCBInstance()
        .tcbLogout()
        .then((r) => console.log('logout', r));
      yield put({
        type: 'setLoginStatus',
        payload: {
          userId: undefined,
          type: undefined,
          currentAuthority: 'guest',
        },
      });
      yield put({
        type: 'user/setCurrentUser',
        payload: {},
      });
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    setLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        userId: payload.userId,
        type: payload.type,
        currentAuthority: payload.currentAuthority,
      };
    },
  },
};

export default Model;
