import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import _ from 'lodash';

const prefix = 'super_admin/product/_id';

export default {
  data: () => ({
    productId: null,
    additionalImageMaxCount: 4,
    abroadPriceInWon: null,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getProduct`, params.id);
  },
  created() {
    this.productInit();
  },
  computed: {
    ...mapGetters({
      commonCodes: `${prefix}/commonCodes`,
      productData: `${prefix}/productData`,
      optionMap: `${prefix}/optionMap`,
      optionValueMap: `${prefix}/optionValueMap`,
      store: `${prefix}/store`,
      templates: `${prefix}/templates`,
      result: `${prefix}/result`,
    }),
    additionalImagesCount() {
      if (this.productData.product.additional_images) return this.productData.product.additional_images.length;
      return 0;
    },
    additionaImages() {
      if (this.productData.product.additional_images) return this.productData.product.additional_images;
      return [];
    },
    setDeliveryInfo() {
      const deliveryInfo = this.productData.deliveryInfo;
      const delivery = {
        deliveryMethod: this.commonCodes.delivery_method[deliveryInfo.delivery_method],
        feePayMethod: this.commonCodes.fee_pay_method[deliveryInfo.fee_pay_method],
        deliveryGroupStr: `묶음배송 ${deliveryInfo.delivery_group_id ? '가능' : '불가'}`,
        deliveryFee: this.commonCodes.delivery_fee_type[deliveryInfo.delivery_fee_type],
        departure: `출고지: (${deliveryInfo.departure_zipcode}) ${deliveryInfo.departure_address}`,
        arrival: `반품-교환지: (${deliveryInfo.arrival_zipcode}) ${deliveryInfo.arrival_address}`,
        returnFee: `반품배송비: ${deliveryInfo.return_fee}원(편도), ${deliveryInfo.exchange_fee}원(왕복)`,
      };

      if (deliveryInfo.delivery_fee_type !== 'FREE') {
        switch (deliveryInfo.delivery_fee_type) {
          case 'CNDTN':
            deliveryInfo.deliveryFee += ` / ${deliveryInfo.condition_value}원 이상 무료`;
            break;
          case 'AMOUNT':
            delivery.deliveryFee += ` / ${deliveryInfo.condition_value}개 마다 기본 배송비 반복 부과`;
            break;
          case 'AREA':
            delivery.deliveryFee += ` / ${deliveryInfo.condition_value}개 마다 기본 배송비 반복 부과`;
            break;
          case 'CHARGE':
          default:
            delivery.deliveryFee += `(${deliveryInfo.default_fee})원`;
        }
      }

      return Object.values(delivery).join(' / ');
    },
  },
  methods: {
    productInit() {
      this.productData.optionCompositions.forEach((oc) => {
        oc.option_values = {};
        oc.option_value_ids.forEach((optionValueId) => {
          const optionValue = this.optionValueMap[optionValueId];
          oc.option_values[optionValue.product_option_id] = optionValue;
        });
      });

      if (this.productData.product.abroad_price) {
        const abroadPrice = this.productData.product.abroad_price.price;
        this.abroadPriceInWon = (abroadPrice * this.productData.product.abroad_price.exchange_rate).toFixed(0);
      }
    },
    popTerms(template) {
      console.log(template);
      if (template) {
        new this.$popup.SummernoteEditor({
          propsData: {
            template,
            okCallback: (params) => params.$destroy(),
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('정보고시가 존재하지않습니다.');
      }
    },
    btnEditReason(pbhId) {
      const that = this;
      new Popup.Reason({
        propsData: {
          title: '해당 상품 제재 사유를 수정하시겠습니까?',
          okCallback: async (params) => {
            if (params.reason) {
              await that.$store.dispatch(`${prefix}/patchProductBlockReason`, {
                id: that.productData.product.id,
                product_block_history_id: pbhId,
                reason: params.reason,
              });
              if (this.result.result === 'success') {
                that.$popup.showAlertPopup('해당 상품의 제재 사유가 수정되었습니다.');
                const pbh = _.find(that.productData.productBlockHistories, (inPbh) => inPbh.id === pbhId);
                if (pbh) {
                  pbh.reason = params.reason;
                }
              } else that.$popup.showAlertPopup(that.result.message);
              params.$destroy();
            } else that.$popup.showAlertPopup('제재사유를 입력해주세요.');
          },
        },
      }).$mount();
    },
    blockStatusChange() {
      const that = this;
      if (this.productData.product.is_blocked) {
        new Popup.Confirm({
          propsData: {
            title: '해당 상품을 제재해제 하시겠습니까?',
            okCallback: async (params) => {
              await that.$store.dispatch(
                `${prefix}/patchProductBlocked`,
                { id: that.productData.product.id, is_blocked: false },
              );
              if (that.result.result === 'success') {
                that.$popup.showAlertPopup('해당 상품이 제재해제 되었습니다.');
                that.productData.product.is_blocked = false;
              } else that.$popup.showAlertPopup(that.result.message);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        new Popup.Reason({
          propsData: {
            title: '해당 상품을 제재하시겠습니까?',
            okCallback: async (params) => {
              if (params.reason) {
                await that.$store.dispatch(`${prefix}/patchProductBlocked`, {
                  id: that.productData.product.id,
                  is_blocked: true,
                  reason: params.reason,
                });
                if (this.result.result === 'success') {
                  that.$popup.showAlertPopup('해당 상품이 제재되었습니다.');
                  that.productData.product.is_blocked = true;
                  that.productData.productBlockHistories.push(that.result.data);
                } else that.$popup.showAlertPopup(that.result.message);
                params.$destroy();
              } else that.$popup.showAlertPopup('제재사유를 입력해주세요.');
            },
          },
        }).$mount();
      }
    },
    priceGroupConditionChange() {
      const that = this;
      new Popup.PriceGroupConditionEdit({
        propsData: {
          product: that.productData.product,
          okCallback: async (params) => {
            await that.$store.dispatch(`${prefix}/updateProductCanPriceGroup`, params);
            if (that.result.result === 'success') {
              that.$popup.showAlertPopup('수정되었습니다.');
            }
            params.$destroy();
            this.$router.go(0);
          },
        },
      }).$mount();
    },
  },
};
