/*
 * @Description: SDK
 * @Author: your name
 * @Date: 2019-05-17 17:02:04
 * @LastEditTime: 2022-11-03 10:30:21
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import sdk from 'broadlink-jssdk';

const { platformSDK } = sdk;
export default {
  sdkReady: () => sdk.ready(), // SDK加载
  initSDK: () => platformSDK.callNative('init'), // SDK初始化
  hideNavbar: () => platformSDK.navbar.hide(), // 隐藏导航栏
  customNavbar: params => platformSDK.navbar.custom(params), // 设置导航栏
  getSystemSettings: () => platformSDK.callNative('getSystemSettings'), // 系统设置
  closeWebView: () => platformSDK.closeWebView(), // 关闭webview
  openDevicePropertyPage: () => platformSDK.openDevicePropertyPage(), // 设备属性界面
  getAppSettings: () => platformSDK.callNative('getAppSettings'), // 查询app设置
  getDeviceInfo: () => platformSDK.callNative('deviceinfo'), // 查询设备信息
  getUserInfo: () => platformSDK.callNative('getUserInfo'), // 查询用户信息
  getFamilyInfo: () => platformSDK.callNative('getFamilyInfo'), // 查询家庭信息
  getDeviceType: (deviceID, subDeviceID) => {
    // 查询设备类型及环境温度
    const [localTimeout, remoteTimeout, sendCount] = (() => {
      /*eslint-disable*/
      const profile = window.PROFILE || {};
      const [local, remote] = profile.timeout || [3, 5];
      return [local * 1000, remote * 1000, profile.sendcount || 3];
    })();
    //控制请求超时时间
    const time = {
      localTimeout: localTimeout, //本地超时时间
      remoteTimeout: remoteTimeout, //远程超时时间
      sendCount: sendCount, //请求个数
    };
    const command = 'dev_ctrl';
    const params = [
      deviceID,
      subDeviceID,
      {
        did: deviceID,
        srv: window.PROFILE.srvs,
        act: 'get',
        params: ['mode'],
        vals: [[{ val: 0, idx: 1 }]],
      },
      command,
      time,
    ];
    return platformSDK.callNative('devicecontrol', params);
  },
  // 场景
  saveSceneCmds: params => {
    return platformSDK.callNative('saveSceneCmds', [params], 'BLIftttBridge');
  },
};
