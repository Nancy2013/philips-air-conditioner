<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-08-05 14:59:37
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="empty">
    <template v-if="type === 'empty'">
      <div class="icon">
        <img :src="add_timer" alt="" />
      </div>
      <div class="btn">
        <van-button type="primary" size="normal" @click="add"
          >点击添加</van-button
        >
      </div>
    </template>

    <template v-if="type === 'error'">
      <div class="icon">
        <img :src="add_timer" alt="" />
      </div>
      <div class="btn">
        <van-button type="primary" size="normal" @click="reload"
          >重新加载</van-button
        >
      </div>
    </template>
  </div>
</template>
<script>
import add_timer from 'stylesPath/images/add_timer.svg';

export default {
  name: 'Empty',
  components: {},
  props: {
    flag: {
      type: String,
      default: 'timer',
    },
    type: {
      type: String,
      default: 'loading', // loading, empty, error
    },
  },
  data() {
    return {
      add_timer,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    add() {
      // 添加定时
      const { flag } = this;
      if (flag === 'timer') {
        this.$router.push('/timer/add');
      } else {
        this.$router.push('/sleep/default');
      }
    },
    reload() {
      this.$parent.queryTimer();
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
  position: relative;
}
.empty {
  text-align: center;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  .icon {
    width: 108px;
    height: 142px;
    margin-bottom: 92px;
    display: inline-block;
  }
}
</style>
