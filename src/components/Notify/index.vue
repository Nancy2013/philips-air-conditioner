<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-07-28 10:28:02
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div :style="{ ...styleConfig }" class="notify">
    <slot name="content">
      <div class="message">{{ message }}</div>
    </slot>
    <span class="icon" @click="close">
      <img :src="closeIcon" alt="" />
    </span>
  </div>
</template>
<script>
import closeIcon from '@/components/images/close.svg';

export default {
  name: 'Notify',
  components: {},
  props: {
    message: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '#f00',
    },
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      closeIcon,
      styleConfig: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.setStyle();
  },
  mounted() {},
  methods: {
    // 设置样式
    setStyle() {
      const { background } = this;
      const styles = {
        background,
      };

      this.styleConfig = Object.assign({}, this.styleConfig, { ...styles });
    },
    // 关闭提示
    close() {
      this.$emit('close', false);
    },
  },
};
</script>

<style lang="less" scoped>
.notify {
  text-align: center;
  position: fixed;
  width: 100%;
  color: @bl-white;
  font-size: 30px;
  padding: 30px 16px;
  z-index: @notify-z-index;
  .message {
    padding: 15px 0;
  }
  span.icon {
    position: absolute;
    padding: 0 20px;
    top: 50%;
    right: 16px;
    transform: translate(0, -50%);
  }
}
</style>
