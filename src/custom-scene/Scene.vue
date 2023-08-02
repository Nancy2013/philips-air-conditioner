<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-11-02 17:13:49
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 -->
<template>
  <div id="appview">
    <bl-page-wrapper :adapter-bottom="adapterBottom" safe-bottom>
      <div slot="content" class="scene">
        <bl-navbar
          :background="'#14726C'"
          :text-color="'#fff'"
          :left-arrow="false"
          :left-handle="cancel"
          :right-handle="save"
          left-text="取消"
          right-text="保存"
        />
        <div>
          <Info type="scene" />
          <Control :disabled="status.pwr !== 1" type="scene" />
          <SetBox type="scene" />
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
import service from 'servicePath/index';
import { mapState, mapActions, mapGetters } from 'vuex';
import Mix from '@/mixins';
import Info from '@/page/main/Info.vue';
import Control from '@/page/main/Control.vue';
import SetBox from '@/page/main/SetBox.vue';

const { sdkAsk } = service;
const { LocalStorageClearCreaterMix, StyleCreaterMix } = Mix;
export default {
  name: 'Scene',
  components: {
    Info,
    Control,
    SetBox,
  },
  mixins: [LocalStorageClearCreaterMix('scene'), StyleCreaterMix('scene')],
  computed: {
    ...mapState('app', ['deviceInfo']),
    ...mapGetters('app', ['status']),
  },
  created() {
    this.sdkReady().then(async result => {
      this.getAppSettings();
    });
  },
  beforeDestroy() {},
  methods: {
    ...mapActions('app', ['sdkReady', 'getAppSettings', 'saveScene']),
    cancel() {
      // 取消
      sdkAsk.closeWebView();
    },
    save() {
      // 保存
      const { pwr, scrdisp } = this.status;
      let params;
      if (pwr === 0) {
        params = { pwr: 0 };
        if (scrdisp === 1) {
          params.scrdisp = scrdisp;
        }
      } else {
        params = this.handleStatus();
      }
      this.saveScene(params);
    },
    handleStatus() {
      // 处理下发字段
      const { status } = this;
      const { ac_mode } = this.status;
      const modes = [3]; // 不需要下发温度的模式
      if (modes.includes(ac_mode)) {
        delete status.temp;
      }
      delete status.ac_slp; // 不下发睡眠模式
      return status;
    },
  },
};
</script>

<style lang="less">
.page {
  min-height: 100vh;
  background: @bl-green-2;
}
.scene {
  color: @bl-white;
}
</style>
