<template>
  <bl-page-wrapper>
    <div slot="content" class="timerAdd">
      <bl-navbar :background="'#14726C'" :title-color="'#fff'" title="定时" />
      <div class="picker">
        <div class="unit">
          <div :class="{ opacity: setOpacity('AM') }" class="margin">AM</div>
          <div :class="{ opacity: setOpacity('PM') }">PM</div>
        </div>
        <div class="dot">:</div>
        <van-picker
          ref="picker"
          :columns="getColumns()"
          :visible-item-count="3"
          item-height="13.533vw"
          @change="onChange"
        />
      </div>
      <div class="operate">
        <bl-panel
          :icon="panel_arrow"
          :click-right="goRepeat"
          :right-text="repeatDesc(timerInfo.repeat)"
          title="重复"
        />
        <bl-panel
          :icon="panel_arrow"
          :click-right="showModel"
          :right-text="timerInfo.extern"
          title="备注"
        />
        <bl-panel
          :icon="panel_arrow"
          :click-right="() => goOperate('pwr')"
          :right-text="getText('pwr', timerInfo.action)"
          title="开关"
        />
        <bl-panel
          v-if="timerInfo.action && timerInfo.action.pwr !== 0"
          :icon="panel_arrow"
          :click-right="() => goOperate('ac_mode')"
          :right-text="getText('ac_mode', timerInfo.action)"
          title="模式"
        />
      </div>
      <div class="btn">
        <van-button type="primary" size="normal" @click="save">保存</van-button>
      </div>
      <van-dialog
        v-model="show"
        confirm-button-text="确定"
        overlay-class="modal-overlay"
        title="备注"
        show-cancel-button
        @confirm="confirm"
      >
        <div class="remark">
          <img :src="close" alt="" @click="clear" />
          <textarea v-model.trim="remark" rows="4" autofocus maxlength="100" />
        </div>
      </van-dialog>
    </div>
  </bl-page-wrapper>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Toast from 'vant/lib/toast';
import panel_arrow from 'stylesPath/images/panel_arrow.svg';
import close from 'stylesPath/images/close.svg';
import { repeatDesc } from 'utilsPath/timer-util';
import moment from 'moment';
import Mix from '@/mixins';

