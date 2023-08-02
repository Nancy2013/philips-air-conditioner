<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditors: Please set LastEditors * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <bl-page-wrapper>
    <div slot="content" class="operate">
      <bl-navbar :title="getTitles" />
      <bl-panel
        v-for="item in data"
        :key="item.value"
        :title="item.text"
        :icon="item.value === timerInfo.action[key] ? checked : ''"
        @click="() => setOperate(item.value)"
      />
    </div>
  </bl-page-wrapper>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import config from 'configPath';
import checked from 'stylesPath/images/checked.svg';

export default {
  name: 'Operate',
  components: {},
  props: {},
  data() {
    return {
      checked,
      key: this.$route.params.key,
      data: [],
    };
  },
  computed: {
    ...mapState('timer', ['timerInfo']),
    ...mapGetters('app', ['ac_modes']),
    getTitles() {
      const { key } = this;
      const title = key === 'pwr' ? '开关' : '模式';
      return title;
    },
  },
  watch: {},
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapMutations('timer', ['updateTimerInfo']),
    init() {
      const { key, ac_modes } = this;
      this.data = key === 'pwr' ? config[`${key}s`]() : ac_modes;
      console.log('----timerInfo----', this.timerInfo);
    },
    setOperate(val) {
      const { key } = this;
      const { action = {} } = this.timerInfo;
      action[key] = val;
      if (key === 'pwr' && val === 0) {
        // 设置开关关闭
        this.updateTimerInfo({ action: { pwr: 0 } });
      } else {
        this.updateTimerInfo({ action });
      }

      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.operate {
  padding: 40px 0;
}
</style>
