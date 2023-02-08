import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Col,
  Input,
  Popover,
  Progress,
  Row,
  Select,
  message,
} from 'antd';
import type { Store } from 'antd/es/form/interface';
import { Link, history } from 'umi';
import { sleep, validatePhnoeNubmer } from '../../utils/index';
import sendCode from '../../api/account/code';
import styles from './style.less';
import register from '@/api/account/register';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

// 倒计时hooks
const useTimer = (number: number) => {
  let interval: number | undefined;
  const [count, setCount]: [number, any] = useState(0);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const start = () => {
    // 在倒计时的时候就不让用了
    if (count) {
      return;
    }
    let counts = number - 1;
    setCount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setCount(counts);
      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  return [count, start] as [number, any];
};

const UserRegister: FC = () => {
  const [count, startTimer]: [number, any] = useTimer(60);
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [prefix, setPrefix]: [string, any] = useState('86');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const [loading, setLoading]: [boolean, any] = useState(false);
  const confirmDirty = false;
  const [form] = Form.useForm();

  // 获取验证码
  const onGetcode = async () => {
    const phone = form.getFieldValue('phone');
    if (!validatePhnoeNubmer(phone)) {
      message.error('请先输入正确的手机号码');
      return;
    }
    const data = await sendCode({ phone });

    if (data?.code !== 0) {
      message.error(data?.msg || '验证码发送失败');
      return;
    } else {
      message.info('验证码发送成功');
    }
    startTimer();
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const onFinish = async (values: Store) => {
    console.log(values, '......');
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await register(values);
      if (res.code === 0) {
        message.info('注册成功，即将跳转登录');
        await sleep(2000);
        history.push({ pathname: '/login' });
      } else {
        throw new Error(res.msg);
      }
    } catch (error) {
      message.error(`注册失败，失败原因 ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码!');
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  const changePrefix = (value: string) => {
    setPrefix(value);
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <>
      <div className={styles.container}></div>
      <div className={styles.main}>
        <h3>注册</h3>
        <Form form={form} name="UserRegister" onFinish={onFinish}>
          <FormItem
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input size="large" placeholder="用户名" />
          </FormItem>
          <Popover
            getPopupContainer={(node) => {
              if (node && node.parentNode) {
                return node.parentNode as HTMLElement;
              }
              return node;
            }}
            content={
              visible && (
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <span>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </span>
                  </div>
                </div>
              )
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={visible}
          >
            <FormItem
              name="password"
              className={
                form.getFieldValue('password') &&
                form.getFieldValue('password').length > 0 &&
                styles.password
              }
              rules={[
                {
                  validator: checkPassword,
                },
              ]}
            >
              <Input
                size="large"
                type="password"
                placeholder="至少6位密码，区分大小写"
              />
            </FormItem>
          </Popover>
          <FormItem
            name="confirm"
            rules={[
              {
                required: true,
                message: '确认密码',
              },
              {
                validator: checkConfirm,
              },
            ]}
          >
            <Input size="large" type="password" placeholder="确认密码" />
          </FormItem>
          <InputGroup compact>
            <Select
              size="large"
              value={prefix}
              onChange={changePrefix}
              style={{ width: '20%' }}
            >
              <Option value="86">+86</Option>
              <Option value="87">+87</Option>
            </Select>
            <FormItem
              style={{ width: '80%' }}
              name="phone"
              rules={[
                {
                  required: true,
                  message: '请输入手机号!',
                },
                {
                  pattern: /^\d{11}$/,
                  message: '手机号格式错误!',
                },
              ]}
            >
              <Input size="large" placeholder="手机号" />
            </FormItem>
          </InputGroup>
          <Row gutter={8}>
            <Col span={16}>
              <FormItem
                name="code"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码!',
                  },
                ]}
              >
                <Input size="large" placeholder="验证码" />
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                size="large"
                disabled={!!count}
                className={styles.getcode}
                onClick={onGetcode}
              >
                {count ? `${count} s` : '获取验证码'}
              </Button>
            </Col>
          </Row>
          <FormItem>
            <Button
              size="large"
              loading={loading}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <span>注册</span>
            </Button>
            <Link className={styles.login} to="/login">
              <span>使用已有账户登录</span>
            </Link>
          </FormItem>
        </Form>
      </div>
    </>
  );
};
export default UserRegister;
