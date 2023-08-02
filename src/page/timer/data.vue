<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-08-19 14:33:00
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <bl-page-wrapper :adapter-bottom="adapterBottom" safe-bottom>
    <div slot="content" class="list">
      <div class="tips">定时可能会存在30秒左右误差</div>
      <van-swipe-cell
        v-for="item in timerList"
        :ref="`swipeCell_${item.jobid}`"
        :key="item.jobid"
      >
        <bl-panel
          :title="moment(item.timer.time).format('HH:mm')"
          :icon="item.enable ? checked : unchecked"
          :remark="item.extern"
          :left-sub-title="actionDec(item.action)"
          :desc="repeatDesc(item.repeat)"
          :click-right="() => updateTimer(item.jobid)"
          class="panel"
          @click="() => goDetail(item)"
        >
        </bl-panel>
        <template #right>
          <van-button
            square
            text="删除"
            type="danger"
            class="delete-button"
            @click="showModal(item.jobid)"
          />
        </template>
      </van-swipe-cell>

      <bl-fixed-bottom class="fixedBottom" safe-bottom>
        <div slot="content" :style="bottomStyle">
          <van-button type="primary" size="large" @click="add"
            >点击添加</van-button
          >
        </div>
      </bl-fixed-bottom>
    </div>
  </bl-page-wrapper>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import checked from 'stylesPath/images/checked.svg';
import unchecked from 'stylesPath/images/unchecked.svg';
import { repeatDesc } from 'utilsPath/timer-util';
import Toast from 'vant/lib/toast';
import { isIphoneX, safeAreaBottom } from 'utilsPath/device';
import Mix from '@/mixins';

const {
  StyleCreaterMix,
  DataInfoCreaterMix,
  TimerCreaterMix,
  TimerDataCreaterMix,
} = Mix;
export default {
  name: 'List',
  components: {},
  mixins: [
    StyleCreaterMix('list'),
    DataInfoCreaterMix('list'),
    TimerCreaterMix('timer'),
    TimerDataCreaterMix('timer'),
  ],
  props: {},
  data() {
    return {
      moment,
      checked,
      unchecked,
      adapterBottom: 0,
      repeatDesc,
    };
  },
  computed: {
    ...mapGetters('app', ['online']),
    timerList() {
      const getTimerList = this.$store.getters['timer/getTimerList'];
      return getTimerList;
    },
    bottomStyle() {
      let style = {};
      if (!isIphoneX) {
        // 不是iPhone设备
        style = {
          paddingTop: '12px',
          paddingBottom: '12px',
        };
      }
      return style;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.adapterBottom = this.getHeight('.fixedBottom');
  },
  methods: {
    timerUpdateItem(jobid) {
      const { allTimerList } = this;
      const jobids = allTimerList.map(v => v.jobid);
      const pos = jobids.indexOf(jobid);
      if (pos > -1) {
        const timer = allTimerList[pos];
        const params = {
          ...timer,
          timer: {
            ...timer.timer,
            time: this.timeConvert(timer),
          },
          enable: !timer.enable,
        };
        allTimerList[pos] = params;
        this.upsert(params)
          .then((result = {}) => {
            const { status } = result;
            if (status === 0) {
              this.updateTimerList(allTimerList);
            }

            Toast.clear();
          })
          .catch(e => console.error(e));
      }
    },
    actionDec(action) {
      const { ac_mode } = action;
      const pwrText = this.getText('pwr', action);
      const pwrDes = `开关：${pwrText}`;
      let modeText;
      let modeDes = '';
      if (ac_mode != null) {
        modeText = this.getText('ac_mode', action);
        modeDes = `模式：${modeText}`;
      }
      return `${pwrDes}  ${modeDes}`;
    },
    goDetail(item) {
      // 详情
      this.$router.push({ name: 'timerAdd', params: { jobid: item.jobid } });
    },
    delTimer(jobid) {
      // 删除定时
      const params = {
        jobids: [jobid],
      };
      this.del(params)
        .then((result = {}) => {
          const { status } = result;
          if (status === 0) {
            const { allTimerList } = this;
            const jobids = allTimerList.map(v => v.jobid);
            const pos = jobids.indexOf(jobid);

            if (pos > -1) {
              allTimerList.splice(pos, 1);
              this.updateTimerList(allTimerList);
            }
            Toast.clear();
          }
        })
        .catch(e => console.error(e));
    },
    add() {
      // 添加定时
      if (this.timerList.length >= 16) {
        Toast('最多能设置16组定时');
        return;
      }
      this.$router.push('/timer/add');
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  .tips {
    font-size: 22px;
    color: @bl-gray-1;
    padding: 22px 36px;
  }
  .panel {
    margin-bottom: 6px;
  }
  .fixedBottom {
    background: @theme-color;
  }
}
.delete-button {
  width: 152px;
  height: 100%;
  font-size: 32px;
  color: @bl-white;
  background: @bl-error-color;
}
</style>
