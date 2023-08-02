<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-11-03 10:35:41
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="sleepAdd">
    <bl-navbar
      :background="'#14726C'"
      :title-color="'#fff'"
      :title="getTitle"
      :left-handle="leftHandle"
    />
    <div class="content">
      <div class="time">
        <div class="flex">
          <div class="flex-item">
            <div class="title">开始时间</div>
            <div class="picker">
              <div class="dot">:</div>
              <van-picker
                :columns="getColumns('start')"
                :visible-item-count="1"
                @change="
                  (picker, vals, index) => {
                    onChange(picker, vals, index, 'start');
                  }
                "
              />
            </div>
          </div>
          <div class="flex-item">
            <div class="title">结束时间</div>
            <div class="picker">
              <div class="dot">:</div>
              <van-picker
                :columns="getColumns('end')"
                :visible-item-count="1"
                @change="
                  (picker, vals, index) => {
                    onChange(picker, vals, index, 'end');
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div class="chart">
        <Chart :set="showPop" :data="sleepDiy" />
      </div>
      <div class="btn">
        <van-button type="primary" size="normal" @click="save">保存</van-button>
      </div>
    </div>
    <Popup
      v-if="isShowPop"
      v-model="isShowPop"
      :flag="flag"
      :operate="operate"
      :default-value="currentPoint"
      @onCurtain="onCurtain"
    />
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import Toast from 'vant/lib/toast';
import Mix from '@/mixins';
import Chart from './chart.vue';
import Popup from './popup.vue';

const { DataInfoCreaterMix, TimerCreaterMix } = Mix;
const START = 23; // 默认设置开始时间
const END = 7; // 默认设置结束时间
const DEFAULT_SLEEP = {
  // 默认时间点档位及温度
  ac_mark: 1,
  temp: 25,
};
export default {
  name: 'Add',
  components: {
    Chart,
    Popup,
  },
  mixins: [DataInfoCreaterMix('sleep'), TimerCreaterMix('sleep')],
  props: {},
  data() {
    return {
      jobid: this.$route.params.jobid,
      ac_mode: parseInt(this.$route.params.ac_mode),
      start: START,
      end: END,
      sleepDiy: [],
      timer: {
        // 当前定时
        donedeal: 'keep', // 新增字段，如果是keep时，则不删除
        name: `sleep_diy_${this.$route.params.ac_mode}_0`,
        jobid: '', // jobid为空表示新增，不为空表示更新
        type: 2, // 0定时任务，2周期任务
        enable: true,
        timer: {
          weekdays: '1234567',
          time: moment(`${START}`, 'HH').format(),
          zoneinfo: 'Asia/Shanghai',
        },
        extern: '',
        reqtype: 'devControlV2',
        data: {
          notifyInfo: {},
          controlInfo: {
            directive: {},
          },
        },
        action: {
          sleep_diy: [],
          ac_mode: parseInt(this.$route.params.ac_mode),
        },
        repeat: [],
      },
      isShowPop: false,
      flag: 'ac_mark',
      operate: 'add',
      currentPoint: {
        ...DEFAULT_SLEEP,
      },
    };
  },
  computed: {
    ...mapState('timer', ['timerInfo']),
    ...mapState('timer', {
      allTimerList: state => state.timerList,
    }),
    timerList() {
      const getSleepList = this.$store.getters['timer/getSleepList'];
      return getSleepList;
    },
    getTitle() {
      if (this.timerInfo) {
        const { name } = this.timerInfo;
        if (name) {
          const ac_mode = parseInt(name.split('_')[2]);
          const title = `${ac_mode === 0 ? '制冷' : '制热'}模式`;
          return title;
        }
      }
      return null;
    },
  },
  watch: {},
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions('timer', ['upsert']),
    ...mapMutations('timer', ['updateTimerInfo']),
    init() {
      // 初始化界面
      const { jobid, timerList } = this;
      if (jobid) {
        // 编辑
        const current = timerList.filter(v => v.jobid === jobid)[0];
        if (current) {
          this.updateTimerInfo({ ...current });
          this.iniPicker();
          const { action } = current;
          this.sleepDiy = this.formatSleepDiy(action.sleep_diy, true);
          console.log('-----timer----', current);
        }
      } else {
        // 添加
        this.updateTimerInfo({ ...this.timer });
        const { action } = this.timer;
        this.sleepDiy = this.formatSleepDiy(action.sleep_diy);
      }
    },
    iniPicker() {
      // 详情-初始化时间组件
      console.log('------iniPicker------', this.timerInfo);
      const { timer = {}, action = {} } = this.timerInfo;
      const start = moment(timer.time).get('hour');
      const num = start + action.sleep_diy.length;
      const end = num >= 24 ? num - 24 : num;
      this.start = start;
      this.end = end;
    },
    getDefault() {
      // 初始化时间
      const { start, end } = this;
      console.log('-----getDefault------', start, end);
      // const startNum = start > 9 ? `${start}` : `0${start}`;
      // const endNum = end > 9 ? `${end}` : `0${end}`;
      // console.log('start: ', startNum, ' end: ', endNum);
      return {
        start,
        end,
      };
    },
    getColumns(flag) {
      // 生成时间组件
      const { start, end } = this.getDefault();
      const hours = new Array(24).fill(0).map((v, index) => index);
      const startInx = hours.indexOf(start);
      const endInx = hours.indexOf(end);
      const startColumns = [
        {
          values: hours,
          defaultIndex: startInx,
        },
        {
          values: ['00'],
          defaultIndex: 0,
        },
      ];
      const endColumns = [
        {
          values: hours,
          defaultIndex: endInx,
        },
        {
          values: ['00'],
          defaultIndex: 0,
        },
      ];
      return flag === 'start' ? startColumns : endColumns;
    },
    formatSleepDiy(sleep_diy, flag) {
      // 格式化sleepDiy
      const { start, end } = this;
      const timeArr = [];
      const numEnd = end < start ? end + 24 : end;
      for (let i = start; i < numEnd; i += 1) {
        timeArr.push(i < 24 ? i : i - 24);
      }
      const formatSleepDiy = [];
      timeArr.forEach((v, $index) => {
        let sleep;
        if (flag) {
          // 编辑定时初始化
          sleep = sleep_diy[$index];
        } else {
          sleep = sleep_diy.filter(k => v === k.time)[0] || DEFAULT_SLEEP;
        }
        formatSleepDiy.push({
          ...sleep,
          text: this.getText('ac_mark', sleep),
          time: v,
        });
      });

      console.log('------formatSleepDiy-----', formatSleepDiy);
      return formatSleepDiy;
    },
    updateSleepDiy(sleepDiy) {
      // 更新sleepDiy
      const baseSleepDiy = sleepDiy || this.sleepDiy;
      console.log('-----updateSleepDiy------', baseSleepDiy);
      this.sleepDiy = this.formatSleepDiy(baseSleepDiy);
    },
    onChange(picker, vals, index, flag) {
      // 修改时间
      console.log('---onChange----', vals, index);
      const [hour] = vals;
      this[flag] = parseInt(hour);
      this.updateSleepDiy();
      this.timePeriodInvalid(); // 判断时间范围有效性
    },
    showPop(flag, operate, point) {
      console.log('-----showPop-----', flag, operate, point);
      this.flag = flag;
      this.operate = operate;
      this.currentPoint = { ...point };
      this.isShowPop = !this.isShowPop;
    },
    onCurtain(val) {
      // 保存底部弹窗
      console.log('----onCurtain---', val);
      const { sleepDiy, flag, currentPoint } = this;
      this.currentPoint = {
        ...currentPoint,
        [flag]: val.value,
      };
      sleepDiy.forEach(v => {
        if (v.time === currentPoint.time) {
          v[flag] = val.value;
        }
      });
      this.updateSleepDiy(sleepDiy);
    },

    async save() {
      const result = await this.saveSleep_Diy(); // 睡眠DIY
      if (result) {
        this.saveSleepDiy(); // sleepdiy使能
      }
    },
    saveSleep_Diy() {
      // 保存
      const { timerInfo, start, sleepDiy } = this;
      const { setNotifyInfo, setControlInfo, inValid } = this;
      const { action, timer } = timerInfo;
      // 判断时间范围有效性
      if (this.timePeriodInvalid()) {
        return false;
      }
      if (!timerInfo.jobid) {
        // 添加定时，判断有效性
        if (inValid()) {
          return false;
        }
      }
      const sleep_diy = sleepDiy.map(v => ({
        ac_mark: v.ac_mark,
        temp: v.temp,
      }));
      const notifyInfo = setNotifyInfo('新的睡眠diy任务执行', false);
      const controlInfo = setControlInfo({ ...action, sleep_diy }, true);
      const params = {
        ...timerInfo,
        // type: 2, // 2: 周期, 0: 定时任务
        timer: {
          ...timer,
          time: moment(`${start}`, 'HH').format(),
        },
        data: JSON.stringify({ notifyInfo, controlInfo }),
      };
      console.log('-----save----', params);
      return this.upsert(params)
        .then((result = {}) => {
          const { status } = result;
          if (status === 0) {
            Toast.clear();
            return true;
          }
          return false;
        })
        .catch(e => console.error(e));
    },
    saveSleepDiy() {
      // 添加使能sleepdiy云端数据
      const { timerInfo, start, ac_mode } = this;
      const { setNotifyInfo, setControlInfo } = this;
      const { timer, enable } = timerInfo;
      const notifyInfo = setNotifyInfo('新的睡眠diy任务执行', false);
      let params = {
        timer: {
          ...timer,
          time: moment(`${start}`, 'HH')
            .add('seconds', 3)
            .format(),
        },
      };
      if (timerInfo.jobid) {
        // 编辑
        const { allTimerList } = this;
        const sleepdiyName = timerInfo.name.replace('sleep_diy', 'sleepdiy');
        const sleepdiyTimer =
          allTimerList.filter(v => v.name === sleepdiyName)[0] || {};
        if (sleepdiyTimer) {
          params = {
            ...sleepdiyTimer,
            enable,
            ...params,
          };
        }
      } else {
        // 添加
        const action = {
          sleepdiy: 0,
          ac_mode,
        };
        const controlInfo = setControlInfo({ ...action });
        params = {
          ...timerInfo,
          enable: true, // 添加默认打开
          name: `sleepdiy_${ac_mode}_0`,
          data: JSON.stringify({ notifyInfo, controlInfo }),
          ...params,
        };
      }
      console.log('-----saveSleepDiy----', params);
      this.upsert(params)
        .then((result = {}) => {
          const { status } = result;
          if (status === 0) {
            this.$router.replace('/sleep');
            Toast.clear();
          }
        })
        .catch(e => console.error(e));
    },
    inValid() {
      // 睡眠DIY个数不能超过两条
      // 每个模式只能存在一条
      const { timerList, ac_mode } = this;
      if (timerList.length >= 2) {
        Toast('最多添加两条睡眠DIY');
        return true;
      }
      const ac_modes = timerList.map(v => parseInt(v.name.split('_')[2]));
      if (ac_modes.includes(ac_mode)) {
        Toast('已经存在该模式下的睡眠DIY');
        return true;
      }
      const enable = timerList.some(v => v.enable);
      if (enable) {
        Toast('请关闭睡眠DIY后进行操作');
        return true;
      }
      return false;
    },
    timePeriodInvalid() {
      // 时间区间限制，睡眠时长需超过1小时，低于12小时
      const len = this.sleepDiy.length;
      if (len <= 1 || len >= 12) {
        Toast('睡眠时长需超过1小时，低于12小时');
        return true;
      }
      return false;
    },
    leftHandle() {
      // 导航栏返回事件
      this.$dialog
        .confirm({
          message: '是否需要保存睡眠DIY？',
          cancelButtonText: '不保存',
          confirmButtonText: '保存',
          className: 'confirm-modal',
          overlayClass: 'modal-overlay',
        })
        .then(() => {
          // on confirm
          this.save();
        })
        .catch(() => {
          // on cancel
          this.$router.go(-1);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.sleepAdd {
  .content {
    padding: 38px;
    .time {
      background: @bl-white;
      padding-bottom: 70px;
      .title {
        text-align: center;
        font-size: 30px;
        color: @bl-black;
        padding: 25px;
      }
      .picker {
        padding: 0px 50px;
        position: relative;
        border-top: @bl-border-width-base @bl-border-style-base @bl-gray-5;
        border-bottom: @bl-border-width-base @bl-border-style-base @bl-gray-5;
        .dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -60%);
          font-size: 48px;
          z-index: 2;
        }
      }
    }
    .btn {
      position: fixed;
      text-align: center;
      bottom: 116px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}
</style>
