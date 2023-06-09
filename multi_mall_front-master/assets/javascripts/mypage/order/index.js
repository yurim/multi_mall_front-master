import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'mypage/order';

export default {
  middleware: 'userAuth',
  mixins: [SelperCommonMixin],
  data: () => ({
    currentPage: 1,
    orderStatusList: [],
    isShowTotalOrderStatus: false,
  }),
  async fetch({ store, query }) {
    await store.dispatch('common/getAgreements', ['exchng', 'rtrn']);
    await store.dispatch(`${prefix}/getOrderTable`, query);
    await store.dispatch('common/getCodes', ['order_status', 'order_sub_status', 'delivery_method']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      agreementObject: 'common/agreementObject',
      orderTable: `${prefix}/orderTable`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      deliveryInfo: `${prefix}/deliveryInfo`,
      result: `${prefix}/result`,
    }),
  },
  created() {
    this.init();
    const page = this.$route.query.page;
    if (page) {
      this.currentPage = parseInt(page, 10);
    }
  },
  methods: {
    initNullPointOrderList() {
      const orderTableLength = this.orderTable.length;
      for (let orderIdx = 0; orderIdx < orderTableLength; orderIdx += 1) {
        const stores = this.orderTable[orderIdx].stores;
        const storesLength = stores.length;
        for (let storeIdx = 0; storeIdx < storesLength; storeIdx += 1) {
          const deliveryGroups = stores[storeIdx].delivery_groups;
          const deliveryGroupsLength = deliveryGroups.length;
          for (let deliveryGroupIdx = 0; deliveryGroupIdx < deliveryGroupsLength; deliveryGroupIdx += 1) {
            const orderProducts = deliveryGroups[deliveryGroupIdx].order_products;
            const orderProductsLength = orderProducts.length;
            for (let orderProductIdx = 0; orderProductIdx < orderProductsLength; orderProductIdx += 1) {
              if (!orderProducts[orderProductIdx].order_sub_status || orderProducts[orderProductIdx].order_sub_status === null) {
                orderProducts[orderProductIdx].order_sub_status = '';
                orderProducts[orderProductIdx].order_sub_status_str = '';
              }
            }
          }
        }
      }
    },
    initOrderConditionList() {
      const orderStatusList = [];
      const orderStatusLength = this.codesArray('order_status').length;
      for (let idx = 0; idx < orderStatusLength; idx += 1) {
        const item = this.codesArray('order_status')[idx];
        if (item.value === '발송대기') {
          orderStatusList.push({ text: '상품준비중', value: 'DLVRY_WAIT,NEW_ORDR', count: 0, isChecked: false });
          orderStatusList.push({ text: '배송준비중', value: 'DLVRY_WAIT,CHCK_DLVRY,DLY_DLVRY', count: 0, isChecked: false });
        } else {
          orderStatusList.push({ text: item.value, value: item.key, count: 0, isChecked: false });
        }
      }

      this.orderStatusList = orderStatusList;

      const orderTableLength = this.orderTable.length;
      for (let orderIdx = 0; orderIdx < orderTableLength; orderIdx += 1) {
        const stores = this.orderTable[orderIdx].stores;
        const storesLength = stores.length;
        for (let storeIdx = 0; storeIdx < storesLength; storeIdx += 1) {
          const deliveryGroups = stores[storeIdx].delivery_groups;
          const deliveryGroupsLength = deliveryGroups.length;
          for (let deliveryGroupIdx = 0; deliveryGroupIdx < deliveryGroupsLength; deliveryGroupIdx += 1) {
            const orderProducts = deliveryGroups[deliveryGroupIdx].order_products;
            const orderProductsLength = orderProducts.length;
            for (let orderProductIdx = 0; orderProductIdx < orderProductsLength; orderProductIdx += 1) {
              this.orderStatusList.map((type) => {
                if (type.value.indexOf(orderProducts[orderProductIdx].order_status) > -1) type.count += 1;
                return type;
              });
            }
          }
        }
      }
    },
    initOrderConditionFilter() {
      const query = { ...this.$route.query };
      if (query.date_type) {
        this.orderStatusList.map((order) => {
          if (order.value.indexOf(query.date_type) > -1) order.isChecked = true;
          return order;
        });
      } else {
        this.isShowTotalOrderStatus = true;
      }
    },
    initPaidPrice() {
      const orderTableLength = this.orderTable.length;
      for (let orderTableIdx = 0; orderTableIdx < orderTableLength; orderTableIdx += 1) {
        const stores = this.orderTable[orderTableIdx].stores;
        const storesLength = stores.length;
        let orderProductsLength = storesLength - 1;
        for (let storesIdx = 0; storesIdx < storesLength; storesIdx += 1) {
          const deliveryGroups = stores[storesIdx].delivery_groups;
          const deliveryGroupsLength = deliveryGroups.length;
          for (let deliveryGroupsIdx = 0; deliveryGroupsIdx < deliveryGroupsLength; deliveryGroupsIdx += 1) {
            orderProductsLength += deliveryGroups[deliveryGroupsIdx].order_products.length;
          }
        }
        this.orderTable[orderTableIdx].order_products_length = orderProductsLength;
      }
    },
    init() {
      this.initNullPointOrderList();
      this.initOrderConditionList();
      this.initOrderConditionFilter();
      this.initPaidPrice();
    },
    async getOrderTable(query) {
      this.loading = true;
      await this.$router.push({ query });
      await this.$store.dispatch(`${prefix}/getOrderTable`, query);
      this.init();
      this.loading = false;
    },
    async filterOrderStatus(idx) {
      const query = { ...this.$route.query };
      if (idx === this.orderStatusList.length) {
        this.isShowTotalOrderStatus = true;
        this.orderStatusList.forEach((type) => { type.isChecked = false; });
        query.date_type = '';
      } else {
        this.isShowTotalOrderStatus = false;
        this.orderStatusList.forEach((type) => { type.isChecked = false; });
        this.orderStatusList[idx].isChecked = true;
        query.date_type = this.orderStatusList[idx].value;
      }
      await this.getOrderTable(query);
    },
    async showReason(orderProductId) {
      const res = await this.$store.dispatch(`${prefix}/getReason`, { order_product_id: orderProductId });
      if (!res.data.reason) return this.popupAlert('오류가 발생했습니다.');

      switch (res.data.reason.request.reason_type) {
        case 'RQST_CNCL':
          this.popupReqCancelEdit(orderProductId, res.data.reason);
          break;
        case 'RQST_EXCHNG':
          this.popupReqExchangeEdit(orderProductId, res.data.reason);
          break;
        case 'RQST_RTRN':
          this.popupReqReturnEdit(orderProductId, res.data.reason);
          break;
        case 'PSTPN_DLVRY': case 'PSTPN_CNCL': case 'PSTPN_EXCHNG': case 'PSTPN_RTRN':
          this.popupDelayReason(orderProductId, res.data.reason);
          break;
        default:
      }
    },
    async showDetail(orderProduct) {
      const claimOrderProduct = await this.$store.dispatch(`${prefix}/getExchangeReturnOrderDetail`, orderProduct.id);
      const res = await this.$store.dispatch(`${prefix}/getReason`, { order_product_id: orderProduct.id });
      if (!res.data.reason) return this.popupAlert('오류가 발생했습니다.');

      switch (res.data.reason.request.reason_type) {
        case 'RQST_CNCL':
          this.popupReqCancelDetail(orderProduct, res.data.reason);
          break;
        case 'RQST_EXCHNG':
          this.popupReqExchangeDetail(orderProduct, claimOrderProduct, res.data.reason);
          break;
        case 'RQST_RTRN':
          this.popupReqReturnDetail(orderProduct, claimOrderProduct, res.data.reason);
          break;
        default:
      }
    },
    /**
     * 사유보기 팝업
     */
    popupReqCancelEdit(orderProductId, cancelReason) {
      const that = this;
      const cancelReject = Object.prototype.hasOwnProperty.call(cancelReason, 'reject') ? cancelReason.reject : {};
      new Popup.RequestCancelEdit({
        propsData: {
          reason: cancelReason.request.reason,
          reason_sub_type: cancelReason.request.reason_sub_type,
          reject: cancelReject,
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.reason_sub_type) isEmptyList.push('취소사유 선택');
            if (!params.reason) isEmptyList.push('취소사유 상세');
            if (isEmptyList.length === 0) {
              const data = {
                order_product_id: orderProductId,
                reason_sub_type: params.reason_sub_type,
                reason: params.reason,
              };
              await that.$store.dispatch(`${prefix}/patchReason`, data);
              if (that.result.result === 'success') {
                params.$destroy();
                const query = { ...that.$route.query };
                await that.getOrderTable(query);
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`${isEmptyList.join('\n')}\n를 입력해주세요.`);
            }
          },
        },
      }).$mount();
    },
    popupReqCancelDetail(orderProductId, cancelReason) {
      const cancelReject = Object.prototype.hasOwnProperty.call(cancelReason, 'reject') ? cancelReason.reject : {};
      new Popup.RequestCancelDetail({
        propsData: {
          reason: cancelReason.request.reason,
          reason_sub_type: cancelReason.request.reason_sub_type,
          reason_sub_type_str: cancelReason.request.reason_sub_type_str,
          reject: cancelReject,
        },
      }).$mount();
    },
    popupReqExchangeEdit(orderProductId, exchangeReason) {
      const that = this;
      const exchangeReject = Object.prototype.hasOwnProperty.call(exchangeReason, 'reject') ? exchangeReason.reject : {};
      new Popup.RequestExchangeEdit({
        propsData: {
          reason: exchangeReason.request.reason,
          reason_sub_type: exchangeReason.request.reason_sub_type,
          reject: exchangeReject,
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.reason_sub_type) isEmptyList.push('교환사유 선택');
            if (!params.reason) isEmptyList.push('교환사유 상세');
            if (isEmptyList.length === 0) {
              const data = {
                order_product_id: orderProductId,
                reason_sub_type: params.reason_sub_type,
                reason: params.reason,
              };
              await that.$store.dispatch(`${prefix}/patchReason`, data);
              if (that.result.result === 'success') {
                params.$destroy();
                const query = { ...that.$route.query };
                await that.getOrderTable(query);
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`${isEmptyList.join('\n')}\n를 입력해주세요.`);
            }
          },
        },
      }).$mount();
    },
    popupReqExchangeDetail(orderProduct, claimOrderProduct, exchangeReason) {
      const exchangeReject = Object.prototype.hasOwnProperty.call(exchangeReason, 'reject') ? exchangeReason.reject : {};
      new Popup.RequestExchangeDetail({
        propsData: {
          order_product: orderProduct,
          claim_order_product: claimOrderProduct,
          reason: exchangeReason.request.reason,
          reason_sub_type: exchangeReason.request.reason_sub_type,
          reason_sub_type_str: exchangeReason.request.reason_sub_type_str,
          reason_responsible_for: exchangeReason.request.reason_responsible_for,
          reject: exchangeReject,
        },
      }).$mount();
    },
    popupReqReturnEdit(orderProductId, returnReason) {
      const that = this;
      const returnReject = Object.prototype.hasOwnProperty.call(returnReason, 'reject') ? returnReason.reject : {};
      new Popup.RequestReturnEdit({
        propsData: {
          reason: returnReason.request.reason,
          reason_sub_type: returnReason.request.reason_sub_type,
          reject: returnReject,
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.reason_sub_type) isEmptyList.push('반품사유 선택');
            if (!params.reason) isEmptyList.push('반품사유 상세');
            if (isEmptyList.length === 0) {
              const data = {
                order_product_id: orderProductId,
                reason_sub_type: params.reason_sub_type,
                reason: params.reason,
              };
              await that.$store.dispatch(`${prefix}/patchReason`, data);
              if (that.result.result === 'success') {
                params.$destroy();
                const query = { ...that.$route.query };
                await that.getOrderTable(query);
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`${isEmptyList.join('\n')}\n를 입력해주세요.`);
            }
          },
        },
      }).$mount();
    },
    popupReqReturnDetail(orderProduct, claimOrderProduct, exchangeReason) {
      const exchangeReject = Object.prototype.hasOwnProperty.call(exchangeReason, 'reject') ? exchangeReason.reject : {};
      new Popup.RequestReturnDetail({
        propsData: {
          order_product: orderProduct,
          claim_order_product: claimOrderProduct,
          reason: exchangeReason.request.reason,
          reason_sub_type: exchangeReason.request.reason_sub_type,
          reason_sub_type_str: exchangeReason.request.reason_sub_type_str,
          reason_responsible_for: exchangeReason.request.reason_responsible_for,
          reject: exchangeReject,
        },
      }).$mount();
    },
    popupDelayReason(orderProductId, delayReason) {
      new Popup.DelayReason({
        propsData: {
          reason: delayReason.request.reason,
          reason_sub_type: delayReason.request.reason_sub_type,
          reason_sub_type_str: delayReason.request.reason_sub_type_str,
        },
      }).$mount();
    },

    async orderListInquiry() {
      const query = this.$refs.searchDatePicker.query;
      await this.getOrderTable(query);
    },
    async onPage(query) {
      await this.getOrderTable(query);
    },
    async completePurchase(product) {
      const query = { ...this.$route.query };
      const params = { order_product_id: String(product.id) };
      await this.$store.dispatch(`${prefix}/setDecidePurchase`, params);
      if (this.result.result === 'success') {
        this.popupAlert('구매확정 되었습니다.');
        await this.getOrderTable(query);
      } else this.popupAlert(this.result.message);
    },
    // popups
    popTerms(agreementType, agreementTypeStr) {
      new Popup.Terms({
        propsData: {
          title: agreementTypeStr,
          message: this.agreementObject(agreementType).content,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    async popupDeliveryInquiry(info, store) {
      await this.$store.dispatch(`${prefix}/getDeliveryInfo`, info.id);

      const data = { deliveryInfo: this.deliveryInfo, product: info, store };
      if (Object.keys(this.deliveryInfo).length > 0) {
        new Popup.DeliveryInfo({
          propsData: {
            info: data,
            okCallback: (params) => params.$destroy(),
          },
        }).$mount();
      }
    },
    popupReviewWrite(orderProduct) {
      let productPrice = (orderProduct.product_discount_price) ? orderProduct.product_discount_price : orderProduct.product_price;
      productPrice += orderProduct.option_price;
      const data = {
        product_name: orderProduct.product_name,
        product_option_names: orderProduct.product_option_names,
        amount: orderProduct.amount,
        product_price: productPrice,
        ordered_at: orderProduct.ordered_at,
        store_name_kor: orderProduct.store_name_kor,
        product_image: orderProduct.product_image,
      };

      new this.$popup.ReviewWrite({
        propsData: {
          data,
          okCallback: async (params) => {
            if (params.content && params.rate) {
              await this.$createLoading(async () => {
                const formData = new FormData();
                formData.append('order_product_id', orderProduct.id);
                formData.append('content', params.content);
                formData.append('score', params.rate);
                params.reviewImages.forEach((value) => {
                  formData.append('reviewImages', value);
                });
                await this.$store.dispatch(`${prefix}/createReview`, formData);
                if (this.result.result === 'success') {
                  this.popupAlert('리뷰가 등록되었습니다.');
                  const query = { ...this.$route.query };
                  await this.getOrderTable(query);
                } else this.popupAlert(this.result.message);
              });
            } else {
              this.popupAlert('리뷰를 작성해주세요.');
            }
            params.$destroy();
          },
        },
      }).$mount();
    },
    popupInquiryProduct(info, store) {
      const that = this;
      const item = {
        name: info.product_name,
        option: info.product_option_names,
        amount: info.amount,
        store_name_kor: store.store_name_kor,
      };
      new Popup.InquiryWrite({
        propsData: {
          isMallInquiry: false,
          data: item,
          okCallback: async (params) => {
            if (params.content) {
              const question = { product_id: info.product_id, store_id: info.store_id, content: params.content, is_secret: params.is_secret };
              await that.$store.dispatch(`${prefix}/createInquiryProduct`, question);
              if (that.result.result === 'success') {
                that.popupAlert('문의가 등록되었습니다.');
                const query = { ...that.$route.query };
                await that.getOrderTable(query);
              } else that.popupAlert(that.result.message);
              params.$destroy();
            } else that.popupAlert('내용을 입력해주세요.');
          },
        },
      }).$mount();
    },
    cancelRequestCancel(orderStatus, orderSubStatus, orderProductId) {
      const that = this;
      const data = { message: '', storePrefixPath: '' };
      if (orderStatus === 'EXCHNG' && orderSubStatus === 'RQST_EXCHNG') {
        data.storePrefixPath = 'setCancelOrderProductExchange';
        data.message = '교환요청을 취소하시겠습니까?';
      }
      if (orderStatus === 'RTRN' && orderSubStatus === 'RQST_RTRN') {
        data.storePrefixPath = 'setCancelOrderProductReturn';
        data.message = '반품요청을 취소하시겠습니까?';
      }
      if (orderStatus === 'CNCL' && orderSubStatus === 'RQST_CNCL') {
        data.storePrefixPath = 'setCancelOrderProductCancel';
        data.message = '취소요청을 취소하시겠습니까?';
      }
      if (data.message) {
        new Popup.Confirm({
          propsData: {
            title: data.message,
            okCallback: async (params) => {
              await that.$store.dispatch(`${prefix}/${data.storePrefixPath}`, { order_product_id: orderProductId });
              if (that.result.result === 'success') {
                that.popupAlert('요청취소 되었습니다.');
                const query = { ...that.$route.query };
                await that.getOrderTable(query);
              } else that.popupAlert(that.result.message);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        that.popupAlert('이 주문건은 취소요청을 할 수 없습니다.');
      }
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
};
