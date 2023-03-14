import { mapGetters } from 'vuex';
import moment from 'moment-timezone';
import util from '@/assets/javascripts/util';
import ExcelDownload from '@/components/ExcelDownload';

moment.tz.setDefault('Asia/Seoul');
const prefix = 'store_admin/calculation';
const startMonthAt2020 = 8;

export default {
  data: () => ({
    loading: false,
    headers: [
      { sortable: false, text: '결제완료일', align: 'start', value: '' },
      { sortable: false, text: '구매확정일', value: '' },
      { sortable: false, text: '구분', value: '' },
      { sortable: false, text: '주문번호', value: '' },
      { sortable: false, text: '상품주문번호', value: '' },
      { sortable: false, text: '상품명', value: '' },
      { sortable: false, text: '옵션정보', value: '' },
      { sortable: false, text: '수량', value: '' },
      { sortable: false, text: '주문자명', value: '' },
      { sortable: false, text: '결제수단', value: '' },
      { sortable: false, text: '수수료(부가세포함)', value: '' },
      { sortable: false, text: '수수료 공급가액', value: '' },
      { sortable: false, text: '수수료 부가세액', value: '' },
      { sortable: false, text: '결제금액', value: '' },
      { sortable: false, text: '포인트', value: '' },
      { sortable: false, text: '정산금액', value: '' },
    ],
    decidePurchasedYears: [],
    decidePurchasedMonths: [],
    decidePurchasedDays: [],
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/GetDataTable`, query);
  },
  computed: {
    ...mapGetters({
      storeBalanceAccountOrderProducts: `${prefix}/storeBalanceAccountOrderProducts`,
      storeBalanceAccount: `${prefix}/storeBalanceAccount`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      startDate: `${prefix}/startDate`,
      endDate: `${prefix}/endDate`,
    }),
  },
  created() {
    const year = moment().year();
    this.emptySelectArray('year');
    this.emptySelectArray('month');
    this.emptySelectArray('day');
    for (let i = 2020; i <= year; i += 1) {
      // 현재 월이 1월이면서 15일이 경과 했을 경우에만 현재 년도 포함
      if (i === year) {
        if (moment().month() === 1) {
          if (moment().date() > 15) {
            this.pushValue('year', i);
          }
        } else {
          this.pushValue('year', i);
        }
      } else {
        this.pushValue('year', i);
      }
    }
  },
  methods: {
    emptySelectArray(type) {
      switch (type) {
        case 'year':
          this.decidePurchasedYears = [{
            text: '년도 선택',
            value: '',
            isChecked: true,
          }];
          break;
        case 'month':
          this.decidePurchasedMonths = [{
            text: '월 선택',
            value: '',
            isChecked: true,
          }];
          break;
        case 'day':
          this.decidePurchasedDays = [{
            text: '기간 선택',
            value: '',
            isChecked: true,
          }];
          break;
        default:
          console.error('type이 유효하지 않습니다.');
      }
    },
    pushValue(type, value, value2) {
      switch (type) {
        case 'year':
          this.decidePurchasedYears.push({
            text: `${value}년`,
            value,
            isChecked: false,
          });
          break;
        case 'month':
          this.decidePurchasedMonths.push({
            text: `${value}월`,
            value,
            isChecked: false,
          });
          break;
        case 'day':
          this.decidePurchasedDays.push({
            text: `${value}일 ~ ${value2}일`,
            value: `${value}_${value2}`,
            isChecked: false,
          });
          break;
        default:
          console.error('type이 유효하지 않습니다.');
      }
    },
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/GetDataTable`, query);
      this.loading = false;
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
    selectYear() {
      const year = this.$refs.searchYear.selectedItem;
      this.emptySelectArray('month');
      this.emptySelectArray('day');

      if (year) {
        let i = 1;
        let startMonth = 1;
        let endMonth = 12;
        // 선택한 년도와 현재 년도가 같을 경우
        if (year === moment().year()) {
          // 현재 월의 현재 일자가 15일이 지났을경우 현재월 포함
          if (moment().date() > 15) {
            endMonth = moment().month() + 1;
          } else {
            endMonth = moment().month();
          }
        }
        if (year === 2020) {
          startMonth = startMonthAt2020;
        }

        for (i = startMonth; i <= endMonth; i += 1) {
          this.pushValue('month', i);
        }
      }
    },
    selectMonth() {
      const month = this.$refs.searchMonth.selectedItem;
      this.emptySelectArray('day');
      if (month) {
        const year = this.$refs.searchYear.selectedItem;
        if (year === moment().year() && month === (moment().month() + 1)) {
          if (moment().date() > 15) {
            this.pushValue('day', 1, 15);
          }
        } else {
          this.pushValue('day', 1, 15);
          const lastDayOfMonth = moment(`${year}-${util.lpad(month, 2, '0')}-01`, 'YYYY-MM-DD').endOf('month').date();
          this.pushValue('day', 16, lastDayOfMonth);
        }
      }
    },
    downloadExcel() {
      if (this.totalCount <= 0) return this.$popup.showAlertPopup('조회 결과가 없습니다.');
      const that = this;
      new this.$popup.ExcelDownload({
        propsData: {
          totalCount: that.totalCount,
          okCallback(params) {
            const query = { ...that.$route.query };
            query.page_size = params.pageSize;
            query.page = params.page;

            // TODO loading popup
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
  },
};
