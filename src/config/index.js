/*
 * @Author: your name
 * @Date: 2021-12-08 10:39:12
 * @LastEditTime: 2022-11-25 12:47:05
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-cli2-mobile\src\config\index.js
 */
export default {
  tempRange: {
    min: 16,
    max: 32,
    step: 0.5,
  },
  pwrs: () => {
    const pwrs = [
      {
        text: '开启',
        value: 1,
      },
      {
        text: '关闭',
        value: 0,
      },
    ];
    return pwrs;
  },
  ac_modes: () => {
    const ac_modes = [
      {
        text: '制热',
        value: 1,
      },
      {
        text: '制冷',
        value: 0,
      },
      {
        text: '除湿',
        value: 2,
      },
      {
        text: '送风',
        value: 3,
      },
      {
        text: '自动',
        value: 4,
      },
    ];

    return ac_modes;
  },
  ac_marks: val => {
    const ac_marks = [
      {
        text: '静音',
        value: 5,
      },
      {
        text: '低风',
        value: 1,
      },
      {
        text: '中档',
        value: 2,
      },
      {
        text: '高风',
        value: 3,
      },
      {
        text: '强劲',
        value: 4,
      },
    ];
    return ac_marks;
  },
  // 互斥逻辑
  mutuals: {
    temp: [
      {
        key: 'pwr',
        values: [0],
      },
      {
        // 温度控制互斥
        // 送风|自动模式不可控
        key: 'ac_mode',
        values: [3, 4],
      },
      {
        // 打开睡眠DIY时，不能设置温度
        key: 'sleepdiy',
        values: [0],
      },
      {
        key: 'ecomode',
        values: [1],
      },
    ],
    // 左右摆风
    ac_hdir: [
      {
        key: 'pwr',
        values: [0],
      },
    ],
    // 电辅热
    ac_astheat: [
      {
        key: 'pwr',
        values: [0],
      },
      {
        key: 'ac_mode',
        values: [0, 2, 3, 4],
      },
    ],
    // 睡眠
    sleep: [
      {
        key: 'pwr',
        values: [0],
      },
      {
        key: 'ac_mode',
        values: [2, 3, 4],
      },
    ],
    ac_slp: [
      {
        key: 'pwr',
        values: [0],
      },
      {
        key: 'ac_mode',
        values: [3, 4],
      },
      {
        key: 'ecomode',
        values: [1],
      },
    ],
    // 上下摆风
    ac_vdir: [
      {
        key: 'pwr',
        values: [0],
      },
    ],
    // ECO
    ecomode: [
      {
        key: 'pwr',
        values: [0],
      },
      {
        key: 'ac_mode',
        values: [1, 2, 3, 4],
      },
      {
        key: 'ac_slp',
        values: [1],
      },
    ],
    // 屏显
    // 清洁
    ac_clean: [
      {
        key: 'pwr',
        values: [1],
      },
    ],
    ac_mark: {
      // 风速档位互斥
      ac_mode: {
        2: [0, 2, 3, 4, 5], // 除湿模式：['自动','中风','高风','强劲','静音']
        3: [0, 4, 5], // 送风模式：['自动','强劲','静音']
        4: [4, 5], // 自动模式：['强劲','静音']
      },
      ecomode: {
        1: [1, 2, 3, 4, 5], // eco开启：['低风','中风','高风','强劲','静音']
      },
      sleepdiy: 0, // 睡眠DIY设置后不允许设定风速
    },
  },
};