const { DataInfoCreaterMix, TimerCreaterMix, MutualsCreaterMix } = Mix;
export default {
  name: 'Add',
  components: {},
  mixins: [
    DataInfoCreaterMix('add'),
    TimerCreaterMix('add'),
    MutualsCreaterMix('timer'),
  ],
  props: {},
  data() {
    return {
      panel_arrow,
      close,
      repeatDesc,
      jobid: this.$route.params.jobid,
      show: false,
      remark: '',
      columns: [
        // 第一列
        {
          values: ['周一', '周二', '周三', '周四', '周五'],
          defaultIndex: 2,
        },
        // 第二列
        {
          values: ['上午', '下午', '晚上'],
          defaultIndex: 1,
        },
      ],
      timer: {
        // 当前定时
        donedeal: 'keep', // 新增字段，如果是keep时，则不删除
        name: 'timer_common',
        jobid: '', // jobid为空表示新增，不为空表示更新
        type: 0, // 0定时任务，2周期任务
        enable: true,
        timer: {
          weekdays: '',
          time: moment().format(),
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
        action: {},
        repeat: [],
      },
    };
  },
  computed: {
    ...mapState('app', ['systemSettings']),
    ...mapState('timer', ['timerInfo']),
    timerList() {
      const getTimerList = this.$store.getters['timer/getTimerList'];
      return getTimerList;
    },
    setOpacity() {
      // 设置AM PM透明度
      return function(flag) {
        const { timer } = this.timerInfo;
        if (timer) {
          const hour = moment(timer.time).get('hour');
          const key = hour < 12 ? 'AM' : 'PM';
          return key !== flag;
        }
        return flag;
      };
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapActions('timer', ['upsert']),
    ...mapMutations('timer', ['updateTimerInfo']),
    init() {
      console.log('------init-----');
      const { jobid, timerList } = this;
      if (jobid) {
        // 编辑
        const current = timerList.filter(v => v.jobid === jobid)[0];
        this.updateTimerInfo({ ...current });
      } else {
        // 添加
        this.updateTimerInfo({ ...this.timer });
      }
    },
    getDefault() {
      // 初始化时间
      const { timer } = this.timerInfo;
      if (timer) {
        let hour = moment(timer.time).get('hour');
        let min = moment(timer.time).get('minute');
        console.log('hour: ', hour, ' min: ', min);
        hour = hour > 9 ? `${hour}` : `0${hour}`;
        min = min > 9 ? `${min}` : `0${min}`;
        return {
          hour,
          min,
        };
      }
      return {};
    },
    getColumns() {
      // 生成时间组件
      const { hour, min } = this.getDefault();
      const hours = new Array(24)
        .fill(0)
        .map((v, index) => (index > 9 ? `${index}` : `0${index}`));
      const mins = new Array(60)
        .fill(0)
        .map((v, index) => (index > 9 ? `${index}` : `0${index}`));
      const hoursInx = hours.indexOf(hour);
      const minsInx = mins.indexOf(min);
      const columns = [
        {
          values: hours,
          defaultIndex: hoursInx,
        },
        {
          values: mins,
          defaultIndex: minsInx,
        },
      ];
      return columns;
    },
    goRepeat() {
      // 设置重复
      this.$router.push('/timer/repeat');
    },
    goOperate(key) {
      this.$router.push({ name: 'operate', params: { key } });
    },
    showModel() {
      // 备注
      const { extern } = this.timerInfo;
      this.show = true;
      this.remark = extern;
    },
    confirm() {
      // 确认备注
      const { remark } = this;
      this.updateTimerInfo({ extern: remark });
    },
    clear() {
      // 清除备注
      this.remark = '';
    },
    onChange(picker, vals, index) {
      // 修改时间
      console.log('---onChange----', vals, index);
      const [hour, min] = vals;
      const { timer } = this.timerInfo;
      timer.time = moment(`${hour}:${min}`, 'HH:mm').format();
      this.updateTimerInfo({ timer });
    },
    save() {
      // 保存
      // TODO 时区转换
      if (this.timerList.length >= 16) {
        Toast('最多能设置16组定时');
        return;
      }
      const { timerInfo, systemSettings } = this;
      const { setNotifyInfo, setControlInfo, inValid } = this;
      const { repeat, action, timer } = timerInfo;
      // 设置模式对应的档位互斥
      const actionMutuals = this.setModeMutuals(action);
      const notifyInfo = setNotifyInfo();
      const controlInfo = setControlInfo({ ...action, ...actionMutuals });
      if (inValid()) {
        return;
      }
      const params = {
        ...timerInfo,
        type: repeat.length > 0 ? 2 : 0, // 2: 周期, 0: 定时任务
        enable: true, // 修改之后默认打开
        timer: {
          ...timer,
          weekdays: repeat
            .map(v => (v === 0 ? 7 : v))
            .sort()
            .join(''),
          time: this.timeConvert(timerInfo),
        },
        data: JSON.stringify({ notifyInfo, controlInfo }),
      };
      console.log('-----save----', params);
      this.upsert(params)
        .then((result = {}) => {
          const { status } = result;
          if (status === 0) {
            this.$router.go(-1);
            Toast.clear();
          }
        })
        .catch(e => console.error(e));
    },
    inValid() {
      // 有效性判断
      const { pwr, ac_mode } = this.timerInfo.action;
      if (pwr == null) {
        Toast('请设置开关');
        return true;
      }
      if (pwr === 1 && ac_mode == null) {
        Toast('请设置模式');
        return true;
      }
      return false;
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log('----from-----', from);
    const { name } = from;
    next(v => {
      if (name === 'list') {
        // 列表界面进入
        v.init();
      }
    });
  },
};
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
  background: @bl-white;
}

.timerAdd {
  .picker {
    color: @bl-green-7;

    padding: 128px 140px;
    position: relative;
    .unit {
      position: absolute;
      left: 110px;
      top: 50%;
      z-index: 2;
      transform: translate(0, -50%);
      font-size: 28px;
      .margin {
        margin-bottom: 44px;
      }
      .light {
        opacity: 1;
      }
    }
    .dot {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -60%);
      font-size: 124px;
      z-index: 2;
    }
  }
  .operate {
    border-top: @bl-border-width-base @bl-border-style-base @bl-gray-4;
    border-bottom: @bl-border-width-base @bl-border-style-base @bl-gray-4;
    margin-bottom: 128px;
    /deep/.extra {
      padding: 0;
    }
    /deep/.left {
      flex: 1;
      font-size: 32px;
    }
    /deep/.right {
      flex: 8;
      font-size: 28px;
      img {
        width: 24px;
        height: 36px;
      }
    }
  }
  .remark {
    position: relative;
    img {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    textarea {
      padding: 10px;
      padding-right: 16px;
      font-size: 24px;
      border: @bl-border-width-base @bl-border-style-base @bl-gray-1;
    }
  }
  .btn {
    text-align: center;
  }
}
</style>
