/*
 * @Description: 定时数据显示方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditors: Please set LastEditors */
import { mapState } from 'vuex';
import config from 'configPath';
import moment from 'moment';

export default which => ({
  data() {
    return {
      [`${which}`]: {
        messageId: '',
        licenseId: '',
      },
    };
  },
  computed: {
    getText() {
      // 描述显示
      return function(key, action) {
        if (action) {
          const value =
            config[`${key}s`]().filter(v => v.value === action[key])[0] || {};
          const { text = '' } = value;
          return text;
        }
        return null;
      };
    },
  },
  created() {},

  methods: {
    timeConvert(data) {
      // 单次定时，早于当前时间点的，在当前时间点的后一天执行
      const { timer, repeat } = data;
      const { time } = timer;
      if (repeat.length === 0) {
        // 单次定时
        const hour = moment(time).hour();
        const minute = moment(time).minute();
        let newTime = moment({ hour, minute });
        if (!newTime.isAfter()) {
          newTime = newTime.add(1, 'day');
        }
        return newTime.format();
      }

      return time;
    },
  },
});
