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
      name: '注册页',
      path: '/register',
      component: './UserRegister',
    },
    {
      name: '登录页',
      path: '/login',
      component: './UserLogin',
    },
    {
      path: '/404',
      component: './404',
    },
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
              path: '/index',
              component: '@/components/BasicLayout/index',
              authority: ['user', 'admin'],
            },
            {
              path: '/resourseDetail',
              component: '@/pages/ResourceDetail/index',
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
              name: '推荐资源',
              path: '/addResource',
              component: './AddResource',
            },
            {
              path: '/*',
              redirect: '/404',
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
  // postCSS插件
  extraPostCSSPlugins: [
    require('tailwindcss')({
      config: './tailwind.config.ts',
    }),
  ],
  fastRefresh: {},
  antd: {},
  dva: {
    hmr: true,
  },
});
