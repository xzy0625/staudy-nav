import cloudbase from '@cloudbase/js-sdk';

// 测试环境 id
const TEST_ENV_ID = 'test';

let tcbIns: TCB;

/**
 * 匿名登录
 * @return {Promise<void>}
 */
class TCB {
  // 环境ID
  private envId = process.env.CLOUDBASE_ENV_ID as string;
  app = {} as cloudbase.app.App;
  auth = {} as cloudbase.auth.App;

  // 初始化app
  initApp() {
    this.app = cloudbase.init({
      env: this.envId,
      region: 'ap-shanghai',
    });
  }

  // 登出
  tcbLogout() {
    return this.auth.signOut();
  }

  // 鉴权
  initAuth() {
    this.auth = this.app.auth({
      persistence: 'local',
    });
  }

  // 匿名登录
  async tcbLogin() {
    if (this.envId === TEST_ENV_ID) {
      return;
    }
    // 判断是不是已经登录了
    let loginState = await this.auth.getLoginState();
    if (!loginState) {
      // await this.auth.signInAnonymously();
      // const loginScope = await this.auth.loginScope();
      // 如为匿名登录，则输出 true
      // 2. 匿名登录
      await this.auth.anonymousAuthProvider().signIn();
      loginState = await this.auth.getLoginState();
      console.log('tcbLogin登录成功', loginState);
    }
  }

  // 函数调用
  callFunction({
    name = '',
    data = {},
    query = {},
    search = '',
    parse = false,
  }: cloudbase.functions.ICallFunctionOptions): Promise<IAnyObject> {
    // 函数调用
    return this.app.callFunction({
      name,
      data,
      query,
      search,
      parse,
    });
  }

  // 存储调用
}

export const getTCBInstance = () => {
  if (tcbIns) {
    return tcbIns;
  }

  tcbIns = new TCB();
  tcbIns.initApp();
  tcbIns.initAuth();
  return tcbIns;
};
