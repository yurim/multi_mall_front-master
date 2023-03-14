import { mapGetters } from 'vuex';
import _ from 'lodash';
import fp from 'lodash/fp';

const prefix = 'store_admin/product/linkage';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '상품명', value: '', sortable: false },
      { text: '자사몰 카테고리', value: '', sortable: false },
      { text: '전송일시', value: '', sortable: false },
      { text: '환율적용전 원가\n(화폐단위)', value: '', sortable: false },
      { text: '자사몰 판매가', value: '', sortable: false },
      { text: '자사몰 할인판매가', value: '', sortable: false },
      { text: '중복여부', value: '', sortable: false },
      { text: '연동대상', value: '', sortable: false },
      { text: '상품구분', value: '', sortable: false },
    ],
    searchLinkageTypes: [
      { text: '전체', value: '', isChecked: true },
    ],
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getLinkageProducts`, query);
  },
  computed: {
    ...mapGetters({
      linkageProducts: `${prefix}/linkageProducts`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      linkageTypes: `${prefix}/linkageTypes`,
    }),
  },
  async created() {
    await this.init();
  },
  methods: {
    init() {
      _.forEach(this.linkageTypes, (value) => {
        this.searchLinkageTypes.push({
          text: value.name, value: value.code, isChecked: false,
        });
      });
    },
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getLinkageProducts`, query);
      this.loading = false;
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },

    /**
     * 선택상품 게시하기
     */
    btnSelectedTransfer() {
      const linkageProducts = this.$refs.dataTable.getSelectedItems();
      if (linkageProducts.length < 1) return this.$popup.showAlertPopup('선택하신 상품이 존재하지 않습니다.\n상품을 선택해주세요');
      // 카테고리 다를 때 팝업
      const category = linkageProducts[0].linkage_category.full_name;
      let isDifferent = false;
      for (let i = 0; i < linkageProducts.length; i += 1) {
        if (category !== linkageProducts[i].linkage_category.full_name) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        new this.$popup.Confirm({
          propsData: {
            title: '상품등록시 카테고리를 하나로 지정합니다.\n선택하신 상품들의 카테고리가 서로 다릅니다. 계속 진행하시겠습니까?',
            okCallback: (e) => {
              this.confirmTransferProducts(linkageProducts);
              e.$destroy();
            },
          },
        }).$mount();
      } else {
        this.confirmTransferProducts(linkageProducts);
      }
    },
    confirmTransferProducts(linkageProducts) {
      new this.$popup.Confirm({
        propsData: {
          title: `선택하신 상품 "${linkageProducts.length}"개를 몰리에 등록하시겠습니까?`,
          okCallback: async (e) => {
            await this.transferProducts(linkageProducts);
            e.$destroy();
          },
        },
      }).$mount();
    },
    async transferProducts(linkageProducts) {
      // 환전이 필요한 화폐 리스트
      const currencyUnits = fp.flow(
        (items) => _.map(items, 'currency_unit'),
        (items) => _.uniqBy(items, 'iso'),
        (items) => _.filter(items, (e) => e.iso !== 'KRW'),
      )(linkageProducts);

      // 해외상품 존재 확인
      let isAbroad = false;
      for (let i = 0; i < linkageProducts.length; i += 1) {
        if (linkageProducts[i].is_abroad === true) {
          isAbroad = true;
          break;
        }
      }

      new this.$popup.TransferLinkage({
        propsData: {
          title: '외부상품 등록',
          currencyUnits,
          isAbroad,
          okCallback: async (params) => {
            const btn = document.getElementById('popup_btn_ok');
            btn.disabled = true;
            params.data.linkage_product_ids = _.map(linkageProducts, '_id');
            const res = await this.$store.dispatch(`${prefix}/transferLinkageProducts`, params.data);

            if (res.result === 'success') {
              this.$popup.showAlertPopup('게시 신청이 완료되었습니다.');
              await this.refresh();
            } else {
              this.$popup.showAlertPopup(res.message);
            }

            btn.disabled = false;
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
