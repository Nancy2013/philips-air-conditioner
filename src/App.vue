<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-11-03 10:28:33
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 -->
<template>
  <div id="appview">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Mix from '@/mixins';

const { LocalStorageClearCreaterMix, DataInfoCreaterMix } = Mix;
export default {
  name: 'App',
  components: {},
  mixins: [LocalStorageClearCreaterMix('app'), DataInfoCreaterMix('app')],
  data() {
    return {};
  },
  computed: {
    ...mapState('app', ['initData', 'deviceInfo']),
  },
  created() {
    this.sdkReady().then(result => {
      this.getStatusBar();
      this.getAppSettings();
      if (!window.timerIntervalID) {
        this.queryTimer();
        window.timerIntervalID = setInterval(() => {
          this.queryTimer();
        }, 20 * 1000); // 20s轮询
      }
    });
  },
  mounted() {},
  beforeDestroy() {
    localStorage.clear();
    // 查询环境温度
    if (window.intervalID) {
      clearInterval(window.intervalID);
      window.intervalID = null;
    }
    // 云端定时轮询
    if (window.timerIntervalID) {
      clearInterval(window.timerIntervalID);
      window.timerIntervalID = null;
    }
  },
  methods: {
    ...mapActions('app', ['sdkReady', 'getStatusBar', 'getAppSettings']),
    ...mapActions('timer', ['query']),
    queryTimer() {
      // 查询定时列表
      const { deviceID } = this.deviceInfo;
      const params = {
        endpointid: deviceID,
      };
      this.query(params).catch(e => {
        console.error(e);
      });
    },
  },
};
</script>

<style lang="less"></style>
