/*
 * @Description: 界面公共方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditTime: 2022-04-24 14:30:18
 * @LastEditors: Please set LastEditors
 */

export default which => ({
  data() {
    return {
      [`${which}`]: {
        lockSlider: false,
      },
    };
  },
  computed: {},
  created() {},

  methods: {
    dragStart() {
      // 开始拖动时触发
      this.lockSlider = true;
    },
    dragEnd() {
      // 结束拖动时触发
      this.lockSlider = false;
    },
  },
});
