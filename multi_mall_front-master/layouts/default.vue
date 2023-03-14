<template>
  <v-app light>
    <Nuxt keep-alive :keep-alive-props="{
      include: ['pc-main', 'pc-store-id', 'pc-price-group', 'pc-price-group-search']}" />
  </v-app>
</template>
<script>
import packageJson from '@/package.json';
import Star from '@/components/Star';
import Popup from '@/components/popups/popup';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');

export default {
  components: { Star },
  head() {
    return {
      title: 'Molly',
    };
  },
  data() {
    return {
    };
  },
  created() {
    console.log(`Molly_${process.env.DEPLOY_TARGET}_${process.env.NODE_ENV} [ v${packageJson.version} ]`);
  },
  mounted() {
    // 페이지 접속 시 팝업
    // const checkAdmin = this.$route.name.indexOf('admin');
    // if (checkAdmin < 0) this.showEventPopup();
  },
  methods: {
    showEventPopup() {
      const expiredDate = localStorage.getItem('eventNoMoreToday');
      if (expiredDate) {
        const today = moment().format('YYYY-MM-DD');
        const expired = moment(expiredDate).format('YYYY-MM-DD');
        const flag = moment(today).isAfter(expired);
        if (!flag) return;
      }

      new Popup.EventInfo().$mount();
    },
  },
};
</script>
<style>
  .v-application { display: block !important; }
</style>
