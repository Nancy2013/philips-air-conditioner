/*
 * @Author: your name
 * @Date: 2022-03-04 17:18:29
 * @LastEditTime: 2022-11-03 10:31:13
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\store\modules\public copy.js
 */
/* eslint-disable no-new */
import service from 'servicePath/index';
import Toast from 'vant/lib/toast';
import { notifyError } from 'utilsPath';

const { httpAsk } = service;
const fault = {
  namespaced: true,
  state: {
    faultList: {},
    hideNotify: false,
  },

  mutations: {
    updateFaultList(state, payload) {
      state.faultList = Object.assign({}, state.faultList, { ...payload });
    },
    updateHideNotify(state, payload) {
      state.hideNotify = payload;
    },
  },
  getters: {},
  actions: {
    faultQuery({ commit }) {
      // 查询故障列表
      const params = {};
      return httpAsk
        .faultQuery(params)
        .then((result = {}) => {
          const { status, msg } = result;

          if (status === 0) {
            const payload = result.result || [];
            const errorCode = {};
            payload.forEach(v => {
              errorCode[v['fault-code']] = v['fault-type'];
            });
            console.log('-----setErrorCode-----', errorCode);
            commit('updateFaultList', errorCode);
          } else {
            Toast(msg);
          }
        })
        .catch(e => notifyError(e));
    },
  },
};
export default fault;
