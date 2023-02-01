import { defineConfig } from 'umi';
import { getEnvConfig } from './src/utils/env';
const env = getEnvConfig();
export default defineConfig({
  define: env,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/components/LoadingLayout/LoadingLayout',
      routes: [
        {
          path: '/',
          component: '@/components/BasicLayout/index',
          routes: [
            {
              name: '资源列表',
              path: '/toolList',
              component: './ToolList',
            },
            {
              name: '注册页',
              path: '/userregister',
              component: './UserRegister',
            },
            {
              path: '/aa',
              component: '@/components/BasicLayout/test',
            },
            {
              path: '/index',
              component: '@/components/BasicLayout/index',
              authority: ['user', 'admin'],
            },
            {
              path: '/',
              redirect: '/toolList',
              component: './ToolList',
            },
            {
              name: '个人设置',
              path: '/accountsettings',
              component: './AccountSettings',
            },
            {
              path: '/404',
              component: './404',
            },
          ],
        },
      ],
    },
    {
      path: '*',
      component: './404',
    },
  ],
  fastRefresh: {},
  antd: {},
  dva: {
    hmr: true,
  },
});
