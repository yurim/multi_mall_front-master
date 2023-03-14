import { mapGetters } from 'vuex';

import _ from 'lodash';

const prefix = 'store_admin/crawling/_id';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '상품명(중복상품 여부)', value: '', sortable: false },
      { text: '상품이미지', value: '', sortable: false },
      { text: '표시원가(원가)', value: '', sortable: false },
      { text: '표시할인가(할인가)', value: '', sortable: false },
      { text: '옵션', value: '', sortable: false },
      { text: '게시 실패 사유', value: '', sortable: false },
    ],
    // category
    copiedItems: [],
    selectedCategories: [''],

    tempExtraPriceType: 'rate',
    tempExchangeRate: null,
    tempExtraPriceRate: null,
    tempExtraPriceNumber: null,
    tempAdditionalPriceType: 'rate',
    tempAdditionalPriceRate: null,
    tempAdditionalPriceNumber: null,
    tempIsMinusAdditionalPrice: false,
    tempIsPriceToDiscount: false,
    tempSurchargeRate: null,

    isCalcPrice: false,

    // form
    isSale: true,
    isListed: true,
    exchangeRate: null,
    extraPriceType: 'rate',
    extraPriceRate: null,
    extraPriceNumber: null,
    isChangeMainImage: false,
    canPriceGroup: false,
    additionalPriceType: 'exchange_rate',
    additionalPriceRate: null,
    additionalPriceNumber: null,
    isMinusAdditionalPrice: false,
    isPriceToDiscount: false,
    surchargeRate: null,
    isDuplicated: false,
    isChangeProductName: false,
    isIncludedImage: false,
    selectedDeliveryInfo: '',
    selectedProductNoticeTemplate: '',
    selectedDeliveryNoticeTemplate: '',
    selectedExchangeReturnTemplate: '',
    selectedABRDProductTopNoticeTemplate: '',
    selectedABRDProductBtmNoticeTemplate: '',
    prefixProductName: '',
    suffixProductName: '',
  }),
  async fetch({ store, params, query }) {
    // get scrap info
    const data = { scrapInfoId: params.id, query };
    await store.dispatch(`${prefix}/getScrapInfo`, data);

    // get categories
    await store.dispatch(`${prefix}/getCategories`);
    await store.dispatch(`${prefix}/getDeliveryInfo`);

    // get templates
    await store.dispatch(`${prefix}/getTemplates`);
  },
  computed: {
    ...mapGetters({
      scrapInfo: `${prefix}/scrapInfo`,
      tempProducts: `${prefix}/tempProducts`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      categories: `${prefix}/categories`,
      deliveryInfo: `${prefix}/deliveryInfo`,
      templates: `${prefix}/templates`,
    }),
  },
  watch: {
    tempExchangeRate() { this.isCalcPrice = false; },
    tempExtraPriceType() { this.isCalcPrice = false; },
    tempExtraPriceRate() { this.isCalcPrice = false; },
    tempExtraPriceNumber() { this.isCalcPrice = false; },
    tempAdditionalPriceType() { this.isCalcPrice = false; },
    tempAdditionalPriceRate() { this.isCalcPrice = false; },
    tempAdditionalPriceNumber() { this.isCalcPrice = false; },
    tempIsMinusAdditionalPrice() { this.isCalcPrice = false; },
    tempIsPriceToDiscount() { this.isCalcPrice = false; },
    tempSurchargeRate() { this.isCalcPrice = false; },
  },
  created() {
    // init fist category
    this.copiedItems.push(this.categories);
  },
  async mounted() {
    await this.initOptions();
    await this.initAbroadTemplate();
  },
  methods: {
    async refresh() {
      const params = this.$route.params;
      const query = { ...this.$route.query };
      const data = { scrapInfoId: params.id, query };
      await this.getData(data);
      await this.initOptions();
    },
    async getData(data) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getScrapInfo`, data);
      this.loading = false;
    },
    async initOptions() {
      _.forEach(this.tempProducts, (tempProduct, index) => {
        tempProduct.optionNameMap = _.keyBy(tempProduct.product_options, 'option.name');
        tempProduct.optionNameList = _.keys(tempProduct.optionNameMap);

        const productOptionMap = _.keyBy(tempProduct.product_options, 'id');

        let maxOptionPrice = 0;
        const compoundOptionMapList = [];
        _.forEach(tempProduct.product_compound_options, (pco) => {
          const compoundOptionMap = {};
          _.forEach(pco.product_option_ids, (id) => {
            const option = productOptionMap[id];
            compoundOptionMap[option.option.name] = option;
          });
          compoundOptionMap.additional_price = pco.additional_price;
          maxOptionPrice = (maxOptionPrice < compoundOptionMap.additional_price)
            ? compoundOptionMap.additional_price : maxOptionPrice;
          compoundOptionMapList.push(compoundOptionMap);
        });

        tempProduct.compoundOptionMapList = compoundOptionMapList;
        tempProduct.maxOptionPrice = maxOptionPrice;

        this.tempProducts.splice(index, 1, tempProduct);
      });
    },
    initAbroadTemplate() {
      if (this.templates.ABRD_PRDCT_TOP_NTC && this.templates.ABRD_PRDCT_TOP_NTC.length > 0) {
        this.selectedABRDProductTopNoticeTemplate = this.templates.ABRD_PRDCT_TOP_NTC[0];
      }
      if (this.templates.ABRD_PRDCT_BTM_NTC && this.templates.ABRD_PRDCT_BTM_NTC.length > 0) {
        this.selectedABRDProductBtmNoticeTemplate = this.templates.ABRD_PRDCT_BTM_NTC[0];
      }
    },
    getOptionName(option) {
      return (option.represent_option && option.represent_option.name) ? option.represent_option.name : option.name;
    },
    async selectedCategory(index) {
      const startCount = Number(index) + 1;
      const deleteCount = this.copiedItems.length - startCount;

      // clear childes
      this.copiedItems.splice(startCount, deleteCount);
      this.selectedCategories.splice(startCount, deleteCount);

      // get child categories
      const currCategory = this.selectedCategories[index];
      if (currCategory === '') return;
      if (currCategory.name.indexOf('전체') === -1) {
        const query = { _id: currCategory._id };
        const res = await this.$store.dispatch(`${prefix}/getCategories`, query);
        if (res.data.categories.length > 0) {
          const categoryList = res.data.categories;
          await this.copiedItems.splice(startCount, 1, categoryList);
          await this.selectedCategories.splice(startCount, 1, '');
        }
      }
    },

    /**
     * 상품 금액 계산
     * @param type 추가금액 설정 타입
     * @param rate 추가금액 배율
     * @param number 추가금액 특정금액
     * @param price 상품금액 / 옵션금액
     * @returns {string|number}
     */
    calcExtraPrice(type, rate, number, price) {
      let result = 0;
      if (type === 'rate') {
        const tempRate = 1 + rate / 100;
        result = (price * this.exchangeRate * tempRate);
      } else if (type === 'number') {
        result = Number(price * this.exchangeRate) + Number(number);
      } else if (type === 'compound') {
        const tempRate = 1 + rate / 100;
        result = Number(price * this.exchangeRate * tempRate) + Number(number);
      }
      return result;
    },
    getProductPrice(type, productPrice, maxOptionPrice) {
      const isNotDiscount = (!productPrice.discount_price || productPrice.discount_price === '' || productPrice.discount_price <= 0);
      let price = productPrice[type];
      if (this.isPriceToDiscount && isNotDiscount) { // 할인가 없는 경우 원가로 할인가 표시
        price = productPrice.price;
      }
      if (!price) return '-';
      let result = this.calcExtraPrice(this.extraPriceType, this.extraPriceRate, this.extraPriceNumber, price);
      if (result === 0) return '-';

      if (this.isMinusAdditionalPrice) { // 마이너스 옵션값으로 적용
        const calcMaxOptionPrice = this.calcExtraPrice(this.additionalPriceType, this.additionalPriceRate, this.additionalPriceNumber, maxOptionPrice);
        result += calcMaxOptionPrice;
      }

      result = Math.ceil(result / 10) * 10;

      if (this.isPriceToDiscount && isNotDiscount && type === 'price') { // 할인가 없는 경우 원가로 할인가 표시
        result *= this.surchargeRate;
      }
      return result;
    },
    getOptionPrice(price, maxOptionPrice) {
      let result = 0;
      if (!price) price = 0;
      result = this.calcExtraPrice(this.additionalPriceType, this.additionalPriceRate, this.additionalPriceNumber, price);
      if (this.isMinusAdditionalPrice) { // 마이너스 옵션값으로 적용
        const calcMaxOptionPrice = this.calcExtraPrice(this.additionalPriceType, this.additionalPriceRate, this.additionalPriceNumber, maxOptionPrice);
        result -= calcMaxOptionPrice;
      }
      return result === 0 ? '-' : Math.ceil(result / 10) * 10;
    },

    /**
     * 옵션추가금액 설명 팝업
     */
    showAddPriceTypeInfoPopup() {
      this.popupAlert('옵션 추가금액 설정 설명\n환율만 적용: 상품 추가금액을 제외한 환율만 옵션 추가금액에 적용\n모두 적용: 환율 및 상품 추가금액이 모두 적용');
    },

    /**
     * 상품명 가공 처리 설명 팝업
     */
    showChangeProductNameInfoPopup() {
      this.popupAlert('상품명 가공 처리 체크시 다음 순서에 의해 상품명이 변경됩니다.\n'
        + '1. 상품 게시할 카테고리 명\n'
        + '2. 번역된 제품명의 첫번째, 두번째 단어\n'
        + '3. 첫번째 옵션 명\n'
        + 'ex) 카테고리명 제품명첫번째단어 제품명두번째단어 첫번째옵션명');
    },

    /**
     * 배송비 템플릿 상세보기 팝업
     */
    async showDeliveryInfoPopup() {
      const deliveryInfo = this.selectedDeliveryInfo;
      if (deliveryInfo === '') {
        return this.popupAlert('배송비를 선택해 주세요.');
      }

      const res = await this.$store.dispatch(`${prefix}/getDeliveryInfoDetail`, deliveryInfo.id);
      if (res.data.deliveryInfo) {
        new this.$popup.DeliveryTemplate({
          propsData: {
            deliveryInfo: res.data.deliveryInfo,
            okCallback: async (params) => params.$destroy(),
          },
        }).$mount();
      }
    },

    /**
     * 판매가 적용
     */
    applyExtraPrice() {
      if (!this.tempExchangeRate) return this.popupAlert('환율을 입력해주세요');
      if (this.tempExtraPriceType === 'rate' && !this.tempExtraPriceRate) return this.$popup.showAlertPopup('상품추가금액의 배율을 입력해주세요');
      if (this.tempExtraPriceType === 'number' && !this.tempExtraPriceNumber) return this.$popup.showAlertPopup('상품추가금액의 특정금액을 입력해주세요');
      if (this.tempExtraPriceType === 'compound' && !(this.tempExtraPriceRate && this.tempExtraPriceNumber)) return this.$popup.showAlertPopup('상품추가금액의 배율과 특정금액을 입력해주세요');
      if (this.tempAdditionalPriceType === 'rate' && !this.tempAdditionalPriceRate) return this.$popup.showAlertPopup('옵션추가금액의 배율을 입력해주세요');
      if (this.tempAdditionalPriceType === 'number' && !this.tempAdditionalPriceNumber) return this.$popup.showAlertPopup('옵션추가금액의 특정금액을 입력해주세요');
      if (this.tempAdditionalPriceType === 'compound' && !(this.tempAdditionalPriceRate && this.tempAdditionalPriceNumber)) return this.$popup.showAlertPopup('옵션추가금액의 배율과 특정금액을 입력해주세요');
      if (this.tempIsPriceToDiscount && !this.tempSurchargeRate) return this.$popup.showAlertPopup('원가로 할인가 표시 선택 시 원가의 배수를 입력해주세요');

      this.exchangeRate = this.tempExchangeRate;
      this.extraPriceType = this.tempExtraPriceType;
      this.extraPriceRate = this.tempExtraPriceRate;
      this.extraPriceNumber = this.tempExtraPriceNumber;
      this.additionalPriceType = this.tempAdditionalPriceType;
      this.additionalPriceRate = this.tempAdditionalPriceRate;
      this.additionalPriceNumber = this.tempAdditionalPriceNumber;
      this.isMinusAdditionalPrice = this.tempIsMinusAdditionalPrice;
      this.isPriceToDiscount = this.tempIsPriceToDiscount;
      this.surchargeRate = this.tempSurchargeRate;

      this.isCalcPrice = true;
    },

    checkTransfer() {
      if (!this.selectedCategories) return this.popupAlert('카테고리를 선택해주세요');
      let lastCategory = null;
      this.selectedCategories.forEach((v) => {
        if (v && !v.hasChild) lastCategory = v;
      });
      if (!lastCategory) return this.popupAlert('카테고리를 선택해주세요');

      if (!this.isCalcPrice) return this.popupAlert('판매가를 적용해주세요');
      if (!this.exchangeRate) return this.popupAlert('환율을 입력해주세요');
      if (this.extraPriceType === 'rate' && !this.extraPriceRate) return this.popupAlert('배율을 입력해주세요');
      if (this.extraPriceType === 'number' && !this.extraPriceNumber) return this.popupAlert('특정금액을 입력해주세요');
      if (this.extraPriceType === 'compound' && !(this.extraPriceRate && this.extraPriceNumber)) return this.popupAlert('배율과 특정금액을 입력해주세요');
      if (this.isPriceToDiscount && !this.surchargeRate) return this.$popup.showAlertPopup('원가로 할인가 표시 선택 시 원가의 배수를 입력해주세요');

      if (!this.selectedDeliveryInfo) return this.popupAlert('배송비를 선택해주세요');
      if (!this.selectedProductNoticeTemplate) return this.popupAlert('상품정보고시를 선택해주세요');
      if (!this.selectedDeliveryNoticeTemplate) return this.popupAlert('배송정보고시를 선택해주세요');
      if (!this.selectedExchangeReturnTemplate) return this.popupAlert('교환/반품을 선택해주세요');
      if (!this.selectedABRDProductTopNoticeTemplate) return this.popupAlert('해외상품정보고시(상단)을 선택해주세요');
      if (!this.selectedABRDProductBtmNoticeTemplate) return this.popupAlert('해외상품정보고시(하단)을 선택해주세요');
      return true;
    },

    setData() {
      let lastCategory = null;
      this.selectedCategories.forEach((v) => {
        if (v && !v.hasChild) lastCategory = v;
      });
      return {
        scrap_info_id: this.scrapInfo._id,
        category_id: lastCategory._id,
        is_sale: this.isSale,
        is_listed: this.isListed,
        exchange_rate: Number(this.exchangeRate),
        extra_price_type: this.extraPriceType,
        extra_price_rate: Number(this.extraPriceRate),
        extra_price_number: Number(this.extraPriceNumber),
        additional_price_type: this.additionalPriceType,
        additional_price_rate: Number(this.additionalPriceRate),
        additional_price_number: Number(this.additionalPriceNumber),
        is_minus_additional_price: this.isMinusAdditionalPrice,
        is_price_to_discount: this.isPriceToDiscount,
        surcharge_rate: this.surchargeRate,
        can_price_group: this.canPriceGroup,
        is_change_main_image: this.isChangeMainImage,
        delivery_info_id: this.selectedDeliveryInfo.id,
        product_notice_template_id: this.selectedProductNoticeTemplate.id,
        delivery_notice_template_id: this.selectedDeliveryNoticeTemplate.id,
        exchange_return_template_id: this.selectedExchangeReturnTemplate.id,
        abroad_product_top_notice_id: this.selectedABRDProductTopNoticeTemplate.id,
        abroad_product_bottom_notice_id: this.selectedABRDProductBtmNoticeTemplate.id,
        is_duplicated: this.isDuplicated,
        is_change_product_name: this.isChangeProductName,
        is_included_image: this.isIncludedImage,
        prefix_product_name: this.prefixProductName,
        suffix_product_name: this.suffixProductName,
      };
    },

    async btnSelectedTransfer() {
      const products = this.$refs.dataTable.getSelectedItems();
      if (products.length < 1) return this.popupAlert('상품을 선택해주세요');
      const tempProductIds = _.map(products, '_id');
      const check = this.checkTransfer();
      if (check) {
        const data = this.setData();
        data.is_all = false;
        data.temp_product_ids = tempProductIds;

        await this.transferProducts(data);
      }
    },
    async btnAllTransfer() {
      const check = this.checkTransfer();
      if (check) {
        const data = this.setData();
        data.is_all = true;

        await this.transferProducts(data);
      }
    },

    /**
     * 선택 temp_product 삭제
     */
    deleteTempProduct() {
      const products = this.$refs.dataTable.getSelectedItems();
      if (products.length < 1) return this.popupAlert('상품을 선택해주세요');
      const tempProductIds = _.map(products, '_id');

      const that = this;
      const data = {
        scrap_info_id: this.scrapInfo._id,
        temp_product_ids: tempProductIds,
      };
      new this.$popup.Confirm({
        propsData: {
          title: '게시중인 상품이 있으면 함께 제외 됩니다. 제외 하시겠습니까?',
          async okCallback(e) {
            const res = await this.$store.dispatch(`${prefix}/deleteTempProducts`, data);

            if (res.data.result === 'error') {
              this.$popup.showAlertPopup(res.data.message);
            } else {
              await that.refresh();
              e.$destroy();
            }
          },
        },
      }).$mount();
    },

    transferProducts(data) {
      const that = this;
      new this.$popup.Confirm({
        propsData: {
          title: '게시 하시겠습니까?',
          async okCallback(e) {
            const btn = document.getElementById('popup_btn_ok');
            btn.disabled = true;
            const res = await this.$store.dispatch(`${prefix}/transferTempProducts`, data);

            if (res.result === 'success') {
              this.$popup.showAlertPopup('게시 신청이 완료되었습니다.');
              await that.refresh();
            } else {
              this.$popup.showAlertPopup(res.message);
            }

            btn.disabled = false;
            e.$destroy();
          },
        },
      }).$mount();
    },

    moveCrawlingList() {
      this.$router.replace('/store_admin/crawling');
    },

    popupAlert(message) {
      this.$popup.showAlertPopup(message);
    },
  },
};
