import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
// import Popup from '@/components/popups/popup';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '가입일', align: 'start', value: 'created_at' },
      { text: '이메일', value: 'email' },
      { text: '전화번호', value: 'phone' },
      { text: '이름', value: 'name' },
      { text: '혜택지급', value: '', is_sorted: false },
      { text: '휴면여부', value: 'is_dormant' },
    ],
  }),
  async fetch({ store, query }) {
    await store.dispatch('super_admin/user/getUsers', query);
  },
  computed: {
    ...mapGetters({
      users: 'super_admin/user/users',
      totalCount: 'super_admin/user/totalCount',
      pageSize: 'super_admin/user/pageSize',
    }),
  },
  created() {
  },
  methods: {
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch('super_admin/user/getUsers', query);
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },
    benefit(params) {
      console.log(params);
      // if (params.length > 0) {
      //   new Popup.Benefit({
      //     propsData: {
      //       params,
      //       async okCallback(inParams) {
      //         await this.$store.dispatch('super_admin/user/benefit',);
      //         inParams.$destroy();
      //       },
      //     },
      //   }).$mount();
      // } else {
      //   new Popup.Alert({
      //     propsData: {
      //       title: '혜택을 지급할 유저를 선택해주세요.',
      //       okCallback: (inParams) => inParams.$destroy(),
      //     },
      //   }).$mount();
      // }
    },
    async downloadExcel(type) {
      let params = {};
      if (type === 'match') {
        const { query } = this.$route;
        params = query;
      } else if (type === 'select') {
        const ids = this.$refs.dataTable.getSelectedItems().map((item) => item.id);
        params.user_ids = ids;
        if (ids.length > 200) return this.$popup.showAlertPopup('200개 이하의 항목만 다운로드할 수 있습니다.');
        if (ids.length <= 0) return this.$popup.showAlertPopup('엑셀다운로드 할 유저를 선택해주세요.');
      }

      new ExcelDownload({
        propsData: {
          href: 'super_admin/user/download_excel',
          params,
          $axios: this.$store.$axios,
        },
      }).$mount();
    },
  },
};
