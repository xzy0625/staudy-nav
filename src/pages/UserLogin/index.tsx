import React, { useState } from 'react';
import styles from './index.less';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect, history, Link } from 'umi';
import type { Store } from 'antd/es/form/interface';
import login from '@/api/account/login';
import { sleep } from '@/utils';

const NormalLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const onFinish = async ({ username, password }: Store) => {
    console.log('Received values of form: ', username, password);
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await login({ username, password });
      if (res?.data?.length) {
        message.info('登录成功');
        await sleep(500);
        history.push({
          pathname: '/',
        });
      } else {
        message.warn('登录失败，请检查用户名和密码是否正确');
      }
      console.log(res, '....');
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

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

export default () => (
  <div className={styles.container}>
    <div id="components-form-demo-normal-login">
      <NormalLoginForm />
    </div>
  </div>
);
