import { defineConfig } from 'umi';
import { getEnvConfig } from './src/utils/env';
const env = getEnvConfig();
export default defineConfig({
  define: env,
  nodeModulesTransform: {
    type: 'none',
  },
  chunks: ['antdesigns', 'vendors', 'umi'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
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
              path: '/allResource',
              component: './AllResource',
            },
            {
              name: '我的收藏',
              path: '/myStars',
              component: './MyFavorite',
            },
            {
              name: '搜索资源',
              path: '/searchResource',
              component: './SearchResource',
            },
            {
              name: '面试宝典',
              path: '/interview',
              component: './Processing',
            },
            {
              name: '前端社区',
              path: '/friend',
              component: './Processing',
            },
            {
              name: '更多功能',
              path: '/ranking',
              component: './Processing',
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
              path: '/success',
              component: '@/pages/Sucessed/index',
            },
            {
              path: '/',
              redirect: '/allResource',
              component: './AllResource',
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
