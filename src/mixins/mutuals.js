/*
 * @Description: 界面公共方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditTime: 2022-05-24 17:10:46
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import { mapGetters } from 'vuex';

export default which => ({
  data() {
    return {
      [`${which}`]: {},
    };
  },
  computed: {
    ...mapGetters('app', ['status']),
  },
  created() {},

  methods: {
    // 设置头部导航
    setModeMutuals(params) {
      const { ac_mode } = params;
      const mutuals = {
        0: {
          // 制冷模式，风速自动
          ac_mark: 0,
        },
        1: {
          // 制热模式，风速自动
          ac_mark: 0,
        },
        2: {
          // 除湿模式，风速低档
          ac_mark: 1,
        },
        3: {
          // 送风模式，风速高档
          ac_mark: 3,
        },
        4: {
          // 自动模式，风速自动
          ac_mark: 0,
        },
      };

      const controls = {
        ...params,
        ...mutuals[ac_mode],
      };
      return controls;
    },
  },
});
