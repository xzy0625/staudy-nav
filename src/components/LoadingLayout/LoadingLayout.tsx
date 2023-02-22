import React, { useEffect, useState } from 'react';
import { getTCBInstance } from '@/utils/tcb';
import { message, Spin } from 'antd';
import Cookies from 'js-cookie';
import { DYNAMIC_CAPTCHA, LOGIN_STATUS } from '@/const';
import type { ConnectProps, Dispatch, LoginType } from '@@/plugin-dva/connect';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

interface LoadingLayoutProps extends Partial<ConnectProps> {
  dispatch: Dispatch;
  userId?: string;
}

/**
 * 页面全局加载模板
 * @constructor
 * @param props
 */
const LoadingLayout: React.FC<LoadingLayoutProps> = (props) => {
  const { children, dispatch, userId } = props;

  const [tcbLoading, setTcbLoading] = useState(true);

  async function autoLogin() {
    if (!userId) {
      // 自动登录 存在登录态 cookie
      const loginStatus: LoginType = Cookies.getJSON(LOGIN_STATUS);
      if (loginStatus && loginStatus.userId) {
        try {
          const data = await dispatch({
            type: 'login/login',
            payload: { userId: loginStatus.userId, type: 'auto' },
          });
        } catch (error) {
          message.error('自动登录失败，请手动登录');
        }
      }
    }
  }

  useEffect(() => {
    // 先初始化腾讯云然后再返回登录态数据
    getTCBInstance()
      .tcbLogin()
      .then(async () => {
        await autoLogin();
      })
      .catch((err: IAnyObject) => {
        console.error('tcbLogin error', err);
        message.error('网络连接失败，请刷新重试！');
      })
      .finally(() => {
        setTcbLoading(false);
      });
  }, []);

  return tcbLoading ? (
    <div
      style={{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin size="large" />
    </div>
  ) : (
    <>{children}</>
  );
};

export default connect(({ login }: ConnectState) => ({
  userId: login.userId,
}))(LoadingLayout);
