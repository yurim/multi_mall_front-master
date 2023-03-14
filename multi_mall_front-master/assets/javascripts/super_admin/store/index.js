import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';
import Popup from '@/components/popups/popup';
import ExcelDownload from '@/components/ExcelDownload';

const prefix = 'super_admin/store';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '매장번호', align: 'start', value: 'id', width: '120px' },
      { text: '입점날짜', value: 'created_at', width: '100px', sortable: false },
      { text: '매장명', value: 'name_kor', sortable: false },
      { text: '매장구분', value: 'store_type', sortable: false },
      { text: '담당자', value: 'manager_name', sortable: false },
      { text: '담당자 연락처', value: 'cs_phone', sortable: false },
      { text: '이메일', value: 'manager_email', sortable: false },
      { text: '주소', value: 'address', sortable: false },
      { text: '입점상태', value: 'store_state_type', width: '100px', sortable: false },
      { text: '노출상태', value: 'is_show', width: '100px', sortable: false },
      { text: '스토어어드민', value: 'url', sortable: false, width: '60px' },
    ],
    sido: '',
  }),
  async fetch({ store, query }) {
    query = { ...query, filter_storeStateType: 'ENTR_RQSTD,NORMAL,LEAVE_RQSTD' };
    await store.dispatch(`${prefix}/getStores`, query);
    await store.dispatch(`${prefix}/getStoresCount`);
  },
  computed: {
    ...mapGetters({
      count: `${prefix}/count`,
      stores: `${prefix}/stores`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      result: `${prefix}/result`,
      sigunguCodes: `${prefix}/sigunguCodes`,

      // 셀렉트에서 매장 검색
      storeSearchList: `${prefix}/storeSearchList`,
      storeTotalCount: `${prefix}/storeTotalCount`,
      storePageSize: `${prefix}/storePageSize`,
      storeCurrPage: `${prefix}/storeCurrPage`,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      if (Object.prototype.hasOwnProperty.call(query, 'filter_sido')) this.sido = query.filter_sido;
      if (Object.prototype.hasOwnProperty.call(query, 'filter_sigungu')) this.setSigunguCode();
    },
    getSidoData(e) {
      this.sido = e.target.value;
      if (this.sido) this.getSigunguCodes();
      // sido 데이터가 빈값인 경우 에러를 내뿜긔해서 보완 추가하긔
      delete this.$refs.searchFilterSigungu;
      delete this.$refs.searchFilterAddress;
    },
    setSigunguCode() {
      this.getSigunguCodes();
      const { query } = this.$route;
      if (Object.prototype.hasOwnProperty.call(query, 'filter_sigungu')) {
        Array.prototype.find.call(this.sigunguCodes, (item) => {
          if (item.value === query.filter_sigungu) item.isChecked = false;
          return item;
        });
      }
    },
    async getSigunguCodes() {
      if (this.sido) await this.$store.dispatch(`${prefix}/getSigunguCodes`, { sido: this.sido });
    },
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getStores`, query);
      this.loading = false;
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      if (this.sido) this.sido = '';
      await this.getData(query);
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    isShowTrue() {
      const title = '노출된 매장';
      this.isShow(true, title);
    },
    isShowFalse() {
      const title = '노출되지 않은 매장';
      this.isShow(false, title);
    },
    isShow(isShowCheck, title) {
      const params = { stores: [], ids: [] };
      const isShowStoreList = [];
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        params.stores.push(item);
        params.ids.push(item.id);
      });
      if (params.stores.length > 0 && params.ids.length > 0) {
        params.stores.forEach((store) => {
          if (store.is_show === isShowCheck) isShowStoreList.push(`${store.id}번 매장`);
        });
        if (isShowStoreList.length === 0) {
          new Popup.Confirm({
            propsData: {
              title: '선택된 매장의 노출상태를 변경하시겠습니까?',
              okCallback: async (inParams) => {
                const data = { ids: params.ids, is_show: isShowCheck };
                await this.$store.dispatch(`${prefix}/patchStoresShow`, data);
                if (this.result.result === 'success') {
                  this.popupAlert('노출상태가 성공적으로 변경되었습니다.');
                  this.$nuxt.refresh();
                } else {
                  this.popupAlert(this.result.message);
                }
                inParams.$destroy();
              },
            },
          }).$mount();
        } else {
          this.popupAlert(`이미 ${title}이 존재합니다.\n${isShowStoreList.join('\n')}`);
        }
      } else {
        this.popupAlert('노출상태를 변경할 매장을 선택해주세요.');
      }
    },
    downloadExcel() {
      const that = this;
      new Popup.ExcelDownload({
        propsData: {
          totalCount: that.totalCount,
          okCallback(params) {
            const query = {
              ...that.$route.query,
            };
            query.page_size = params.pageSize;
            query.page = params.page;
            new ExcelDownload({
              propsData: {
                href: `${prefix}/download_excel`,
                params: query,
                $axios: this.$store.$axios,
              },
            }).$mount();
          },
        },
      }).$mount();
    },
    selectDownloadExcel() {
      const params = {
        store_ids: [],
      };
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        params.store_ids.push(item.id);
      });
      if (params.store_ids.length > 0) {
        new ExcelDownload({
          propsData: {
            href: `${prefix}/download_excel`,
            params,
            $axios: this.$store.$axios,
          },
        }).$mount();
      } else {
        const title = '엑셀다운로드 할 매장을 선택해주세요.';
        this.popupAlert(title);
      }
    },
    async searchStoreStatus(keyword) {
      const query = { ...this.$route.query };
      query.filter_storeStateType = keyword;
      this.$refs.searchStoreStateType.copiedItems.forEach((type) => {
        if (type.value === keyword) type.isChecked = true;
        else type.isChecked = false;
      });
      this.$router.push({ query });
      await this.getData(query);
    },
    async routeToStoreAdmin(id) {
      const res = await this.$axios.get(`admin/user/switch/${id}`);
      if (res.data.result === 'success') {
        Utils.addCookie('jwt', res.data.data.token);
        this.$router.push({ name: 'store_admin-main' });
      }
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (inParams) => inParams.$destroy(),
        },
      }).$mount();
    },

    /**
     * 판매매장 검색 함수
     */
    async onChangeStore(type, query) {
      if (type === 'search') {
        await this.$store.dispatch(`${prefix}/resetStoreSearchList`);
      }
      if (!query) query = {};
      await this.$store.dispatch(`${prefix}/getStoreSearchList`, query);
    },
    async onResetStore() {
      await this.$store.dispatch(`${prefix}/resetStoreSearchList`);
    },
  },
};
