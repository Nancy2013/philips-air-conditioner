<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div :class="{ opacity: disabled }" class="control">
    <div class="mark">
      <div class="flex">
        <div class="flex-item left icon">
          <img :src="imgs[`fan_${status.ac_mark || 0}`]" alt="" />
        </div>
        <div class="flex-item right icon">
          <img
            :src="imgs[`ac_mark_0_${status.ac_mark === 0 ? 'on' : 'off'}`]"
            :class="{ opacity: mutualsDisabled(0) }"
            alt=""
            @click="
              () => {
                checkSleepdiy();
                if (!mutualsDisabled(0)) {
                  setMark(0);
                }
              }
            "
          />
        </div>
      </div>
      <div class="gear">
        <div class="flex">
          <div
            v-for="(item, $index) in getGears()"
            :key="$index"
            :class="{
              active: item.value === status.ac_mark,
              opacity: mutualsDisabled(item.value),
            }"
            class="flex-item"
            @click="
              () => {
                checkSleepdiy();
                if (!mutualsDisabled(item.value)) {
                  setMark(item.value);
                }
              }
            "
          >
            {{ item.text }}
            <div :class="{ active: setGearStyle($index) }" class="btn"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mode">
      <div class="icon">
        <img :src="imgs[`ac_mode_${status.ac_mode || 0}`]" alt="" />
      </div>
      <div class="flex">
        <div
          v-for="(item, $index) in ac_modes"
          :key="$index"
          :style="{ ...setStyle(item.value) }"
          class="btn flex-item"
          @click="setMode(item.value)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { importImgs } from 'utilsPath';
import config from 'configPath';
import Toast from 'vant/lib/toast';
import Mix from '@/mixins';

const { MutualsCreaterMix, SceneCreaterMix } = Mix;
const imgs = importImgs();
const { ac_marks, mutuals } = config;
export default {
  name: 'Control',
  components: {},
  mixins: [MutualsCreaterMix('portal'), SceneCreaterMix('portal')],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'app',
    },
  },
  data() {
    return {
      imgs,
      ac_marks,
    };
  },
  computed: {
    ...mapState('app', ['deviceStatus']),
    ...mapGetters('app', ['status', 'ac_modes']),
    setStyle() {
      return function(val) {
        const { ac_mode = 0 } = this.status;
        const colors = {
          1: '#de7510',
          0: '#1474a4',
          2: '#5f9920',
          3: '#5f9920',
          4: '#5f9920',
        };
        if (ac_mode === val) {
          return { background: colors[val] };
        }
        return null;
      };
    },
    getGears() {
      // 动态获取档位
      return function() {
        const { ac_mode } = this.status;
        return this.ac_marks(ac_mode);
      };
    },
    setGearStyle() {
      // 设置档位样式
      return function($index) {
        let actived = false;
        const { ac_mark } = this.status;
        const pos = this.getGears()
          .map(v => v.value)
          .indexOf(ac_mark);
        if ($index <= pos) {
          actived = true;
        }
        return actived;
      };
    },
    mutualsDisabled() {
      // 档位互斥
      return function(val) {
        let disabled = false;
        Object.keys(mutuals.ac_mark).forEach(v => {
          const value = this.status[v];
          const mutual = mutuals.ac_mark[v];
          if (typeof mutual === 'object') {
            // 模式，eco
            if (mutual[value]) {
              if (mutual[value].includes(val)) {
                disabled = true;
              }
            }
          } else if (value === mutual) {
            disabled = true;
          }
        });

        return disabled;
      };
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapActions('app', ['control']),
    setMode(val) {
      // 设置模式
      const { disabled, type } = this;
      if (disabled) {
        return;
      }
      const { ac_mode } = this.status;
      if (val === ac_mode) {
        return;
      }
      let params = { ac_mode: val };
      if (type === 'scene') {
        params = this.setModeScene(params);
      }
      const controls = this.setModeMutuals(params);
      this.control(controls);
    },
    setMark(val) {
      // 设置档位
      const { disabled } = this;
      if (disabled) {
        return;
      }
      const { ac_mark } = this.status;
      if (ac_mark === val) {
        return;
      }
      this.control({ ac_mark: val });
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
.control {
  background: radial-gradient(50% 50%, @bl-green-1 50%, @bl-green-2 100%);
  .mark {
    padding: 40px 0;
    border-top: @bl-border-width-base @bl-border-style-base @bl-green-8;
    border-bottom: @bl-border-width-base @bl-border-style-base @bl-green-6;
    .left {
      padding: 0 56px;
      &.icon {
        img {
          height: 90px;
        }
      }
    }
    .right {
      padding: 0 56px;
      text-align: right;
      &.icon {
        img {
          margin-left: 10px;
          width: 90px;
          height: 90px;
        }
      }
    }
  }
  .gear {
    padding: 0 56px;
    margin-top: 40px;
    color: @bl-green-3;
    text-align: center;
    font-size: 30px;
    .active {
      color: @bl-white;
    }
    .btn {
      height: 10px;
      background: @theme-color;
      margin-top: 10px;
      &.active {
        background: @bl-white;
      }
    }
  }
  .mode {
    padding: 40px 56px;
    border-bottom: @bl-border-width-base @bl-border-style-base @bl-green-8;
    .left,
    .flex {
      justify-content: space-between;
    }
    .icon {
      margin-bottom: 40px;
      img {
        width: 90px;
        height: 90px;
      }
    }
    .btn {
      height: 65px;
      line-height: 65px;
      border-radius: 4px;
      background: @bl-green-4;
      font-size: 30px;
      text-align: center;
    }
  }
  .flex {
    justify-content: space-between;
  }
  .flex-item {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
