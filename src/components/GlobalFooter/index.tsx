import { DefaultFooter } from '@ant-design/pro-layout';
import { Tooltip } from 'antd';
import {
  GithubOutlined,
  InfoCircleOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import wechat from '@/assets/wechat.jpeg';
import React from 'react';

const GlobalFooter: React.FC = () => {
  return (
    <DefaultFooter
      copyright="2022 学习导航 | 湘ICP备2021020539号-1"
      links={[
        {
          key: 'github',
          title: (
            <Tooltip title="查看本站技术及源码，欢迎 star">
              <GithubOutlined /> 支持项目
            </Tooltip>
          ),
          href: 'https://github.com/xzy0625/staudy-nav',
          blankTarget: true,
        },
        {
          key: 'contact',
          title: (
            <Tooltip
              title={<img src={wechat} alt="微信 code_nav" width="200" />}
            >
              <WechatOutlined /> 联系作者
            </Tooltip>
          ),
          href: 'http://csu_xzy.gitee.io/stadu-nav-doc/#/?id=%e5%85%b3%e4%ba%8e%e4%bd%9c%e8%80%85',
          blankTarget: true,
        },
        {
          key: 'info',
          title: (
            <>
              <InfoCircleOutlined /> 免责声明
            </>
          ),
          href: 'http://csu_xzy.gitee.io/stadu-nav-doc/#/?id=%e5%85%8d%e8%b4%a3%e5%a3%b0%e6%98%8e',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default GlobalFooter;
