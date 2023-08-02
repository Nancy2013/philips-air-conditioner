<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 -->
<template>
  <bl-page-wrapper :adapter-bottom="adapterBottom" safe-bottom>
    <div slot="content" class="portal">
      <bl-navbar
        :title="deviceStatus.name"
        :background="'#14726C'"
        :title-color="'#fff'"
        exit
        property
      />
      <bl-notify v-if="isShow" :message="notify" @close="closeNotify" />
      <div>
        <Info />
        <Control :disabled="status.pwr !== 1 || !online" />
        <SetBox />
      </div>
    </div>
  </bl-page-wrapper>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { isEmpty } from 'lodash';
import Info from './Info.vue';
import Control from './Control.vue';
import SetBox from './SetBox.vue';
import Mix from '@/mixins';

const { StyleCreaterMix } = Mix;
export default {
  name: 'Portal',
  components: {
    Info,
    Control,
    SetBox,
  },
  mixins: [StyleCreaterMix('portal')],
  props: {},
  data() {
    return {
      errorMsg: '',
    };
  },
  computed: {
    ...mapState('app', ['deviceStatus']),
    ...mapGetters('app', ['status', 'online']),
    ...mapState('fault', ['faultList', 'hideNotify']),
    notify() {
      // 故障提醒
      const faults = this.faultList;
      const errorCode = this.getErrorCode();
      const errorMsg = faults[errorCode];
      console.log('----notify---', errorMsg);
      return errorMsg;
    },
    isShow() {
      const { notify } = this;
      const isShow = notify && !this.hideNotify;
      return isShow;
    },
  },
  watch: {
    'status.ac_errcode1': {
      handler(newVal, oldVal) {
        if (newVal) {
          if (isEmpty(this.faultList)) {
            this.faultQuery();
          }
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
    ...mapActions('fault', ['faultQuery']),
    ...mapMutations('fault', ['updateHideNotify']),
    setDeviceStatus() {
      const { pwr } = this.status;
      this.control({ pwr: pwr === 1 ? 0 : 1 });
      localStorage.setItem(
        'status',
        JSON.stringify({ pwr: pwr === 1 ? 0 : 1 })
      );
      this.$router.push({ name: 'control' });
    },
    getErrorCode() {
      // 设置故障码
      const { ac_errcode1, err_flag } = this.status;
      if (ac_errcode1 && ac_errcode1 !== 0) {
        const type = !err_flag ? 'A_' : 'B_';
        const errorCode = type + ac_errcode1;
        console.log('----errorCode----', errorCode);
        return errorCode;
      }
      return null;
    },
    closeNotify() {
      this.updateHideNotify(true);
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
  background: @bl-green-2;
}
.portal {
  color: @bl-white;
}
</style>
