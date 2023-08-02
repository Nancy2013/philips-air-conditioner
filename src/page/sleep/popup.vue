<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-06-01 15:53:04
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="popup">
    <van-popup
      v-model="value"
      :close-on-click-overlay="false"
      overlay-class="overlay"
      position="bottom"
    >
      <div class="title flex">
        <div class="flex-item" @click="cancel">取消</div>
        <div class="flex-item confirm" @click="confirm">确定</div>
      </div>
      <div class="picker">
        <van-picker
          ref="picker"
          :columns="getColumns()"
          :visible-item-count="5"
          :default-index="defaultIndex"
          item-height="9.333vw"
          @change="onChange"
        />
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import config from 'configPath';
import { centigradeToFahrenheit } from 'utilsPath';

const { ac_marks, tempRange } = config;
export default {
  name: 'Popup',
  components: {},
  model: {
    props: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    flag: {
      type: String,
      default: 'ac_mode',
    },
    operate: {
      type: String,
      default: 'add',
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
    onCurtain: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {
        this.$emit('change', false);
      },
    },
  },
  data() {
    return {
      current: {},
    };
  },
  computed: {
    ...mapState('app', ['appSettings']),
    defaultIndex() {
      const { getColumns, defaultValue, flag, operate } = this;
      const columns = getColumns();
      const values = columns.map(v => v.value);
      let pos = values.indexOf(defaultValue[flag]);
      console.log('----defaultIndex----', pos);
      if (pos === -1) {
        pos = 0;
      }
      if (operate === 'sub') {
        // 左箭头
        pos = pos === 0 ? pos : pos - 1;
      }

      if (operate === 'add') {
        // 右箭头
        pos = pos >= columns.length - 1 ? pos : pos + 1;
      }
      console.log('----defaultIndex--pos--', pos);
      return pos;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    tempColumns() {
      const columns = [];
      const { min, max } = tempRange;
      const { tempUnit = 'C' } = this.appSettings;
      for (let i = min; i <= max; i += 1) {
        if (tempUnit === 'C') {
          columns.push({
            text: `${i}℃`,
            value: i,
          });
        } else {
          columns.push({
            text: `${centigradeToFahrenheit(i)}℉`,
            value: i,
          });
        }
      }
      return columns;
    },
    ac_markColumns() {
      const columns = ac_marks();
      return columns;
    },
    getColumns() {
      // 显示底部弹窗
      const { flag } = this;
      const columns = this[`${flag}Columns`]();
      return columns;
    },
    onChange(picker, value, index) {
      console.log('----onChange----', value);
      this.current = value;
    },
    confirm() {
      const { picker } = this.$refs;
      this.$nextTick(() => {
        const value = picker.getColumnValue(0);
        this.$emit('onCurtain', value);
        this.cancel();
      });
    },
    cancel() {
      this.$emit('change', false);
    },
  },
};
</script>

<style lang="less" scoped>
.popup {
  .title {
    text-align: center;
    font-size: 34px;
    padding: 24px;
    border-bottom: @bl-border-width-base @bl-border-style-base @bl-gray-5;
    .confirm {
      color: @bl-red-1;
    }
  }
  .picker {
    margin: 60px 0;
  }
}
</style>
