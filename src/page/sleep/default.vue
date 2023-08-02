<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-05-20 16:22:58
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="default">
    <bl-navbar
      :background="'#14726C'"
      :click-right="add"
      title-color="#fff"
      title="睡眠"
      text-color="#fff"
    />
    <div @click="() => add(0)">
      <bl-panel
        v-if="isShow(0)"
        :icon="panel_arrow"
        :click-right="() => add(0)"
        title="制冷睡眠DIY"
        class="panel"
      >
      </bl-panel>
    </div>

    <div @click="() => add(1)">
      <bl-panel
        v-if="isShow(1)"
        :icon="panel_arrow"
        :click-right="() => add(1)"
        title="制热睡眠DIY"
        class="panel"
      >
      </bl-panel>
    </div>
  </div>
</template>
<script>
import panel_arrow from 'stylesPath/images/panel_arrow.svg';
import Empty from '../timer/empty.vue';
import Mix from '@/mixins';
import Data from './data.vue';

const { DataInfoCreaterMix, TimerListCreaterMix } = Mix;
export default {
  name: 'Default',
  components: {
    Empty,
    Data,
  },
  mixins: [DataInfoCreaterMix('sleep'), TimerListCreaterMix('sleep')],
  props: {},
  data() {
    return {
      panel_arrow,
    };
  },
  computed: {
    timerList() {
      const getSleepList = this.$store.getters['timer/getSleepList'];
      return getSleepList;
    },
    isShow() {
      // 是否显示
      return function(ac_mode) {
        const { timerList } = this;
        const ac_modes = timerList.map(v => parseInt(v.name.split('_')[2]));
        const show = !ac_modes.includes(ac_mode);
        return show;
      };
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    add(ac_mode) {
      // 添加定时
      // ac_mode: 0 为制冷  1为制热；
      this.$router.push({ name: 'sleepAdd', params: { ac_mode } });
    },
  },
};
</script>

<style lang="less" scoped>
.default {
  padding-top: 40px;
  .panel {
    padding-left: 78px;
  }
  /deep/ .left .title {
    font-size: 32px;
    color: @bl-black-3;
  }
}
</style>
