/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import service from 'servicePath/index';
import Toast from 'vant/lib/toast';
import { statusBarHeight, ratio } from 'utilsPath/device';
import { notifyError, setCookies, combine } from 'utilsPath';
import config from 'configPath';
import { control, ready, getState, updateDefaultControlOpts } from '@/logic';

const { sdkAsk } = service;

const app = {
  namespaced: true,
  state: {
    initData: {},
    userInfo: {},
    familyInfo: {},
    deviceInfo: {},
    systemSettings: {},
    appSettings: {},
    statusBarHeight: 0,
    deviceStatus: {
      name: '',
      online: 0,
      status: {},
    },
    ready: false,
  },

  mutations: {
    updateInitData(state, payload) {
      state.initData = Object.assign({}, state.initData, { ...payload });
    },
    updateUserInfo(state, payload) {
      state.userInfo = Object.assign({}, state.userInfo, { ...payload });
    },
    updateFamilyInfo(state, payload) {
      state.familyInfo = Object.assign({}, state.familyInfo, { ...payload });
    },
    updateDeviceInfo(state, payload) {
      state.deviceInfo = Object.assign({}, state.deviceInfo, { ...payload });
    },
    updateSystemSettings(state, payload) {
      state.systemSettings = Object.assign({}, state.systemSettings, {
        ...payload,
      });
    },
    updateAppSettings(state, payload) {
      state.appSettings = Object.assign({}, state.appSettings, {
        ...payload,
      });
    },
    updateDeviceStatus(state, payload) {
      state.deviceStatus = Object.assign({}, state.deviceStatus, {
        ...payload,
      });
    },
    updateStatusBarHeight(state, payload) {
      state.statusBarHeight = payload;
    },
    updateReady(state, payload) {
      state.ready = payload;
    },
  },

  getters: {
    status: state => {
      const { status } = state.deviceStatus;
      console.log('----combine status-----', JSON.stringify(status));
      return status;
    },
    online: state => {
      // 0/1/2/3 // 设备状态未知/本地/远程/离线
      const online = state.deviceStatus.online !== '3';
      return online;
    },
    model: state => {
      // 区分挂机与柜机，挂机：1  柜机：0
      const { productID } = state.deviceInfo;
      const guiJiPids = [
        '00000000000000000000000091690000',
        '0000000000000000000000001d520000',
      ];
      const model = guiJiPids.includes(productID) ? 0 : 1;
      console.log('---getters---model---', model);
      return model;
    },
    ac_modes: (state, getters) => {
      const ac_modes = config.ac_modes();
      if (getters.model === 0) {
        // 柜机无自动
        ac_modes.pop();
      }

      return ac_modes;
    },
  },

  actions: {
    // 加载sdk
    sdkReady({ commit, dispatch }) {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
      });
      return sdkAsk
        .sdkReady()
        .then(async result => {
          console.log('【sdkReady】', JSON.stringify(result));
          await dispatch('getDeviceInfo');
          await dispatch('initSDK');
          await dispatch('getUserInfo');
          await dispatch('getFamilyInfo');
          dispatch('setHeader');
          Toast.clear();
          commit('updateDeviceStatus', { ...result, status: {} });
          dispatch('getDeviceStatus');
          return result;
        })
        .catch(e => notifyError(e));
    },
    initSDK({ commit }) {
      return sdkAsk
        .initSDK()
        .then(result => {
          const initData = result;
          if (initData.apphost) {
            localStorage.setItem('host', initData.apphost);
          }
          commit('updateInitData', initData);
        })
        .catch(e => notifyError(e));
    },
    // 查询设备信息
    getDeviceInfo({ commit, state }) {
      return sdkAsk
        .getDeviceInfo()
        .then(result => {
          const deviceInfo = result;
          deviceInfo.aseCookiess = setCookies(deviceInfo.key);
          commit('updateDeviceInfo', deviceInfo);
        })
        .catch(e => notifyError(e));
    },
    // 查询用户信息
    getUserInfo({ commit, state }) {
      return sdkAsk
        .getUserInfo()
        .then(result => {
          const userInfo = result;
          commit('updateUserInfo', userInfo);
        })
        .catch(e => notifyError(e));
    },
    // 查询家庭信息
    getFamilyInfo({ commit, state }) {
      return sdkAsk
        .getFamilyInfo()
        .then(result => {
          const userInfo = result;
          commit('updateFamilyInfo', userInfo);
        })
        .catch(e => notifyError(e));
    },
    // 获得导航栏高度
    getStatusBar({ commit }) {
      sdkAsk
        .getSystemSettings()
        .then(result => {
          const setting = result;
          let height = 0;
          if (setting && setting.statusBarHeight > 0) {
            height = setting.statusBarHeight / ratio;
          }
          const statusBar = height || statusBarHeight;
          commit('updateSystemSettings', setting);
          commit('updateStatusBarHeight', statusBar);
        })
        .catch(e => notifyError(e));
    },
    getAppSettings({ commit }) {
      // 查询app设置
      sdkAsk
        .getAppSettings()
        .then(result => {
          const appSettings = result;
          commit('updateAppSettings', appSettings);
        })
        .catch(e => notifyError(e));
    },

    /**
     * 获取设备状态
     */
    getDeviceStatus({ state, commit, dispatch }) {
      const updateStatus = async () => {
        const { status } = state.deviceStatus;
        const deviceStatus = await getState();
        commit('updateDeviceStatus', {
          ...deviceStatus,
          status: { ...status, ...deviceStatus.status },
        });
      };

      updateDefaultControlOpts({
        updateStrategy: 'immediate',
        // execDelayTimeout: 200,
        retry: {
          errorCode: ['-3004', '-3006', '-4000'],
          retryCount: 2,
        },
      });

      ready(updateStatus)
        .then(res => {
          commit('updateReady', true);
        })
        .catch(e => console.error(e))
        .finally(() => {
          dispatch('getDeviceType');
        });
    },

    // 查询环境温度|错误码,30s轮询一次
    getDeviceType({ state, commit, dispatch }) {
      const getDeviceType = async () => {
        const { deviceID, subDeviceID } = await getState();
        if (deviceID) {
          // 设备控制时不查询
          sdkAsk
            .getDeviceType(deviceID, subDeviceID)
            .then(async result => {
              if (result && result.data) {
                const deviceType = combine(result.data) || {};
                console.log(
                  '----getDeviceType-----',
                  JSON.stringify(deviceType)
                );
                // 读取最新设备状态
                const deviceStatus = await getState();
                const { status } = deviceStatus;
                console.log(
                  '----getDeviceType--status---',
                  JSON.stringify(status)
                );
                if (!window.controlling) {
                  commit('updateDeviceStatus', {
                    ...deviceStatus,
                    status: { ...status, ...deviceType },
                  });
                }
              }
            })
            .catch(e => console.error(e));
        }
      };
      dispatch('fault/faultQuery', null, { root: true }).then(result => {
        getDeviceType();
      });

      window.intervalID = setInterval(() => {
        if (!window.controlling) {
          getDeviceType();
        }
      }, 30 * 1000);
    },

    // 控制设备
    control({ state, commit, getters }, params) {
      // dna设备离线状态
      if (!getters.online) {
        Toast('设备不在线');
        return;
      }
      const clearId = setTimeout(() => {
        // 500ms内控制成功不显示loading
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
        });
      }, 500);
      // 更新数据
      params.model = getters.model;
      // 设置数据
      control(params)
        .then(res => {
          Toast.clear();
          console.log('setDeviceStatus：', res);
        })
        .catch(e => {
          notifyError(e);
        })
        .finally(() => {
          if (clearId) {
            clearTimeout(clearId);
          }
        });
    },

    // 设置http 请求头
    setHeader({ state }) {
      const { userInfo, familyInfo, deviceInfo, initData } = state;
      const { userId, loginSession } = userInfo;
      const { familyId } = familyInfo;

      const getMessageId = () => {
        const { deviceID } = deviceInfo;
        return `H5_Philips_${deviceID || Date.parse(new Date()) / 1000}`;
      };
      const getLicenseId = () => {
        const { lid } = initData;
        return lid || Date.parse(new Date()) / 1000;
      };

      const messageId = getMessageId();
      const licenseId = getLicenseId();
      const language = localStorage.getItem('language');
      const headerConfig = {
        userId,
        familyId,
        loginsession: loginSession,
        messageId,
        licenseId,
        langcode: language,
      };
      this.messageId = messageId;
      this.licenseId = licenseId;
      localStorage.setItem('headerConfig', JSON.stringify(headerConfig));
    },
  },
};

export default app;
