/*
 * @Author: your name
 * @Date: 2021-10-21 16:42:16
 * @LastEditTime: 2022-07-07 10:56:03
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: In User Settings Edit
 * @FilePath: \feedback\src\mixins\resize.js
 */
export default which => ({
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    setModeScene(params) {
      const { ac_mode } = params;
      if (ac_mode === 4) {
        // 自动挡 固定25℃
        params.temp = 25 * 10;
      }

      if (ac_mode !== 1) {
        // 非制热模式，关闭辅热
        params.ac_astheat = 0;
      }

      if (ac_mode !== 0) {
        // 非制冷模式，关闭eco
        params.ecomode = 0;
      }
      return params;
    },
  },
});
