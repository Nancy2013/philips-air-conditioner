<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-07-20 10:18:20
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div :class="{ opacity: !online }" class="info">
    <div class="flex">
      <div :class="{ opacity: status.pwr !== 1 }" class="temp">
        <div>
          <span
            :class="{ opacity: disabled() }"
            class="icon"
            @click="
              () => {
                checkSleepdiy();
                if (!disabled()) {
                  setTemp();
                }
              }
            "
            ><img :src="arrowL" alt=""
          /></span>
          <span v-if="status.ac_mode === 3" class="line">— —</span>
          <span v-else class="num">
            {{ parseInt(showTemp(sliderValue))
            }}<span v-if="showDecimal(sliderValue)" class="decimal">{{
              showDecimal(sliderValue)
            }}</span
            ><sup class="unit">{{ showTempUnit }}</sup>
          </span>
          <span
            :class="{ opacity: disabled('add') }"
            class="icon"
            @click="
              () => {
                checkSleepdiy();
                if (!disabled('add')) {
                  setTemp('add');
                }
              }
            "
            ><img :src="arrowR" alt=""
          /></span>
        </div>
      </div>
      <div class="pwr">
        <img
          :src="status.pwr === 1 ? pwrOn : pwrOff"
          alt=""
          @click="control({ pwr: status.pwr === 1 ? 0 : 1 })"
        />
      </div>
    </div>
    <div
      v-if="type === 'app'"
      :class="{ opacity: status.pwr !== 1 }"
      class="envtemp"
    >
      室内温度：{{ showTemp(status.envtemp) }}{{ showTempUnit }}
    </div>
    <div class="slider" @click.capture="checkSleepdiy">
      <van-slider
        v-model="sliderValue"
        :min="tempRange.min * 10"
        :max="tempRange.max * 10"
        :disabled="!online || setMutuals"
        :step="tempRange.step * 10"
        @change="onChange"
        @drag-start="dragStart"
        @drag-end="dragEnd"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import arrowL from 'stylesPath/images/arrowL.svg';
import arrowR from 'stylesPath/images/arrowR.svg';
import pwrOn from 'stylesPath/images/pwr_on.svg';
import pwrOff from 'stylesPath/images/pwr_off.svg';
import config from 'configPath';
import { centigradeToFahrenheit } from 'utilsPath';
import Toast from 'vant/lib/toast';
import Mix from '@/mixins';

const { SliderCreaterMix } = Mix;
const { tempRange, mutuals } = config;
export default {
  name: 'Info',
  components: {},
  mixins: [SliderCreaterMix('tempSlider')],
  props: {
    type: {
      type: String,
      default: 'app',
    },
  },
  data() {
    return {
      pwrOn,
      pwrOff,
      arrowL,
      arrowR,
      tempRange,
      sliderValue: 0,
    };
  },
  computed: {
    ...mapState('app', ['deviceStatus', 'appSettings']),
    ...mapGetters('app', ['status', 'online']),
    showTempUnit() {
      // 显示温度单位
      const { tempUnit = 'C' } = this.appSettings;
      return tempUnit === 'F' ? '℉' : '℃';
    },
    showTemp() {
      return function(val = 0) {
        const { tempUnit = 'C' } = this.appSettings;
        let temp;
        if (tempUnit === 'F') {
          // 华氏
          temp = centigradeToFahrenheit(val);
        } else {
          // 摄氏度
          temp = val / 10;
        }
        return temp;
      };
    },
    showDecimal() {
      // 显示精度数值
      return function(val) {
        let decimal = 0;
        const temp = this.showTemp(val);
        const pos = `${temp}`.indexOf('.');
        if (pos > -1) {
          decimal = `${temp}`.substring(pos);
        }
        return decimal;
      };
    },
    setMutuals() {
      // 温度控制互斥
      let disabled = false;
      const { status } = this;
      disabled = mutuals.temp.some(v => v.values.includes(status[v.key]));

      return disabled;
    },
    disabled() {
      // 控制温度按钮样式
      return function(flag) {
        if (!this.online) return true;
        if (this.setMutuals) return true;
        if (this.tempVerify(flag)) return true;
        return false;
      };
    },
  },
  watch: {
    status: {
      handler(newVal, oldVal) {
        const { temp } = newVal;
        const { lockSlider } = this;
        if (newVal && temp !== this.sliderTemp && !lockSlider) {
          this.sliderValue = temp;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions('app', ['control']),
    setTemp(flag) {
      // 设定温度
      const { temp = 160 } = this.status;
      const step = tempRange.step * 10;
      const value = flag === 'add' ? temp + step : temp - step;
      this.control({ temp: value });
    },
    onChange(value) {
      // 滑动设置
      this.control({ temp: value });
    },
    tempVerify(flag) {
      // 温度范围校验
      const { temp } = this.status;
      let disabled = false;
      const { min, max } = tempRange;
      if (flag === 'add') {
        // 加温度
        disabled = temp >= max * 10;
      } else {
        // 减温度
        disabled = temp <= min * 10;
      }
      return disabled;
    },
    checkSleepdiy() {
      // 判断sleepdiy状态
      const { sleepdiy } = this.status;
      if (sleepdiy === 0) {
        Toast('请关闭睡眠DIY后进行操作');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.info {
  padding: 40px 56px 52px 56px;
  .temp {
    text-align: left;
    flex: 1;
    .icon {
      img {
        width: 30px;
        height: 52px;
        vertical-align: middle;
      }
    }
    .num {
      font-size: 164px;
      vertical-align: middle;
      padding: 0 38px;
      position: relative;
      .decimal {
        font-size: 56px;
        position: absolute;
        bottom: 0.5em;
      }
    }
    .unit {
      padding-left: 20px;
      font-size: 56px;
      vertical-align: super;
    }
    .line {
      font-size: 100px;
      vertical-align: middle;
      padding: 0 38px;
      line-height: 164px;
    }
  }
  .envtemp {
    padding: 50px 0 0px 88px;
    font-size: 30px;
  }
  .slider {
    margin-top: 50px;
  }
  .pwr {
    text-align: right;
    width: 146px;
    img {
      width: 146px;
      height: 146px;
    }
  }
}
</style>
