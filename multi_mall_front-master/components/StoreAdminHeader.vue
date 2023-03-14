<template>
  <div class="header_wrap">
    <div class="logo_wrap">
      <nuxt-link to="/super_admin/main" v-if="isSuperAdmin"><img alt="company logo" src="../assets/img/admin/molly_logo.svg"></nuxt-link>
      <nuxt-link to="/store_admin/main" v-else><img alt="company logo" src="../assets/img/admin/molly_logo.svg"></nuxt-link>
    </div>

    <div class="change_store_wrap">
      <div class="current_store" v-if="storeName && isSuperAdmin">
        <div>현재 매장명 : </div>
        <span>{{ storeName }}</span>
      </div>

      <div class="search_store" v-if="isSuperAdmin">
        <vue-select v-model="selectedStore" label="name_kor" :options="stores"></vue-select>
        <div class="small_but_wrap">
          <a v-on:click="switchStoreAdmin">이동</a>
        </div>
      </div>

      <div class="update">
        <div class="small_but_wrap">
          <a v-on:click="refresh" class="line_but">새로고침 <img src="../assets/img/admin/icon/refresh.png" alt="새로고침 아이콘"></a>
        </div>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <div class="sub_nav">
      <span v-if="isSuperAdmin">super admin</span>
      <span v-else>{{ adminUserName }} 님</span>
      <a class="btn_small" @click="logout">로그아웃</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';
import Popup from '@/components/popups/popup';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');
const KEY_JWT = 'jwt';
const title = '잘못된 접근입니다.';

export default {
  name: 'StoreAdminHeader',
  data: () => ({
    storeIdx: '',
    storeId: '',
    isSuperAdmin: false,
    currentDate: '',
    selectedStore: null,
  }),
  computed: {
    ...mapGetters({
      stores: 'super_admin/store/storeSwitcher',
      adminUserName: 'admin/user/login/username',
    }),
    storeName() {
      if (this.stores.length > 0 && this.selectedStore) {
        this.storeId = this.selectedStore.id;
        return this.selectedStore.name_kor;
      }
    },
  },
  async created() {
    await this.$store.dispatch('admin/user/login/getAdminUserName');
    if (this.userGrade === '2') await this.$store.dispatch('super_admin/store/getStoreSwitcher');
  },
  beforeMount() {
    const jwt = Utils.getCookie(document.cookie, KEY_JWT);
    if (!jwt) return this.popupAlert(title);
    const info = JSON.parse(atob(jwt.split('.')[1]));
    this.userGrade = info.info.split('_')[1];
    if (this.userGrade === '2') this.isSuperAdmin = true;
    this.currentDate = Utils.getCookie(document.cookie, 'store_refresh_data');
    const storeId = info.info.split('_')[2];

    const storeName = Utils.getCookie(document.cookie, 'admin_store_name');
    if (storeName) {
      this.selectedStore = {
        id: storeId,
        name_kor: storeName,
      };
    }
  },
  methods: {
    refresh() {
      this.currentDate = moment().format('YYYY/MM/DD - HH:mm:ss');
      Utils.addCookie('store_refresh_data', this.currentDate);
      this.$nuxt.refresh();
    },
    redirect() {
      this.$router.push({ name: 'admin-user-login' });
    },
    logout() {
      Utils.removeCookie('jwt');
      this.redirect();
    },
    selectStore(e) {
      const id = e.target.value;
      this.store.id = id;
      this.stores.forEach((store) => {
        if (store.id === Number(this.store.id)) this.store.name = `${store.name_kor}(${store.name_eng})`;
      });
    },
    async switchStoreAdmin() {
      if (this.storeId && this.selectedStore) {
        const res = await this.$axios.get(`admin/user/switch/${this.storeId}`);
        if (res.data.result === 'success') {
          Utils.addCookie('jwt', res.data.data.token);
          Utils.addCookie('admin_store_name', this.selectedStore.name_kor);
          const currentPath = this.$router.currentRoute.path;
          if (currentPath.indexOf('main') > -1) await this.$store.dispatch('store_admin/main/getMainStatus');
          else this.$router.push({ name: 'store_admin-main' });
        }
      }
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
      this.logout();
    },
  },
};
</script>
