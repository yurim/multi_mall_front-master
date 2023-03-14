import util from '@/assets/javascripts/util';
import { mapGetters } from 'vuex';
import _ from 'lodash';

const prefix = 'store_admin/sales/amazic9/request';
const prefixAmazic9 = 'store_admin/sales/amazic9/common';

export default {
  data: () => ({
    target: '',

    deliveryRequest: {
      order_delivery_request_id: '',
      st11_order_delivery_request_id: '',
      kor_name: '',
      eng_name: '',
      phone: '',
      clearance_num: '',
      zipcode: '',
      address: '',
      detail_address: '',
      delivery_note: '',
      delivery_type: '',
    },
    deliveryProducts: [],

    delivery_types: [],

    totalAmount: 0,
    totalPrices: {},

    maxFileSize: (10 * 1024 * 1024),

    termsAgree: false,
    // todo: 임시 이용약관
    tempTerms: '1. 배송신청서에 작성된 모든 정보는 세관신고서에 반영되므로 정확하게 작성하셔야 합니다. 허위 정보 작성 / 정보 미 기재에 의해 발생하는 불이익은 어메이직9에서는 책임지지 않습니다.\n'
      + '\n'
      + '2. 수입이 금지된 품목 상품의 구매로 인해 발생하는 불이익에 대해서는 어메이직9에서 책임지지 않습니다.\n'
      + '\n'
      + '3. 어메이직9에서는 동일 해외운송장번호 건에 대한 나눔 배송과 분할배송을 하지 않습니다. (하나의 신청서로 작성바랍니다.)\n'
      + '\n'
      + '\n'
      + '4. 배송신청서 작성 시 주문번호별(판매자별)로 작성을 하셔야 하며, 주문번호가 다른 경우 각각 따로 작성을 해주셔야 합니다. 묶음 최대 상품 종류수는 5가지입니다.\n'
      + '\n'
      + '5. 한 쇼핑몰(판매자)에서 한번에 결제하고 주문한 상품들은 여러 개의 상품들이라도 택배가 모두 한 박스로 도착할 가능성이 높으므로\n'
      + '배송신청서 하나에 모두 등록바랍니다. 동일 품종의 경우 각기 다른 옵션이어도 한 품종으로 묶어서 수량변경으로 등록 가능하십니다.\n'
      + '\n'
      + '6. 상품 발송 이후 수취인 정보 변경은 불가능합니다. 발송 전 부득이한 원인으로 인해 변경이 필요할 경우 변경수수료는 3,000원입니다.\n'
      + '\n'
      + '7. 발송은 배송신청서 기준으로 이루어지며 한 배송신청서의 여러 주문 건은 다른 상품이 입고될 때까지 대기 상태가 되며 모든 상품이 입고되면 검수 후 상품 발송을 시작합니다. 분할 배송을 원하시는 경우 각각 신청서를 작성해주셔야 됩니다.\n'
      + '\n'
      + '8. 멀티박스, 창고보관료, 특수포장 수수료 등은 물류센터 현장의 판단이나 어메이직9 정책에 의해 추가 비용이 발생할 수 있습니다.\n'
      + '\n'
      + '9. 트래킹번호를 반드시 입력해주셔야 빠르고 정확한 입고확인이 가능합니다. 트래킹번호가 부정확한 경우나 사서함번호가 없이 입고된 건의 경우 입고확인이 늦어질 수 있습니다.\n'
      + '\n'
      + '10. 어메이직9에서 진행되는 모든 운송은 중국내륙운송, 국제운송, 세관검사, 한국내택배 등 여러 단계를 거치므로, 특수포장을 진행한 경우에도, 파손보상을 진행할 수 없습니다. 그러므로 최대한 파손을 방지하기 위해 취급에 주의를 요하는 모든 품목은 입고팀의 판단에 따라 분류 후 검수 진행 없이 중국내 택배가 도착한 그대로 박스제거 없이 한국으로 발송됨을 양해 부탁드립니다. 박스제거 옵션을 선택하시거나 요청하셔도 택배박스제거를 진행하지 않습니다.\n'
      + '\n'
      + '11. 국내택배 규격외 화물, 중형화물배송, 독차배송이 필요한 건에 대해서는 착불비용이 별도로 발생됩니다.\n'
      + '\n'
      + '12. 어메이직9의 창고포장팀의 판단에 의해 여러개의 박스 또는 택배 봉투로 포장될 수 있습니다. (여러개 박스 또는 택배봉투 발송 - 첫 박스를 제외한 추가 박스당 3000원씩 비용이 발생합니다. 여러개의 박스 발송은 “멀티박스”라고 칭합니다. )\n'
      + '\n'
      + '13.결제 금액 불일치 또는 입금자명 불일치로 되는 경우 출고 지연이 발생될수 있습니다.\n'
      + '\n'
      + '14.150달러 이상 또는 수량 다량시 과세 될수 있으며, 상품명,수량,금액이 실제품과 틀릴시 과태료가 나올수 있습니다.\n'
      + '2번 이상 과태료 부과된 개인통관번호(사업자)는 과태료가 올라가고 특별관리로 검수 강화 됩니다.\n'
      + '\n'
      + '15. 어메이직9는 통관불가 또는 폐기를 예방하기 위해 전자제품, 식품, 식물은 배송대행을 받지 않고 있습니다. 해당 품목 주문으로 인해 발생하는 보류, 폐기에 대해서는 어메이직9에서 책임지지 않습니다.\n'
      + '\n'
      + '16. 사은품(특히 식품)등 신청서 미기재 제품은 통관시 문제 발생소지가 높아 자동으로 폐기하고 있습니다. 구매하신 제품은 반드시 신청서에 함께 기재하여 폐기되는 일이 없도록 부탁드립니다.\n'
      + '\n'
      + '17. 중국내배송비는 상품금액을 수정해서 추가하여 주시기바랍니다.\n'
      + '\n'
      + '18. 포장은 한번 신청하면 취소가 불가능합니다.\n'
      + '\n'
      + '19. 캐릭터, 상표권 등의 문제, 수량과다(사업자의심) 문제로 인한 통관보류에 대하여 어메이직9에서 책임지지 않습니다. (1회이상 적발시 사이트이용이 제한됩니다.)\n'
      + '\n'
      + '20. 보관은 입고날 부터 30일까지 무료 보관이며 31일 부터 1일씩 1000원의 보관 수수료가 발생합니다. 90일 이후에는 자동 폐기 처리 됩니다.\n'
      + '\n'
      + '21. 본인이 직접 주문한 제품의 배송, 통관진행중 발생하는 불이익은 어메이직9에서 책임지지 않습니다. 이부분 꼭 참고 하셔서 진행 바랍니다.',
  }),
  async fetch({ store, query, redirect }) {
    if (['default', 'st11'].indexOf(query.target) > -1) {
      if (query.target === 'st11'
        && (!query.st11_order_delivery_request_id || !query.st11_order_product_delivery_request_ids)) { // 11번가 주문상품
        return redirect('/store_admin/sales/st11');
      }
      if (!query.order_delivery_request_id || !query.order_product_delivery_request_ids) { // 기본 주문상품
        return redirect('/store_admin/sales/amazic9');
      }
    } else {
      return redirect('/store_admin/main');
    }

    if (query.target === 'st11') {
      const data = {
        st11_order_delivery_request_id: query.st11_order_delivery_request_id,
        st11_order_product_delivery_request_ids: [...query.st11_order_product_delivery_request_ids],
      };
      await store.dispatch(`${prefix}/get11stOrderInfo`, data);
    } else {
      const ids = Array.isArray(query.order_product_delivery_request_ids) ? [...query.order_product_delivery_request_ids] : [query.order_product_delivery_request_ids];
      const data = {
        order_delivery_request_id: query.order_delivery_request_id,
        order_product_delivery_request_ids: ids,
      };
      await store.dispatch(`${prefix}/getOrderInfo`, data);
    }
    await store.dispatch(`${prefixAmazic9}/getCurrencyUnits`);
    await store.dispatch('common/getCodes', 'amazic9_delivery_type');
  },
  async created() {
    await this.initParams();
    await this.initDeliveryRequest();
    await this.initDeliveryProducts();
    await this.initCommonCodes();
  },
  computed: {
    ...mapGetters({
      order: `${prefix}/order`,

      items: `${prefixAmazic9}/items`,
      itemCurrPage: `${prefixAmazic9}/itemCurrPage`,
      itemTotalCount: `${prefixAmazic9}/itemTotalCount`,
      itemPageSize: `${prefixAmazic9}/itemPageSize`,

      codesArray: 'common/codesArray',
      currencyUnits: `${prefixAmazic9}/currencyUnits`,
    }),
  },
  methods: {
    initParams() {
      const query = this.$route.query;
      this.target = query.target;
      if (this.target === 'st11') {
        this.deliveryRequest.st11_order_delivery_request_id = query.st11_order_delivery_request_id;
      } else {
        this.deliveryRequest.order_delivery_request_id = query.order_delivery_request_id;
      }
    },
    /**
     * 배송대행 상품 초기화
     */
    initDeliveryProducts() {
      const deliveryProducts = [];
      this.order.order_products.forEach((orderProduct) => {
        const additionalImages = (orderProduct.product) ? orderProduct.product.additional_images : null;
        let deliveryProductPrice = null;
        let currencyUnit = '';
        if (orderProduct.product && orderProduct.product.abroad_price) {
          const discountPrice = orderProduct.product.abroad_price.discount_price;
          const price = orderProduct.product.abroad_price.price;
          deliveryProductPrice = discountPrice || price;
          if (orderProduct.product.abroad_price.currency_unit) {
            const iso = orderProduct.product.abroad_price.currency_unit.iso;
            currencyUnit = _.find(this.currencyUnits, { iso });
          }
        }
        deliveryProducts.push({
          order_product_id: orderProduct.id,
          info: {
            order_num: orderProduct.order_num,
            product: {
              name: (orderProduct.product) ? orderProduct.product.name : null,
              option_names: orderProduct.product_option_names,
              main_image: (orderProduct.product) ? orderProduct.product.main_image : null,
              additional_images: additionalImages,
              target: (orderProduct.product) ? orderProduct.product.target : null,
            },
            order_status_str: orderProduct.order_status_str,
          },
          option_image: {
            type: (additionalImages && additionalImages.length > 0) ? 'select' : 'upload',
          },
          selected_option_image: (additionalImages && additionalImages.length > 0) ? additionalImages[0] : null,
          option_image_type: 'select',
          price: deliveryProductPrice,
          currency_unit: currencyUnit,
        });
      });
      this.deliveryProducts = deliveryProducts;
    },
    /**
     * 배송대행신청 초기화
     */
    initDeliveryRequest() {
      const receiver = this.order.receiver;
      this.deliveryRequest.kor_name = receiver.name;
      this.deliveryRequest.phone = receiver.phone;
      this.deliveryRequest.clearance_num = receiver.clearance_num;
      this.deliveryRequest.zipcode = receiver.zipcode;
      this.deliveryRequest.address = receiver.address;
      this.deliveryRequest.detail_address = receiver.detail_address;
      this.deliveryRequest.delivery_note = receiver.delivery_message;
    },
    /**
     * 공통코드 초기화 (배송유형)
     */
    initCommonCodes() {
      const deliveryTypes = this.codesArray('amazic9_delivery_type');
      this.delivery_types = deliveryTypes.filter((v) => ['NORMAL', 'SHIPPING'].indexOf(v.key) > -1);
      this.deliveryRequest.delivery_type = 'NORMAL';
    },
    /**
     * 다음 주소검색
     */
    searchAddress() {
      util.showSearchAddress((data) => {
        this.$set(this.deliveryRequest, 'zipcode', data.zonecode);
        this.$set(this.deliveryRequest, 'address', data.address);
        this.$set(this.deliveryRequest, 'detail_address', '');
      });
    },

    /**
     * 품목 Select 함수
     */
    async onChange(type, query) {
      if (type === 'search') {
        await this.$store.commit(`${prefixAmazic9}/resetItems`);
      }
      await this.$store.dispatch(`${prefixAmazic9}/getItems`, query);
    },
    async onReset() {
      await this.$store.commit(`${prefixAmazic9}/resetItems`);
    },
    onSelect(e) {
      const deliveryProductIndex = e.selectId;
      const item = this.deliveryProducts[deliveryProductIndex];
      if (e.id && e.eng_name) {
        item.item_id = e.id;
        item.eng_name = e.eng_name;
      } else {
        item.item_id = null;
        item.eng_name = null;
      }

      this.deliveryProducts.splice(deliveryProductIndex, 1, item);
    },

    /**
     * 옵션 이미지 업로드
     * @param e
     * @param deliveryProductIndex
     */
    uploadOptionImage(e, deliveryProductIndex) {
      if (e.target.files.length > 0) {
        const imageFile = e.target.files[0];
        if (this.maxFileSize > imageFile.size) {
          const item = this.deliveryProducts[deliveryProductIndex];
          item.option_image.file = imageFile;
          item.option_image.dataUrl = window.URL.createObjectURL(imageFile);
          this.deliveryProducts.splice(deliveryProductIndex, 1, item);
        } else {
          this.$popup.showAlertPopup('이미지 용량이 10MB를 초과합니다.\n이미지를 다시 등록해주세요.');
        }
      }
    },
    deleteOptionImage(deliveryProductIndex) {
      const item = this.deliveryProducts[deliveryProductIndex];
      item.option_image.file = null;
      item.option_image.dataUrl = null;
      this.deliveryProducts.splice(deliveryProductIndex, 1, item);
      document.getElementById(`option_image_file_${deliveryProductIndex}`).value = '';
    },
    updateOptionImage(deliveryProductIndex) {
      document.getElementById(`option_image_file_${deliveryProductIndex}`).click();
    },

    /**
     * 총 수량, 금액 계산
     */
    calcTotalPrice() {
      let totalAmount = 0;
      const totalPrices = {};
      this.deliveryProducts.forEach((deliveryPrice) => {
        if (deliveryPrice.amount) totalAmount += Number(deliveryPrice.amount);
        if (deliveryPrice.amount && deliveryPrice.currency_unit && deliveryPrice.price) {
          if (!totalPrices[deliveryPrice.currency_unit.iso]) {
            totalPrices[deliveryPrice.currency_unit.iso] = 0;
          }
          totalPrices[deliveryPrice.currency_unit.iso] += (Number(deliveryPrice.amount) * Number(deliveryPrice.price));
        }
      });
      this.totalAmount = totalAmount;
      this.totalPrices = totalPrices;
    },

    /**
     * 이름 번역하기
     */
    translateName() {
      if (!this.deliveryRequest.kor_name) return this.$popup.showAlertPopup('받는 사람 성명을 입력해주세요.');
      this.$createLoading(async () => {
        const res = await this.$store.dispatch(`${prefixAmazic9}/translate`, { text: this.deliveryRequest.kor_name });
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
        this.deliveryRequest.eng_name = res.data.translated_text;
      });
    },

    /**
     * 배송대행 신청
     */
    async requestDelivery() {
      const deliveryRequest = this.deliveryRequest;
      const deliveryProducts = this.makeDeliveryProductsData();

      const invalidMessage = this.checkRequestData(deliveryRequest, deliveryProducts);
      if (invalidMessage) return this.$popup.showAlertPopup(invalidMessage);

      const formData = new FormData();
      formData.append('target', this.target);
      formData.append('delivery_request', JSON.stringify(deliveryRequest));
      formData.append('delivery_products', JSON.stringify({ delivery_products: deliveryProducts }));
      deliveryProducts.forEach((v, i) => {
        if (v.image) formData.append(`upload_option_image_${i}`, v.image);
      });
      await this.$createLoading(async () => {
        const res = await this.$store.dispatch(`${prefix}/requestDelivery`, formData);
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
        this.$popup.showAlertPopup('신청이 완료되었습니다');
        await this.$router.go(-1);
      });
    },
    makeDeliveryProductsData() {
      const deliveryProducts = [];
      this.deliveryProducts.forEach((item) => {
        const data = {
          order_product_id: item.order_product_id,
          item_id: item.item_id,
          currency_unit_id: item.currency_unit.id,
          order_num: item.order_num,
          tracking_num: item.tracking_num,
          eng_name: item.eng_name,
          price: item.price ? Number(item.price) : 0,
          amount: item.amount ? Number(item.amount) : 0,
          option: item.option,
          url: item.url,
          purchase_place: item.purchase_place,
          option_image_type: item.option_image.type,
          target: item.info.product.target,
        };
        if (item.option_image.type === 'select' && item.selected_option_image) {
          data.image_url = item.selected_option_image.image;
        } else {
          data.image = item.option_image.file;
        }
        deliveryProducts.push(data);
      });
      return deliveryProducts;
    },
    checkRequestData(deliveryRequest, deliveryProducts) {
      const regEnglish = /^[a-zA-Z0-9\s~\-!@#$%^&*()_+|<>?:{}]*$/;
      const regNumber = /^[0-9]*$/;
      const regUrl = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

      // delivery_request
      if (!deliveryRequest.kor_name) return '수령인 성명을 입력해주세요.';
      if (!deliveryRequest.eng_name) return '수령인 영문이름을 입력해주세요';
      if (!regEnglish.test(deliveryRequest.eng_name)) return '수령인 영문이름은 영어만 입력할 수 있습니다';
      if (!deliveryRequest.phone) return '수령인 연락처를 입력해주세요';
      if (!regNumber.test(deliveryRequest.phone)) return '수령인 연락처는 \'-\'없이 숫자만 입력해주세요';
      if (!deliveryRequest.clearance_num) return '수령인 개인통관부호를 입력해주세요';
      if (!deliveryRequest.zipcode) return '수령인 우편번호를 입력해주세요';
      if (!deliveryRequest.address) return '수령인 주소를 입력해주세요';
      if (!deliveryRequest.detail_address) return '수령인 상세주소를 입력해주세요';

      // delivery_products
      for (let i = 0; i < deliveryProducts.length; i += 1) {
        const item = deliveryProducts[i];
        console.log(item.target);
        if (item.target !== 'PDD' && item.target !== 'TAOBAO' && !item.order_num) return '해외주문번호를 입력해주세요';
        // if (item.target !== 'PDD' && !item.order_num) return '해외주문번호를 입력해주세요';
        if (!item.item_id) return '품목을 선택해주세요';
        if (!item.eng_name) return '제품명을 입력해주세요';
        if (!regEnglish.test(item.eng_name)) return '제품명은 영문만 입력할 수 있습니다';
        if (!item.option) return '옵션을 입력해주세요';
        if (!item.purchase_place) return '구매처를 입력해주세요';
        if (!regEnglish.test(item.purchase_place)) return '구매처는 영문만 입력할 수 있습니다';
        if (!item.amount || item.amount <= 0) return '수량을 입력해주세요';
        if (!item.price || item.price <= 0) return '단가를 입력해주세요';
        if (!item.currency_unit_id) return '단가의 단위를 선택해주세요';
        if (item.option_image_type === 'select' && !item.image_url) return '옵션 이미지를 선택해주세요';
        if (item.option_image_type === 'upload' && !item.image) return '옵션 이미지를 업로드해주세요';
        if (item.target !== 'PDD' && item.target !== 'TAOBAO' && !item.tracking_num) return '해외트래킹넘버를 입력해주세요';
        if (!item.url) return '해외제품 URL을 입력해주세요';
        if (!regUrl.test(item.url)) return 'URL 주소를 올바르게 입력해주세요.(Ex: http://www.google.com)';
      }

      if (!deliveryRequest.delivery_type) return '배송유형을 선택해주세요';

      if (!this.termsAgree) return '이용약관에 동의해주세요';
    },
  },
};
