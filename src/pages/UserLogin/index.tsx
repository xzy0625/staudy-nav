import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect, ConnectProps, Dispatch, history, Link, LoginType } from 'umi';
import type { Store } from 'antd/es/form/interface';
import login from '@/api/account/login';
import { sleep } from '@/utils';
import { ConnectState } from '@/models/connect';
import { LOGIN_STATUS } from '@/const';
import Cookies from 'js-cookie';

interface UserLoginProps extends Partial<ConnectProps> {
  dispatch: Dispatch;
  userId?: string;
}

const NormalLoginForm: React.FC<UserLoginProps> = (props) => {
  const { dispatch, userId } = props;
  const [loading, setLoading] = useState(false);

  // 这里应该抽成一个单独的方法的
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
    autoLogin();
  }, []);

  const onFinish = async ({ username, password }: Store) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      dispatch({
        type: 'login/login',
        payload: { username, password, type: 'custom' },
      })
        .then((res: any) => {})
        .catch((err: any) => {
          message.error(err || '登录失败，请稍后重试');
        });
    } catch (error) {
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 已经登录的情况下点击跳转或者切换到url都直接跳转返回
    if (userId) {
      history.goBack();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>登录</h3>
        <Form
          name="normal_login"
          className={styles.form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              size="large"
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              size="large"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className={styles.forget}>记住密码</Checkbox>
            </Form.Item>

            <Link className="login-form-forgot" to="/404">
              忘记密码
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              登录
            </Button>
            <Link className={styles.login} to="/register">
              立即注册
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ login }: ConnectState) => ({
  userId: login.userId,
}))((props: IAnyObject) => (
  <div className={styles.container}>
    <div id="components-form-demo-normal-login">
      <NormalLoginForm {...props} />
    </div>
  </div>
));
