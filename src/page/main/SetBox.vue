<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="setbox">
    <van-grid :column-num="4" :border="false">
      <van-grid-item v-for="item in services" :key="item.key">
        <div :class="{ opacity: disabled(item.key) }">
          <div>
            <img
              :src="imgs[`${item.key}_${getFlag(item.key)}`]"
              alt=""
              @click="
                () => {
                  if (!disabled(item.key)) {
                    onClick(item.key);
                  }
                }
              "
            />
          </div>
          <span> {{ item.text }}</span>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { importImgs } from 'utilsPath';
import config from 'configPath';
import Mix from '@/mixins';

const { TimerDataCreaterMix } = Mix;
const { mutuals } = config;
const imgs = importImgs();
const services = [
  {
    key: 'ac_hdir',
    text: '左右摆风',
    isScene: true,
  },
  {
    key: 'ac_astheat',
    text: '辅热',
    isScene: true,
  },
  {
    key: 'sleep',
    text: '睡眠',
  },
  {
    key: 'timer',
    text: '定时',
  },
  {
    key: 'ac_vdir',
    text: '上下摆风',
    isScene: true,
  },
  {
    key: 'ecomode',
    text: 'ECO',
    isScene: true,
  },
  {
    key: 'scrdisp',
    text: '屏显',
    isScene: true,
  },
  {
    key: 'ac_clean',
    text: '清洁',
  },
];

export default {
  name: 'SetBox',
  components: {},
  mixins: [TimerDataCreaterMix('portal')],
  props: {
    type: {
      type: String,
      default: 'app',
    },
  },
  data() {
    return {
      services:
        this.type === 'scene' ? services.filter(v => v.isScene) : services,
      imgs,
    };
  },
  computed: {
    ...mapState('app', ['deviceStatus']),
    ...mapGetters('app', ['status', 'online']),
    getFlag() {
      return function(key) {
        const { status, timerList } = this;
        if (key === 'sleep') {
          const { sleepdiy } = this.status;
          // 睡眠diy根据协议 sleepdiy字段，0为开，1为关
          return sleepdiy === 0 ? 'on' : 'off';
        }
        if (key === 'timer') {
          // 定时
          const enable = timerList.filter(v => v.enable);
          return enable.length > 0 ? 'on' : 'off';
        }

        return status[key] === 1 ? 'on' : 'off';
      };
    },
    timerList() {
      const getTimerList = this.$store.getters['timer/getTimerList'];
      return getTimerList;
    },
    sleepTimerList() {
      const getSleepList = this.$store.getters['timer/getSleepList'];
      return getSleepList;
    },
    disabled() {
      // 功能是否可用
      return function(key) {
        const { status, online } = this;
        let disabled = false;
        if (key !== 'timer' && !online) {
          // 除定时外，离线状态不可控
          return true;
        }

        if (mutuals[key]) {
          disabled = mutuals[key].some(v => v.values.includes(status[v.key]));
        }
        return disabled;
      };
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapActions('app', ['control']),
    onClick(key) {
      // 下发控制命令
      const { status, control } = this;
      const keys = Object.keys(status);
      if (!keys.includes(key)) {
        if (key === 'sleep') {
          // 控制睡眠
          this.controlSleepDiy();
        } else {
          // 定时
          this.$router.push(`/${key}`);
        }
      } else if (key === 'ac_clean') {
        // 控制清洁
        this.controClean();
      } else {
        // 其他
        const params = { [key]: status[key] === 1 ? 0 : 1 };
        if (key === 'ecomode' && status[key] === 0) {
          // 控制eco，风速自动风，温度27℃
          params.ac_mark = 0;
          params.temp = 27 * 10;
          params.ac_slp = 0;
        }
        if (key === 'ac_slp' && status[key] === 0) {
          // 控制睡眠ac_slp，关闭eco
          params.ecomode = 0;
        }
        control(params);
      }
    },
    controlSleepDiy() {
      // 睡眠diy
      const { sleepdiy } = this.status;
      const des = this.getSleepDiyDes();
      if (sleepdiy === 0) {
        if (des) {
          this.$dialog
            .confirm({
              message: `正在执行${des}睡眠曲线，请确认是否关闭`,
              confirmButtonText: '确定',
              className: 'confirm-modal',
              overlayClass: 'modal-overlay',
            })
            .then(() => {
              // on confirm 关闭sleepdiy使能
              this.control({ sleepdiy: 1 });
            })
            .catch(() => {
              // on cancel
            });
        } else {
          this.control({ sleepdiy: 1 });
        }
      } else {
        // 睡眠列表界面
        this.$router.push('/sleep');
      }
    },
    getSleepDiyDes() {
      // 获得睡眠DIY的执行时间段
      const sleep_diy = this.sleepTimerList.filter(v => v.enable)[0]; // 当前执行的睡眠diy
      if (sleep_diy) {
        const { start, end } = this.getSleepDiyPeriod(sleep_diy);
        const time = `${start}:00 - ${end}:00`;
        const { ac_mode } = this.status;
        const mode = `${ac_mode === 0 ? '制冷' : '制热'}模式`;
        return `${mode} ${time} `;
      }
      return null;
    },
    controClean() {
      const { status, control } = this;
      if (status.ac_clean === 0) {
        this.$dialog
          .confirm({
            message:
              '清洁功能开启时，未来 \n30s\n 空调将暂停工作。 \n (单击电源键/清洁键可取消)',
            confirmButtonText: '确定',
            className: 'confirm-modal',
            overlayClass: 'modal-overlay',
          })
          .then(() => {
            // on confirm
            control({ ac_clean: 1 });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        control({ ac_clean: 0 });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.setbox {
  font-size: 30px;
  text-align: center;
  padding-top: 20px;
  background: @bl-green-2;
}
</style>
