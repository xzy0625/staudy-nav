import React, { useEffect, useState } from 'react';
import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Menu, Tooltip } from 'antd';
import type { ConnectProps } from 'umi';
import { connect, history, Link } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import classNames from 'classnames';
// import { countMyMessages } from '@/services/message';
// import { MESSAGE_STATUS_ENUM } from '@/constant/message';
import styles from './index.less';

interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser: CurrentUser;
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = (props) => {
  const { currentUser, location, dispatch } = props;
  const [unreadMessageNum, setUnreadMessageNum] = useState<number>(0);

  const total = 2;
  const loadData = async () => {
    // setUnreadMessageNum(total);
  };

  useEffect(() => {
    if (currentUser._id) {
      loadData();
    }
  }, [currentUser]);

  const onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;

    const keyPathMap = {
      accountsettings: '/accountsettings',
      message: '/account/message',
    };

    if (key === 'logout') {
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }

    const path = keyPathMap[key];
    if (location?.pathname !== path) {
      history.push(path);
    }
  };

  /**
   * 下拉菜单
   */
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="accountsettings">
        <UserOutlined />
        个人中心
      </Menu.Item>
      <Menu.Item key="message">
        <BellOutlined />
        消息中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <span style={{ color: 'red' }}>
          <LogoutOutlined />
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  );

  return currentUser?._id ? (
    <Dropdown
      overlayClassName={classNames(styles.container)}
      overlay={menuHeaderDropdown}
    >
      <div className={`${styles.action} ${styles.account}`}>
        <Badge count={unreadMessageNum}>
          {currentUser.head_img ? (
            <Avatar className={styles.avatar} src={currentUser.head_img} />
          ) : (
            <Avatar>无</Avatar>
          )}
        </Badge>
      </div>
    </Dropdown>
  ) : (
    <Tooltip title="登录后，享用全部功能" placement="bottomLeft" defaultVisible>
      <Link to="/login">
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar icon={<UserOutlined />} />
        </span>
      </Link>
    </Tooltip>
  );
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
