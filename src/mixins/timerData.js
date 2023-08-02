/*
 * @Description: 定时|睡眠  数据列表方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditTime: 2022-07-26 15:21:30
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';

export default which => ({
  data() {
    return {
      [`${which}`]: {},
    };
  },
  computed: {
    ...mapState('timer', {
      allTimerList: state => state.timerList,
    }),
  },
  created() {},

  methods: {
    ...mapActions('timer', ['upsert', 'del']),
    ...mapMutations('timer', ['updateTimerList', 'updateTimerInfo']),
    getSleepDiyPeriod(item) {
      const { timer, action } = item;
      const start = moment(timer.time).get('hour');
      const num = start + action.sleep_diy.length;
      const end = num >= 24 ? num - 24 : num;
      return { start, end };
    },
    updateTimer(jobid) {
      // 修改定时
      // 恢复侧滑样式
      const swipeCell = this.$refs[`swipeCell_${jobid}`][0];
      if (swipeCell) {
        swipeCell.close();
      }
      this[`${which}UpdateItem`](jobid);
    },
    showModal(jobid) {
      this.$dialog
        .confirm({
          message: '确定要执行该操作？',
          confirmButtonText: '确定',
          className: 'confirm-modal',
          overlayClass: 'modal-overlay',
        })
        .then(() => {
          // on confirm
          this.delTimer(jobid);
        })
        .catch(() => {
          // on cancel
        });
    },
  },
});
