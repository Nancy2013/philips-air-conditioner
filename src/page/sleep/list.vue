<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-11-03 10:35:58
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="timerList">
    <bl-navbar
      :background="'#14726C'"
      :left-handle="goHome"
      title-color="#fff"
      title="睡眠"
      text-color="#fff"
    />
    <Empty v-if="setType" :type="setType" flag="sleep" />
    <Data v-else />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Toast from 'vant/lib/toast';
import Empty from '../timer/empty.vue';
import Mix from '@/mixins';
import Data from './data.vue';

const { DataInfoCreaterMix, TimerListCreaterMix } = Mix;
export default {
  name: 'List',
  components: {
    Empty,
    Data,
  },
  mixins: [DataInfoCreaterMix('sleep'), TimerListCreaterMix('sleep')],
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters('app', ['status']),
    timerList() {
      const getSleepList = this.$store.getters['timer/getSleepList'];
      return getSleepList;
    },
  },
  watch: {},
  created() {
    this.queryTimer();
  },
  mounted() {},
  methods: {
    ...mapActions('app', ['control']),
    goHome() {
      // 返回到主界面
      this.$router.push('/portal');
    },
    setSleepdiy() {
      const { control } = this;
      const { sleepdiy, ac_mode } = this.status;
      const ac_modes = [0, 1]; // 制冷、制热模式
      if (sleepdiy === 1) {
        if (!ac_modes.includes(ac_mode)) {
          Toast('制冷、制热模式下支持设置睡眠DIY');
          return;
        }
      }
      control({ sleepdiy: sleepdiy === 1 ? 0 : 1 });
    },
  },
};
</script>

<style lang="less" scoped></style>
