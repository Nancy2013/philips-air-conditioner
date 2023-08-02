/*
 * @Description: 界面公共方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditTime: 2022-04-28 10:40:54
 * @LastEditors: Please set LastEditors
 */
export default which => ({
  data() {
    return {};
  },
  computed: {},
  created() {
    window.addEventListener('beforeunload', this.clear);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.clear);
  },
  methods: {
    clear() {
      localStorage.clear();
    },
  },
});
