<!--
 * @Author: your name
 * @Date: 2022-02-21 14:00:32
 * @LastEditTime: 2022-08-18 16:41:56
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \philips-air-conditioner\src\page\components\__index.vue
-->
<template>
  <div class="list">
    <van-swipe-cell
      v-for="item in timerList"
      :ref="`swipeCell_${item.jobid}`"
      :key="item.jobid"
    >
      <bl-panel
        :title="getTitle(item)"
        :left-sub-title="getPeriod(item)"
        class="panel"
        @click="() => goDetail(item)"
      >
        <div slot="right">
          <bl-switch
            :value="item.enable"
            class="right-icon"
            bar-background-color="#9CD4D6"
            @click="() => updateTimer(item.jobid)"
          />
        </div>
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
    <div v-if="timerList.length < 2" class="btn">
      <van-button type="primary" size="normal" @click="add"
        >点击添加</van-button
      >
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import checked from 'stylesPath/images/checked.svg';
import unchecked from 'stylesPath/images/unchecked.svg';
import Toast from 'vant/lib/toast';
import Mix from '@/mixins';

const { DataInfoCreaterMix, TimerCreaterMix, TimerDataCreaterMix } = Mix;
export default {
  name: 'List',
  components: {},
  mixins: [
    DataInfoCreaterMix('sleep'),
    TimerCreaterMix('sleep'),
    TimerDataCreaterMix('sleep'),
  ],
  props: {},
  data() {
    return {
      checked,
      unchecked,
    };
  },
  computed: {
    ...mapGetters('app', ['status']),
    timerList() {
      const getSleepList = this.$store.getters['timer/getSleepList'];
      return getSleepList;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 删除睡眠DIY及使能sleepdiy
    getTitle(item) {
      const { name } = item;
      const ac_mode = name.split('_')[2];
      const title = `${ac_mode === '0' ? '制冷' : '制热'}模式`;
      return title;
    },
    getPeriod(item) {
      const { start, end } = this.getSleepDiyPeriod(item);
      const subTitle = `${start}:00 - ${end}:00`;
      return subTitle;
    },
    sleepUpdateItem(jobid) {
      const { allTimerList, valid } = this;
      const jobids = allTimerList.map(v => v.jobid);
      const pos = jobids.indexOf(jobid);

      if (pos > -1) {
        const timer = allTimerList[pos];
        if (!timer.enable) {
          if (valid()) {
            return;
          }
        }
        const params = {
          ...timer,
          enable: !timer.enable,
        };
        allTimerList[pos] = params;
        this.upsert(params)
          .then((result = {}) => {
            const { status } = result;
            if (status === 0) {
              this.sleepdiyUpdateItem(jobid, params.enable); // 更新使能
              this.updateTimerList(allTimerList);
            }
            Toast.clear();
          })
          .catch(e => console.error(e));
      }
    },
    valid() {
      // 有效性判断
      const { timerList } = this;
      const enable = timerList.some(v => v.enable);
      if (enable) {
        // 已经有打开的睡眠DIY
        Toast('请关闭睡眠DIY后进行操作');
        return true;
      }
      return false;
    },
    goDetail(item) {
      // 详情
      this.updateTimerInfo(item);
      const { name } = item;
      const ac_mode = name.split('_')[1];
      this.$router.push({
        name: 'sleepAdd',
        params: { ac_mode, jobid: item.jobid },
      });
    },
    delTimer(jobid) {
      // 删除定时
      const delJobids = [jobid];
      const sleepdiyJobid = this.getJobid(jobid);
      if (sleepdiyJobid) {
        // 删除使能定时
        delJobids.push(sleepdiyJobid);
      }
      const params = {
        jobids: delJobids,
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
    sleepdiyUpdateItem(jobid, enable) {
      // 更新使能enable
      const { allTimerList } = this;
      const jobids = allTimerList.map(v => v.jobid);
      const sleepdiyJobid = this.getJobid(jobid);
      if (sleepdiyJobid) {
        const pos = jobids.indexOf(sleepdiyJobid);
        if (pos > -1) {
          const sleep_diyTimer = allTimerList[pos];
          const params = {
            ...sleep_diyTimer,
            enable,
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
      }
    },
    getJobid(jobid) {
      // 获得sleepdiy使能的定时
      const { allTimerList } = this;
      const sleep_diyTimer = allTimerList.filter(v => v.jobid === jobid)[0];
      if (sleep_diyTimer) {
        const ac_mode = sleep_diyTimer.name.split('_')[2];
        const sleepdiyTimer =
          allTimerList.filter(v => v.name === `sleepdiy_${ac_mode}_0`)[0] || {};
        return sleepdiyTimer.jobid;
      }
      return null;
    },
    add() {
      // 添加睡眠DIY
      const { valid } = this;
      if (valid()) {
        return;
      }
      this.$router.push('/sleep/default');
    },
  },
};
</script>

<style lang="less" scoped>
.delete-button {
  width: 152px;
  height: 100%;
  font-size: 32px;
  color: @bl-white;
  background: @bl-error-color;
}
.list {
  padding-top: 40px;
  .panel {
    padding-left: 78px;
    padding-right: 36px;
  }
  .btn {
    position: fixed;
    text-align: center;
    left: 50%;
    bottom: 242px;
    transform: translate(-50%, 0);
  }

  /deep/ .left .title {
    font-size: 28px;
    color: @bl-gray-8;
  }
  /deep/ .left .subtitle {
    color: @bl-gray-8;
  }
}
</style>
