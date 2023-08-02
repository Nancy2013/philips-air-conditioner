/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-11-02 16:38:36
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import service from 'servicePath/index';
import Toast from 'vant/lib/toast';
import { notifyError, centigradeToFahrenheit } from 'utilsPath';
import config from 'configPath';
import i18n from 'localePath/index';

const { sdkAsk } = service;
const scene = {
  namespaced: true,
  state: {
    appSettings: {},
    deviceInfo: {},
    deviceStatus: {
      name: 'scene status',
      online: '2',
      status: {
        pwr: 1,
        ac_mode: 1,
        temp: 260,
        ac_mark: 1,
        ac_hdir: 1,
        ac_astheat: 1,
        ac_vdir: 0,
        ecomode: 0, // TODO 节能ecomode与睡眠模式ac_slp存在互斥，打开节能需关闭睡眠模式
        scrdisp: 0,
      },
    },
  },

  mutations: {
    updateDeviceInfo(state, payload) {
      state.deviceInfo = Object.assign({}, state.deviceInfo, { ...payload });
    },
    updateDeviceStatus(state, payload) {
      const { deviceStatus } = state;
      const { status } = deviceStatus;
      Object.keys(payload).forEach(v => {
        status[v] = payload[v];
      });
      state.deviceStatus = Object.assign({}, state.deviceStatus, {
        ...deviceStatus,
        status,
      });
    },
    updateAppSettings(state, payload) {
      state.appSettings = Object.assign({}, state.appSettings, {
        ...payload,
      });
    },
  },

  getters: {
    status: state => state.deviceStatus.status,
    online: () => true,
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
    sdkReady({ getters, commit, dispatch }) {
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
          const search = decodeURIComponent(window.location.search); // 处理特殊字符
          console.log('------search---', search);
          const searchParams = new URLSearchParams(search); // 格式化url参数
          const data = searchParams.get('data'); // 获得data参数
          const { status } = getters;
          if (data) {
            // 初始化状态
            console.log('-----data------', JSON.parse(data));
            const cmds = JSON.parse(data).cmds || [];
            if (cmds.length > 0) {
              const { params, vals } = cmds[0];
              params.forEach((v, index) => {
                // 过滤设备型号
                if (v !== 'model') {
                  status[v] = vals[index];
                }
              });
              console.log('------init status-----', JSON.stringify(status));
            }
          }
          commit('updateDeviceStatus', status);
          Toast.clear();
          return result;
        })
        .catch(e => notifyError(e));
    },

    // 查询设备信息
    getDeviceInfo({ commit, state }) {
      return sdkAsk
        .getDeviceInfo()
        .then(result => {
          const deviceInfo = result;
          commit('updateDeviceInfo', deviceInfo);
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
    // 控制设备
    control({ state, commit }, params) {
      commit('updateDeviceStatus', { ...params });
      console.error('updateDeviceStatus: ', JSON.stringify(params));
    },
    // 保存场景
    saveScene({ state, commit, getters }, params) {
      const cmds = [];
      console.log('----params-----', params);

      const getDesc = descParams => {
        // 属性描述
        let desc = '';
        Object.keys(descParams).forEach(key => {
          const isString = typeof i18n.t(key) === 'string'; // 开关量
          const value = descParams[key];
          if (desc.length > 0) {
            desc += '、';
          }
          if (key === 'temp') {
            // 温度
            const { tempUnit = 'C' } = state.appSettings;
            desc +=
              tempUnit === 'C' ? value / 10 : centigradeToFahrenheit(value);
            desc += tempUnit === 'C' ? '℃' : '℉';
          } else {
            desc += isString ? i18n.t(key) : i18n.t(`${key}.name`);
            desc += isString
              ? i18n.t(`status.${value}`)
              : i18n.t(`${key}.${value}`);
          }
        });
        return desc;
      };

      Object.keys(params).forEach(key => {
        const value = params[key];
        cmds.push({
          name: getDesc({ [key]: value }),
          params: [key],
          vals: [value],
        });
      });

      const { deviceID } = state.deviceInfo;
      const sceneCmd = {
        did: deviceID,
        name: getDesc(params),
      };
      // 兼容柜机与挂机，下发新增model字段
      if (params.pwr === 1) {
        // 开机状态
        cmds.push({
          name: '',
          params: ['model'],
          vals: [getters.model],
        });
      }
      sceneCmd.cmds = cmds;

      console.log('-----saveScene-----', sceneCmd);
      console.log(JSON.stringify(sceneCmd));
      sdkAsk
        .saveSceneCmds(sceneCmd)
        .then(result => {
          sdkAsk.closeWebView();
        })
        .catch(e => notifyError(e));
    },
  },
};

export default scene;
