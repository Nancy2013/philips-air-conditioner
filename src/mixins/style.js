/*
 * @Author: your name
 * @Date: 2021-10-21 16:42:16
 * @LastEditTime: 2022-07-15 17:29:03
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: In User Settings Edit
 * @FilePath: \feedback\src\mixins\resize.js
 */
export default which => ({
  data() {
    return {
      styleObj: {},
      adapterBottom: 0,
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      // 获得底部div高度
      this.adapterBottom = this.getHeight('.fixedBottom');
    }, 500);
  },
  methods: {
    getHeight(classStr) {
      let domHeight = 0;
      if (classStr) {
        const dom = this.$el.querySelector(classStr);
        if (dom) {
          domHeight = dom.scrollHeight;
        }
      }
      return domHeight;
    },
  },
});
