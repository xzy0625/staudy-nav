import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';
import {
  AppstoreOutlined,
  BarChartOutlined,
  BulbOutlined,
  GlobalOutlined,
  HomeOutlined,
  SafetyOutlined,
  SketchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Menu, Modal, notification, Result } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import HeaderSearch from '@/components/HeaderSearch';
import GlobalFooter from '@/components/GlobalFooter';
import SubMenu from 'antd/lib/menu/SubMenu';
import type { CurrentUser } from '@/models/user';
import type { ConnectState } from '@/models/connect';
import { stringify } from 'querystring';
// import { closeNoticeWatcher, openNoticeWatcher } from '@/services/notice';
import defaultSettings from '../../config/defaultSettings';
import menu from '../../config/menu';
import logo from '../../assets/logo.svg';
import './BasicLayout.less';

const noMatch = (
  <Result
    status={403}
    title="登录后即可访问"
    extra={
      <Button type="primary" size="large">
        <Link
          to={{
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }}
        >
          一键登录
        </Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  dispatch: Dispatch;
  userId?: string;
  currentAuthority: string;
  currentUser: CurrentUser;
}

/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    route,
    location = {
      pathname: '/',
    },
    userId,
    currentUser,
    currentAuthority,
  } = props;

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'tag/get',
      });
    }
    // // 公告监听
    // openNoticeWatcher((notice) => {
    //   const { title, content } = notice;
    //   notification.info({
    //     message: title,
    //     description: content,
    //     top: 64,
    //     duration: 10,
    //   });
    // });
    // return () => {
    //   closeNoticeWatcher();
    // };
  }, []);

  useEffect(() => {
    if (
      currentUser._id &&
      (!currentUser.head_img || !currentUser.nickname || !currentUser.username)
    ) {
      Modal.info({
        title: '站内提示',
        content: (
          <div>
            <p>您的身份信息暂不完善，请完善后再使用！</p>
          </div>
        ),
        onOk() {
          history.replace('/accountsettings');
        },
        okText: '立即前往',
      });
    }
    if (dispatch && userId && !currentUser._id) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {
          userId,
        },
      });
    }
  }, []);

  // get current page needed authority
  let authority;

  authority = route?.authority;
  // route?.forEach((r: IAnyObject) => {
  //   console.log(r, '.....')
  //   if (r.path === location.pathname) {
  //     authority = r.authority;
  //   }
  // });

  return (
    <ProLayout
      logo={logo}
      {...props}
      {...defaultSettings}
      layout="top"
      navTheme="realDark"
      style={{
        height: '100%',
      }}
      fixedHeader
      contentStyle={{ height: '100%' }}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      footerRender={() => <GlobalFooter />}
      // menuDataRender={() => menuDataRender(menu)}
      headerContentRender={() => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname ?? '/']}
            onClick={({ key }) => history.push(key)}
            style={{ height: '100%', border: 0 }}
          >
            {/* {currentUser._id && (
              <Menu.Item key="/account/info" icon={<HomeOutlined />}>
                个人
              </Menu.Item>
            )} */}
            <Menu.Item key="/allResource" icon={<SketchOutlined />}>
              资源合集
            </Menu.Item>
            <Menu.Item key="/myStars" icon={<AppstoreOutlined />}>
              个人收藏
            </Menu.Item>
            <Menu.Item key="/interview" icon={<BulbOutlined />}>
              面试宝典
            </Menu.Item>
            <SubMenu key="/world" icon={<GlobalOutlined />} title="发现">
              <Menu.Item key="/friend" icon={<UserAddOutlined />}>
                前端社区
              </Menu.Item>
              <Menu.Item key="/ranking" icon={<BarChartOutlined />}>
                更多功能
              </Menu.Item>
            </SubMenu>
            {currentUser._id && currentAuthority.includes('admin') && (
              <SubMenu key="/review" icon={<SafetyOutlined />} title="运营">
                <Menu.Item key="/review/resource">审核资源</Menu.Item>
                <Menu.Item key="/review/comment">审核评论</Menu.Item>
                <Menu.Item key="/review/report">审核举报</Menu.Item>
                <Menu.Item key="/review/notice">公告管理</Menu.Item>
              </SubMenu>
            )}
          </Menu>
          <div className="header-search-bar">
            <HeaderSearch placeholder="全站搜索学习资源" />
          </div>
        </div>
      )}
      rightContentRender={() => <RightContent />}
    >
      <Authorized authority={authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ loading, user, tag }: ConnectState) => ({
  currentUser: user.currentUser,
  userId: '',
  currentAuthority: '',
}))(BasicLayout);
