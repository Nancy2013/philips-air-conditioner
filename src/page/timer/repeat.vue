<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-03-03 10:39:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <bl-page-wrapper>
    <div slot="content" class="repeat">
      <bl-navbar title="重复" />
      <div class="tips">不勾选将默认只执行一次</div>
      <bl-panel
        v-for="(item, $index) in repeats"
        :key="$index"
        :title="item"
        :icon="timerInfo.repeat.includes($index) ? checked : unchecked"
        :click-right="() => setRepeat($index)"
      />
    </div>
  </bl-page-wrapper>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import checked from 'stylesPath/images/checked.svg';
import unchecked from 'stylesPath/images/unchecked.svg';

export default {
  name: 'Repeat',
  components: {},
  props: {},
  data() {
    return {
      checked,
      unchecked,
      repeats: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    };
  },
  computed: {
    ...mapState('timer', ['timerInfo']),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations('timer', ['updateTimerInfo']),
    setRepeat(index) {
      // 设置重复

      const { repeat } = this.timerInfo;
      const pos = repeat.indexOf(index);
      if (pos > -1) {
        // 取消选中
        repeat.splice(pos, 1);
      } else {
        // 选中
        repeat.push(index);
      }
      repeat.sort();
      console.log('----setRepeat-----', repeat);
      this.updateTimerInfo({ repeat });
    },
  },
};
</script>

<style lang="less" scoped>
.repeat {
  .tips {
    font-size: 22px;
    color: @bl-gray-1;
    padding: 22px 36px;
  }
}
</style>
