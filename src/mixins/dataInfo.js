/*
 * @Description: 界面公共方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditTime: 2022-11-03 10:35:31
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import { mapState, mapGetters } from 'vuex';

export default which => ({
  data() {
    return {
      [`${which}`]: {
        messageId: '',
        licenseId: '',
      },
    };
  },
  computed: {
    ...mapState('app', ['initData', 'deviceInfo', 'userInfo', 'familyInfo']),
    ...mapGetters('app', ['model']),
  },
  created() {},

  methods: {
    setNotifyInfo(title = '新的定时任务执行', enable = true) {
      // 设置通知消息
      const notifyInfo = {
        enable,
        content: title,
        title,
        version: 1,
      };
      return notifyInfo;
    },
    // 设置控制指令
    setControlInfo(params, flag = false) {
      const { userInfo, deviceInfo, familyInfo, messageId } = this;
      const { deviceID, productID, devSession, aseCookiess } = deviceInfo;
      const { userId } = userInfo;
      const { familyId, isAdmin } = familyInfo;
      let endpoint;
      const header = {
        namespace: 'DNA.KeyValueControl',
        name: 'FreeKeyValueControl',
        interfaceVersion: '2', // 版本号
        messageId,
      };
      if (isAdmin) {
        endpoint = {
          endpointId: deviceID,
          devSession,
          cookie: {
            did: deviceID,
            pid: productID,
            userId,
            familyId,
          },
        };
      } else {
        // 分享的设备
        header.interfaceVersion = '3';
        header.name = 'KeyValueControl';
        endpoint = {
          devicetypeFlag: 0, // wifi设备
          endpointId: deviceID,
          devSession,
          devinfo: {
            productId: productID, // pid
            cookie: aseCookiess,
          },
        };
      }
      // 区分柜机和挂机，新增model字段
      params.model = this.model;
      // 睡眠DIY模块sleepdiy定时，使用getSleepPlayload，其他定时使用getPayload
      const payload =
        which === 'sleep' && flag
          ? this.getSleepPlayload(params)
          : this.getPayload(params);
      const controlInfo = {
        directive: {
          header,
          endpoint,
          payload,
        },
      };
      console.log('------setControlInfo-----', controlInfo);
      return controlInfo;
    },
    getMessageId() {
      const { deviceID } = this.deviceInfo;
      return `H5_Philips_${deviceID || Date.parse(new Date()) / 1000}`;
    },
    getPayload(params) {
      // 设置定时控制命令
      const payload = {
        act: 'set',
        params: [],
        vals: [],
      };
      Object.keys(params).forEach(v => {
        payload.params.push(v);
        payload.vals.push([{ idx: 1, val: params[v] }]);
      });
      console.log('-----getPayload-----', payload);
      return payload;
    },
    getSleepPlayload(params) {
      // 设置睡眠定时控制命令
      const payload = {
        act: 'set',
        params: [],
        vals: [],
      };
      Object.keys(params).forEach(v => {
        payload.params.push(v);
        if (v !== 'sleep_diy') {
          payload.vals.push([{ idx: 1, vals: params[v] }]);
        } else {
          const sleep_diy = this.getSleepDiy(params.sleep_diy);
          payload.vals.push([{ idx: 1, vals: sleep_diy }]);
        }
      });
      console.log('-----getSleepPlayload-----', payload);
      return payload;
    },
    getSleepDiy(sleep_diy) {
      // sleep_diy处理
      // params ac_mark|temp
      const payload = {
        params: Object.keys(sleep_diy[0]),
        vals: [],
      };
      sleep_diy.forEach((v, index) => {
        for (let i = 0; i < 6; i += 1) {
          payload.vals.push([
            { idx: 1, val: sleep_diy[index].ac_mark },
            { idx: 1, val: sleep_diy[index].temp },
          ]);
        }
      });
      console.log('-----getSleepDiy-----', payload);
      return JSON.stringify(payload);
    },
    getLicenseId() {
      const { lid } = this.initData;
      return `H5_Philips_${lid || Date.parse(new Date()) / 1000}`;
    },
  },
});
