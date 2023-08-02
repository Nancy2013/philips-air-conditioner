<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-11-03 10:36:34
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div slot="content" class="timerList">
    <bl-navbar :background="'#14726C'" :title-color="'#fff'" title="定时" />
    <Empty v-if="setType" :type="setType" />
    <Data v-else />
  </div>
</template>
<script>
import Empty from './empty.vue';
import Mix from '@/mixins';
import Data from './data.vue';

const { DataInfoCreaterMix, TimerListCreaterMix } = Mix;
export default {
  name: 'Timer',
  components: {
    Empty,
    Data,
  },
  mixins: [DataInfoCreaterMix('timer'), TimerListCreaterMix('timer')],
  props: {},
  data() {
    return {};
  },
  computed: {
    timerList() {
      const getTimerList = this.$store.getters['timer/getTimerList'];
      return getTimerList;
    },
  },
  watch: {},
  created() {
    this.queryTimer();
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.timerList {
  background: @bl-body-background;
}
</style>
