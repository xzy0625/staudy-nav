import React, { useState, useRef, useLayoutEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';
import { connect, CurrentUser } from 'umi';
import { ConnectState } from '@/models/connect';
import { NoAuth } from '@/components/NoAuth';

const { Item } = Menu;

type AccountSettingsStateKeys =
  | 'base'
  | 'security'
  | 'binding'
  | 'notification';
type AccountSettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: AccountSettingsStateKeys;
};

interface IProps {
  currentUser: CurrentUser;
  [props: string]: any;
}

const AccountSettings: React.FC<IProps> = (props: IProps) => {
  const { currentUser } = props;

  const menuMap: Record<string, React.ReactNode> = {
    base: '基本设置',
    security: '安全设置',
    binding: '账号绑定',
    notification: '新消息通知',
  };

  const [initConfig, setInitConfig] = useState<AccountSettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });
  const dom = useRef<HTMLDivElement>();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({
        ...initConfig,
        mode: mode as AccountSettingsState['mode'],
      });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => (
      <Item key={item}>{menuMap[item]}</Item>
    ));
  };

  const renderChildren = () => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView currentUser={currentUser} />;
      case 'security':
        return <SecurityView />;
      case 'binding':
        return <BindingView />;
      case 'notification':
        return <NotificationView />;
      default:
        return null;
    }
  };

  return currentUser._id ? (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            dom.current = ref;
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={initConfig.mode}
            selectedKeys={[initConfig.selectKey]}
            onClick={({ key }) => {
              setInitConfig({
                ...initConfig,
                selectKey: key as AccountSettingsStateKeys,
              });
            }}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  ) : (
    <NoAuth />
  );
};

export default connect(({ loading, user, tag }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AccountSettings);
