import { IPagination } from '../pages/ToolList/type';
/**
 * 登录 Cookie 键名
 */
export const LOGIN_STATUS = 'loginStatus';

/**
 * url 动态码键名
 */
export const DYNAMIC_CAPTCHA = 'dc';

/**
 * 网站域名
 * @type {string}
 */
export const WEB_HOST = 'https://www.code-nav.cn';

/**
 * 云函数请求域名
 * @type {string}
 */
export const CLOUD_FUNCTION_HOST = 'https://your-domain';

/**
 * 分页列表状态键名
 */
export const PRE_PAGE_STATE = 'prePageState';

/**
 * 用户搜索历史  LocalStorage 键名
 */
export const SEARCH_HISTORY_KEY = 'searchHistory';

/**
 * type 0 -- 注册， 1 -- 登录, 3 -- 修改东西
 */
export const opType = {
  register: 0,
  login: 1,
  modify: 2,
};
/**
 * 登录类型
 */
export const LOGIN_TYPE = {
  CUSTOM: 'custom',
  AUTO: 'auto',
};

// 请求根路径
export const baseUrl = 'http://106.55.178.104:8889/api/';

// 本地的根路径
export const baseUrlDev = 'http://127.0.0.1:8889/api/';

// 默认的分页数据
export const defaultPagination: IPagination = {
  page: 1,
  pageSize: 12,
  total: 0,
};
