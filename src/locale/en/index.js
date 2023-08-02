/*
 * @Author: your name
 * @Date: 2019-11-01 14:02:27
 * @LastEditTime: 2022-07-08 16:20:18
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: In User Settings Edit
 * @FilePath: \vue-mobile-template\src\locale\en_US\index.js
 */
import common from './common'; // 通用
import error from './error'; // 错误

export default {
  ...common,
  ...error,
  status: {
    0: '关闭',
    1: '开启',
  },
  pwr: '开关',
  ac_mark: {
    name: '风速',
    0: '自动',
    1: '低风',
    2: '中风',
    3: '高风',
    4: '强劲',
    5: '静音',
    6: '中低',
    7: '中高',
  },
  ac_mode: {
    name: '模式',
    0: '制冷',
    1: '制热',
    2: '除湿',
    3: '送风',
    4: '自动',
  },
  ac_hdir: '左右摆风',
  ac_vdir: '上下摆风',
  ac_astheat: '辅热',
  ecomode: 'ECO',
  scrdisp: '屏显',
};
