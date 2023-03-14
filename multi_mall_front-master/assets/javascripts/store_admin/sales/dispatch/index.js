import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
import _ from 'lodash';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');
const prefix = 'store_admin/sales/dispatch';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '주문번호', align: 'start', value: 'order_num', sortable: false },
      { text: '상품주문번호', value: 'product_order_num', sortable: false },
      { text: '배송방법', value: '', sortable: false },
      { text: '택배사 선택', value: '', sortable: false },
      { text: '운송장 번호', value: '', sortable: false },
      { text: '주문자명', value: 'name', sortable: false },
      { text: '주문자연락처', value: 'phone', sortable: false },
      { text: '주문자 ID', value: 'email', sortable: false },
      { text: '주문상태', value: 'order_status', sortable: false },
      { text: '주문상태 상세', value: 'order_sub_status', sortable: false },
      { text: '주문일시', value: 'ordered_at' },
      { text: '결제위치', value: '', sortable: false },
      { text: '결제일', value: 'paid_at' },
      { text: '상품코드', value: 'product_id', sortable: false },
      { text: '판매처', value: '', sortable: false },
      { text: '상품명', value: 'product_name', sortable: false },
      { text: '옵션정보', value: 'product_option_names', sortable: false },
      { text: '수량', value: 'amount', sortable: false },
      { text: '옵션 추가금액', value: 'option_price', sortable: false },
      { text: '상품가격', value: 'product_price', sortable: false },
      { text: '상품별 할인판매가격', value: 'product_discount_price', sortable: false },
      { text: '총 상품 주문금액', value: 'total_price', sortable: false },
      { text: '발주확인일', value: 'order_checked_at', sortable: false },
      { text: '발송예정일', value: 'expected_dispatched_at', sortable: false },
      { text: '발송처리일', value: 'delivered_at', sortable: false },
      { text: '배송비 형태', value: 'fee_pay_method', sortable: false },
      { text: '배송비유형', value: 'delivery_fee_type', sortable: false },
      { text: '수취인 이름', value: 'delivery_name', sortable: false },
      { text: '수취인 연락처', value: 'delivery_phone', sortable: false },
      { text: '배송지', value: 'delivery_address', sortable: false },
      { text: '우편번호', value: 'delivery_zipcode', sortable: false },
      { text: '배송메세지', value: 'delivery_message', sortable: false },
      { text: '결제수단', value: 'payment_method', sortable: false },
    ],
    deliveryCompanies: [],
    selectDeliveryInfo: {
      deliveryCompany: '',
      invoiceNum: '',
    },
    selectedOrderStatus: '',
    showSubStatusList: false,
  }),
  async fetch({ store, query }) {
    // default 1주일 조회
    const startDate = moment().subtract(1, 'weeks').add(1, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    const q = {
      start_date: startDate,
      end_date: endDate,
      date_type: 'paid_at',
      page: 1,
      page_size: 50,
      ...query,
    };
    await store.dispatch(`${prefix}/getOrderProducts`, q);
    await store.dispatch('common/getCodes', ['delivery_company', 'reason_type']);
  },
  computed: {
    ...mapGetters({
      orderProducts: `${prefix}/orderProducts`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      codesArray: 'common/codesArray',
    }),
  },
  created() {
    this.deliveryCompanies = this.codesArray('delivery_company');
    this.reasonTypes = this.codesArray('reason_type');
    if (this.$route.query.order_status === 'DLVRY_WAIT') {
      this.showSubStatusList = true;
    }
  },
  methods: {
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getOrderProducts`, query);
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
    getSubStatusList(e) {
      this.selectedOrderStatus = e.target.value;
      this.showSubStatusList = this.selectedOrderStatus === 'DLVRY_WAIT';
    },
    getSelectedOrderProductIds() {
      return this.$refs.dataTable.getSelectedItems().map((v) => v.id);
    },
    getSelectedOrderIds() {
      return this.$refs.dataTable.getSelectedItems().map((v) => v.orderId);
    },
    downloadExcel() {
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
    selectDownloadExcel(e) {
      const params = {
        order_product_ids: this.getSelectedOrderProductIds(),
      };
      if (params.order_product_ids.length > 0) {
        // TODO loading popup
        new ExcelDownload({
          propsData: {
            href: `${prefix}/download_excel`,
            params,
            $axios: this.$store.$axios,
          },
        }).$mount();
      } else {
        e.preventDefault();
        this.$popup.showAlertPopup('엑셀다운로드할 상품주문 건을 선택해주세요.');
      }
    },
    selectApplyDelivery() {
      if (this.selectDeliveryInfo.deliveryCompany && this.selectDeliveryInfo.invoiceNum) {
        const orderProductIds = [];
        this.$refs.dataTable.getSelectedItems().forEach((item) => {
          if (item.deliveryMethod === 'PARCEL') {
            orderProductIds.push(item.id);
          }
        });

        const params = {
          order_product_ids: orderProductIds,
          delivery_company: this.selectDeliveryInfo.deliveryCompany,
          invoice_num: this.selectDeliveryInfo.invoiceNum,
        };

        if (params.order_product_ids.length > 0) {
          const that = this;
          new this.$popup.Confirm({
            propsData: {
              title: '선택한 상품주문건의 택배사 및 운송장번호를 저장하시겠습니까?',
              okCallback: async (inParams) => {
                const res = await that.$axios.$post(`${prefix}/selected_delivery_info`, params);
                if (res.result === 'success') {
                  that.$store.commit(`${prefix}/setDeliveryOrderProducts`, params);
                } else {
                  this.$popup.showAlertPopup(res.message);
                }
                inParams.$destroy();
              },
            },
          }).$mount();
        } else {
          this.$popup.showAlertPopup('배송방법이 택배/소포/등기인 택배사 및 운송장 번호를 적용할 상품주문 건을 선택해주세요.');
        }
      } else {
        this.$popup.showAlertPopup('택배사 선택 및 송장번호를 입력해주세요.');
      }
    },
    btnCheckDelivery() {
      // 발주확인
      const orderProductIds = [];
      let hasDeliveryInfo = true;
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        if (item.orderStatus === 'DLVRY_WAIT' && item.orderSubStatus === 'NEW_ORDR') {
          orderProductIds.push(item.id);
        } else {
          hasDeliveryInfo = false;
        }
      });

      if (hasDeliveryInfo) {
        const params = {
          order_product_ids: orderProductIds,
        };

        if (params.order_product_ids.length > 0) {
          const that = this;
          new this.$popup.Confirm({
            propsData: {
              title: '선택한 상품주문건의 발주확인 처리 하시겠습니까?',
              okCallback: async (inParams) => {
                const res = await that.$axios.$post(`${prefix}/selected_check_delivery`, params);
                if (res.result === 'success') {
                  const data = res.data;

                  that.$store.commit(`${prefix}/setOrderStatusOrderProducts`, {
                    order_product_ids: params.order_product_ids,
                    orderStatusStr: data.orderStatusStr,
                    orderStatus: data.orderStatus,
                    orderSubStatusStr: data.orderSubStatusStr,
                    orderSubStatus: data.orderSubStatus,
                  });
                } else {
                  this.$popup.showAlertPopup(res.message);
                }
                inParams.$destroy();
              },
            },
          }).$mount();
        } else {
          this.$popup.showAlertPopup('발주 확인 처리할 상품주문 건을 선택해주세요.');
        }
      } else {
        this.$popup.showAlertPopup('신규주문 상태가 아닌 주문건이 존재합니다.');
      }
    },
    btnDelayDelivery() {
      if (this.$refs.dataTable.getSelectedItems().length <= 0) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      new this.$popup.DelaysDelivery({
        propsData: {
          okCallback: (params) => {
            if (!params.reason_sub_type) return this.$popup.showAlertPopup('발송지연 사유를 선택해주세요.');
            if (!params.expected_dispatched_at) return this.$popup.showAlertPopup('발송예정날짜를 입력해주세요.');
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('발송지연 상세 사유를 입력해주세요.');
            new this.$popup.Confirm({
              propsData: {
                title: '한번 발송지연 처리 후에는 수정이 불가합니다. 발송지연 처리를 진행하시겠습니까?',
                okCallback: async ({ $destroy }) => {
                  const orderProductIds = this.$refs.dataTable.getSelectedItems()
                    .filter((item) => (item.orderStatus === 'DLVRY_WAIT'))
                    .map((v) => v.id);

                  if (orderProductIds.length <= 0) this.$popup.showAlertPopup('발송대기 상태인 상품 주문건을 선택해주세요.');

                  const res = await this.$axios.$post(`${prefix}/selected_delay_delivery`, {
                    order_product_ids: orderProductIds,
                    reason_sub_type: params.reason_sub_type,
                    date: params.expected_dispatched_at,
                    reason: params.reason,
                  });
                  if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

                  await this.$store.commit(`${prefix}/setOrderStatusOrderProducts`, {
                    order_product_ids: orderProductIds,
                    orderStatusStr: res.data.orderStatusStr,
                    orderStatus: res.data.orderStatus,
                    orderSubStatusStr: res.data.orderSubStatusStr,
                    orderSubStatus: res.data.orderSubStatus,
                  });

                  this.$popup.showAlertPopup('완료되었습니다.');
                  await this.refresh();
                  params.$destroy();
                  $destroy();
                },
              },
            }).$mount();
          },
        },
      }).$mount();
    },
    // 엑셀일괄 송장정보 입력
    btnUploadExcel() {
      const that = this;
      new this.$popup.UploadFile({
        propsData: {
          title: '송장번호 일괄등록',
          async okCallback(params) {
            if (params.file) {
              const formData = new FormData();
              formData.append('file', params.file);

              const res = await that.$axios.post(`${prefix}/upload_delivery_invoice`, formData, {
                headers: {
                  'content-type': 'multipart/form-data',
                },
              });

              if (res.data.result === 'success') {
                await this.$store.dispatch(`${prefix}/getOrderProducts`, that.$route.query);
              } else {
                this.$popup.showAlertPopup(res.data.message);
              }
              params.$destroy();
            } else {
              this.$popup.showAlertPopup('파일을 업로드해주세요.');
            }
          },
          checkFile(file) {
            const validExts = ['.xlsx'];
            const fileExt = file.name.substring(file.name.lastIndexOf('.'));
            if (_.includes(validExts, fileExt)) {
              return true;
            }
            this.$popup.showAlertPopup('엑셀 파일(.xlsx)만 업로드 가능합니다.');
            return false;
          },
        },
      }).$mount();
    },
    // 엑셀양식 다운로드
    btnDownloadExcelTemplate() {
      new ExcelDownload({
        propsData: {
          href: `${prefix}/delivery_invoice_template`,
          $axios: this.$store.$axios,
        },
      }).$mount();
    },
    // 배송지 정보수정
    btnOrderDelivery() {
      const that = this;
      const orderIds = that.getSelectedOrderIds();
      if (orderIds.length > 0) {
        new this.$popup.OrderDeliveryInfo({
          propsData: {
            async okCallback(params) {
              let errorMessage = null;
              if (!params.name) {
                errorMessage = '수취인명을 입력해주세요.';
              } else if (!params.phone) {
                errorMessage = '수취인 연락처를 입력해주세요.';
              } else if (!params.zipcode) {
                errorMessage = '우편번호를 입력해주세요.';
              } else if (!params.address) {
                errorMessage = '주소를 입력해주세요.';
              }

              if (errorMessage) {
                this.$popup.showAlertPopup(errorMessage);
              } else {
                const res = await that.$axios.$put(`${prefix}/order_delivery`, {
                  order_ids: orderIds,
                  name: params.name,
                  phone: params.phone,
                  zipcode: params.zipcode,
                  address: params.address,
                  detail_address: params.detailAddress,
                });

                if (res.result === 'success') {
                  this.$popup.showAlertPopup('완료되었습니다.');
                  await that.refresh();
                  params.$destroy();
                } else {
                  this.$popup.showAlertPopup(res.data.message);
                }
              }
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('변경할 주문건을 선택해주세요.');
      }
    },
    // 발송처리
    btnProcessingDelivery() {
      const that = this;
      const orderProducts = [];
      let notDlvryWait = false;
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        if (item.orderStatus === 'DLVRY_WAIT' && item.deliveryCompany && item.invoiceNum) {
          orderProducts.push({
            order_product_id: item.id,
            delivery_company: item.deliveryCompany,
            invoice_num: item.invoiceNum,
          });
        } else {
          notDlvryWait = true;
        }
      });
      if (notDlvryWait) {
        this.$popup.showAlertPopup('배송정보가 입력 된 발송대기 상태의 상품주문 건만 발송처리할 수 있습니다.');
      } else if (orderProducts.length > 0) {
        new this.$popup.Confirm({
          propsData: {
            title: '발송처리하시겠습니까?',
            async okCallback(e) {
              const res = await that.$axios.$post(`${prefix}/dispatch`, {
                order_product_deliveries: orderProducts,
              });

              if (res.result === 'success') {
                this.$popup.showAlertPopup('완료되었습니다.');
                await that.refresh();
              } else {
                this.$popup.showAlertPopup(res.message);
              }

              e.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('발송 처리할 상품주문 건을 선택해주세요.');
      }
    },
    // 판매취소 - 미결제 또는 발송대기 상태에서만 가능
    btnCancel() {
      const orderProductIds = [];
      let notDlvryWait = false;
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        if (item.orderStatus === 'DLVRY_WAIT' || item.orderStatus === 'NOT_PAID') {
          orderProductIds.push(item.id);
        } else {
          notDlvryWait = true;
        }
      });

      if (notDlvryWait) return this.$popup.showAlertPopup('미결제 또는 발송대기 상태의 상품주문 건만 판매취소 요청 처리할 수 있습니다.');
      if (orderProductIds.length <= 0) return this.$popup.showAlertPopup('판매 취소 요청 처리할 상품주문 건을 선택해주세요.');

      new this.$popup.RequestCancel({
        propsData: {
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('취소 사유를 입력해주세요.');
            params.order_product_ids = orderProductIds;

            const res = await this.$axios.$post(`${prefix}/cancel`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnSaveIndividualDelivery() {
      if (this.$refs.dataTable.getSelectedItems().length <= 0) return this.$popup.showAlertPopup('택배사 및 운송장번호를 저장할 상품주문건을 선택해주세요.');
      const orderProductDeliveries = [];
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        if (item.deliveryMethod === 'PARCEL' && item.deliveryCompany && item.invoiceNum) {
          orderProductDeliveries.push({
            order_product_id: item.id,
            delivery_company: item.deliveryCompany,
            invoice_num: item.invoiceNum,
          });
        }
      });

      if (orderProductDeliveries.length > 0) {
        const that = this;
        new this.$popup.Confirm({
          propsData: {
            title: '저장하시겠습니까?',
            async okCallback(e) {
              const res = await that.$axios.$post(`${prefix}/selected_individual_delivery_info`, {
                order_product_deliveries: orderProductDeliveries,
              });

              if (res.result === 'success') {
                await this.$store.dispatch(`${prefix}/getOrderProducts`, that.$route.query);
              } else {
                this.$popup.showAlertPopup(res.data.message);
              }

              e.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('택배사 및 운송장번호를 입력해주세요.');
      }
    },
  },
};
