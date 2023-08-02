/*
 * @Description: 定时|睡眠  列表方法
 * @Author: your name
 * @Date: 2019-05-17 11:08:07
 * @LastEditTime: 2022-08-18 15:42:24
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 */
import { mapState, mapActions, mapMutations } from 'vuex';
import Toast from 'vant/lib/toast';
import { notifyError } from 'utilsPath';

export default which => ({
  data() {
    return {
      [`${which}`]: {},
    };
  },
  computed: {
    ...mapState('app', ['deviceInfo']),
    ...mapState('timer', {
      requestStatus: state => {
        console.log('-----requestStatus-----', state.status);
        return state.status;
      },
    }),
    setType() {
      const { requestStatus, timerList } = this;
      if (requestStatus === -1) {
        // 加载中
        return 'loading';
      }

      if (requestStatus === 1) {
        // 加载错误
        return 'error';
      }

      if (timerList.length <= 0) {
        // 空
        return 'empty';
      }

      return null;
    },
  },
  created() {},

  methods: {
    ...mapActions('timer', ['query']),
    ...mapMutations('timer', ['updateStatus']),
    queryTimer() {
      // 查询定时列表
      const { deviceID } = this.deviceInfo;
      this.updateStatus(-1);
      Toast.loading({
        mask: true,
        duration: 0, // 持续展示 toast
        loadingType: 'spinner',
      });
      const params = {
        endpointid: deviceID,
      };
      this.query(params).then(
        result => {
          if (result) {
            const { status } = result;
            this.updateStatus(status == 0 ? status : 1); // 0:成功，1:失败
          }
          Toast.clear();
        },
        e => {
          this.updateStatus(1);
          notifyError(e);
        }
      );
    },
  },
});
