import { mapGetters } from 'vuex';

const prefix = 'store_admin/main';

export default {
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getMainStatus`);
  },
  computed: {
    ...mapGetters({
      salesStatus: `${prefix}/salesStatus`,
      enterStatus: `${prefix}/enterStatus`,
      productStatus: `${prefix}/productStatus`,
      orderSubStatus: `${prefix}/orderSubStatus`,
      noAnswer: `${prefix}/noAnswer`,
      saleDelayStatus: `${prefix}/saleDelayStatus`,
    }),
    getStatusSalesNotPaid() { // 입금대기
      if (this.salesStatus.NOT_PAID) return this.salesStatus.NOT_PAID;
      return 0;
    },
    getStatusSalesPaid() { // 결제완료
      if (this.salesStatus.PAID_NEW_ORDR) return this.salesStatus.PAID_NEW_ORDR;
      return 0;
    },
    getStatusSalesDeliveryWait() { // 배송준비
      if (this.salesStatus.CHCK_DLVRY) return this.salesStatus.CHCK_DLVRY;
      return 0;
    },
    getStatusSalesDelivering() { // 배송중
      if (this.salesStatus.DLVRNG) return this.salesStatus.DLVRNG;
      return 0;
    },
    getStatusSalesDeliveryComplete() { // 배송완료
      if (this.salesStatus.DLVRY_CMPLT) return this.salesStatus.DLVRY_CMPLT;
      return 0;
    },
    getStatusSalesDCDPRCHS() { // 구매확정
      if (this.salesStatus.DCD_PRCHS) return this.salesStatus.DCD_PRCHS;
      return 0;
    },
    getStatusSaleDelayDelivery() { // 발송지연
      if (this.saleDelayStatus.DLY_DLVRY) return this.saleDelayStatus.DLY_DLVRY;
      return 0;
    },
    getStatusSaleDelayCancel() { // 취소지연
      if (this.saleDelayStatus.DLY_CNCL) return this.saleDelayStatus.DLY_CNCL;
      return 0;
    },
    getStatusSaleDelayReturn() { // 반품지연
      if (this.saleDelayStatus.DLY_RTRN) return this.saleDelayStatus.DLY_RTRN;
      return 0;
    },
    getStatusSaleDelayExchange() { // 교환지연
      if (this.saleDelayStatus.DLY_EXCHNG) return this.saleDelayStatus.DLY_EXCHNG;
      return 0;
    },
    getStatusOrderSubCancel() { // 취소요청
      if (this.orderSubStatus.RQST_CNCL) return this.orderSubStatus.RQST_CNCL;
      return 0;
    },
    getStatusOrderSubReturn() { // 반품교청
      if (this.orderSubStatus.RQST_RTRN) return this.orderSubStatus.RQST_RTRN;
      return 0;
    },
    getStatusOrderSubExchange() { // 교환요청
      if (this.orderSubStatus.RQST_EXCHNG) return this.orderSubStatus.RQST_EXCHNG;
      return 0;
    },
    getStatusNoAnswer() { // 미답변 상품문의
      if (this.noAnswer.noanswer) return this.noAnswer.noanswer;
      return 0;
    },
    getStatusNoAnswerOneToOne() { // 1:1 미답변 상품문의
      if (this.noAnswer.noanswer_1to1) return this.noAnswer.noanswer_1to1;
      return 0;
    },
    getStatusProductSale() { // 판매중
      if (this.productStatus.is_sale) return this.productStatus.is_sale;
      return 0;
    },
    getStatusProductNotSale() { // 판매중지
      if (this.productStatus.is_not_sale) return this.productStatus.is_not_sale;
      return 0;
    },
    getStatusProductListed() { // 전시중
      if (this.productStatus.is_listed) return this.productStatus.is_listed;
      return 0;
    },
    getStatusProductNotListed() { // 전시중지
      if (this.productStatus.is_not_listed) return this.productStatus.is_not_listed;
      return 0;
    },
  },
};
