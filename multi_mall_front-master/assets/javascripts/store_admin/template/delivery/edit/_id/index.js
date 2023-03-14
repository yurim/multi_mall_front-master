import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

import _ from 'lodash';

const prefix = 'store_admin/template/delivery/edit/_id';

export default {
  data: () => ({
    deliveryMethod: [],
    deliveryFeeType: [],
    feePayMethod: [],
    deliveryCompany: [],
    country_mountain_delivery: [],
    countryMountainAddressList: [],
    isDeliveryGroup: false,
    isMountainAreaSetting: false,
    params: {},
    mountainArea: null,
    selectedDeliveryGroup: '',
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getDeliveryGroup`);
    await store.dispatch('common/getCodes', [
      'delivery_method',
      'delivery_fee_type',
      'fee_pay_method',
      'delivery_company',
    ]);
    await store.dispatch(`${prefix}/getDeliveryInfo`, params.id);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      delivery_group: `${prefix}/deliveryGroup`,
      delivery_info: `${prefix}/deliveryInfo`,
      delivery_info_for_delivery_group: `${prefix}/deliveryInfoForDeliveryGroup`,
    }),
    isSmaller() {
      if (this.delivery_info.delivery_group_id) {
        let isSetSmaller = false;
        this.delivery_group.forEach((item) => {
          if (String(item.id) === String(this.delivery_info.delivery_group_id)) isSetSmaller = item.is_smaller;
        });
        if (isSetSmaller) return '묶음 그룹에서 가장 작은 배송비로 부과';
        return '묶음 그룹에서 가장 큰 배송비로 부과';
      }
      return '설정안함';
    },
  },
  async created() {
    this.deliveryMethod = this.codesArray('delivery_method');
    this.deliveryFeeType = this.codesArray('delivery_fee_type');
    this.feePayMethod = this.codesArray('fee_pay_method');
    this.deliveryCompany = this.codesArray('delivery_company');

    await this.initData();

    if (this.selectedDeliveryGroup) {
      await this.$store.dispatch(`${prefix}/getDeliveryInfoForDeliveryGroup`, this.selectedDeliveryGroup.id);
    }
  },
  methods: {
    initData() {
      this.isDeliveryGroup = !!(this.delivery_info.delivery_group);
      if (this.delivery_info.country_mountain_deliveries && this.delivery_info.country_mountain_deliveries.length > 0) {
        this.isMountainAreaSetting = true;
        this.country_mountain_delivery = this.delivery_info.country_mountain_deliveries;

        const area2Data = _.find(this.delivery_info.country_mountain_deliveries, { area_type: 'TOTAL' });
        this.mountainArea = area2Data ? 'area-2' : 'area-3';
      }
      if (this.isDeliveryGroup) {
        this.selectedDeliveryGroup = _.find(this.delivery_group, { id: this.delivery_info.delivery_group.id });
      }
    },
    async deleteDeliveryGroup() {
      this.delivery_info.delivery_group_id = '';
      this.selectedDeliveryGroup = '';
      await this.resetSelectDeliveryGroup();
    },
    async resetSelectDeliveryGroup() {
      await this.$store.dispatch(`${prefix}/resetDeliveryInfoForDeliveryGroup`);
      this.delivery_info.delivery_method = '';
      this.delivery_info.fee_pay_method = 'PRPYMNT';
    },
    async setDeliveryGroup() {
      this.delivery_info.delivery_group_id = this.selectedDeliveryGroup.id;
      if (!this.selectedDeliveryGroup) {
        await this.resetSelectDeliveryGroup();
        return;
      }
      await this.$store.dispatch(`${prefix}/getDeliveryInfoForDeliveryGroup`, this.selectedDeliveryGroup.id);
      if (this.delivery_info_for_delivery_group) {
        this.delivery_info.delivery_method = this.delivery_info_for_delivery_group.delivery_method;
        this.delivery_info.fee_pay_method = this.delivery_info_for_delivery_group.fee_pay_method;
      } else {
        await this.resetSelectDeliveryGroup();
      }
    },
    resetDeliveryFeeType() {
      this.delivery_info.default_fee = '';
      this.delivery_info.condition_value = '';
      this.delivery_info.additional_fee = '';
      this.$forceUpdate();
    },
    deleteMountainArea() {
      this.country_mountain_delivery = [];
    },
    async popMountainousArea() {
      if (this.countryMountainAddressList.length === 0) {
        const res = await this.$axios.get('store_admin/cma/');
        this.countryMountainAddressList = res.data.data.country_mountain_address;
      }
      new Popup.MountainousArea({
        propsData: {
          cmaList: this.countryMountainAddressList,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    mountainAreaType(e) {
      const areaType = e.target.id;
      this.country_mountain_delivery = [];
      if (areaType.indexOf('TOTAL') > -1) {
        this.country_mountain_delivery.push({ area_type: areaType, additional_price: '' });
      } else {
        const areaTypes = areaType.split('-');
        this.country_mountain_delivery.push({ area_type: areaTypes[0], additional_price: '' });
        this.country_mountain_delivery.push({ area_type: areaTypes[1], additional_price: '' });
      }
    },
    popAddress(type) {
      const that = this;
      new Popup.Address({
        propsData: {
          okCallback: (params) => {
            that.delivery_info[`${type}_zipcode`] = params.zipcode;
            that.delivery_info[`${type}_address`] = params.address;
            if (params.detailAddress) that.delivery_info[`${type}_detail_address`] += params.detailAddress;
            params.$destroy();
          },
        },
      }).$mount();
    },
    async patchDelivery() {
      const that = this;
      const isEmptyList = [];

      if (Object.keys(that.delivery_info).length > 0) {
        if (!that.delivery_info.delivery_method) isEmptyList.push('배송 방법');
        if (!that.delivery_info.fee_pay_method) isEmptyList.push('배송비 지불방법');
        if (that.isDeliveryGroup && !that.delivery_info.delivery_group_id) isEmptyList.push('묶음배송');
        if (that.isMountainAreaSetting) {
          if (that.country_mountain_delivery.length === 0) {
            isEmptyList.push('제주/도서산간 추가 배송비');
          } else {
            let isEmptyAreaType = false;
            let isEmptyAdditionalPrice = false;
            that.country_mountain_delivery.forEach((item) => {
              if (!item.area_type) isEmptyAreaType = true;
              if (!item.additional_price) isEmptyAdditionalPrice = true;
            });
            if (isEmptyAreaType) isEmptyList.push('배송권역 설정');
            if (isEmptyAdditionalPrice) isEmptyList.push('배송권역 추가배송비');
          }
        }
        if (!that.delivery_info.departure_address) isEmptyList.push('출고지 주소');
        if (!that.delivery_info.departure_detail_address) isEmptyList.push('출고지 상세주소');
        if (!that.delivery_info.departure_zipcode) isEmptyList.push('출고지 우편번호');
        if (!that.delivery_info.delivery_company) isEmptyList.push('반품교환 택배사');
        if (!that.delivery_info.arrival_address) isEmptyList.push('반품/교환지 주소');
        if (!that.delivery_info.arrival_detail_address) isEmptyList.push('반품/교환지 상세주소');
        if (!that.delivery_info.arrival_zipcode) isEmptyList.push('반품/교환지 우편번호');
        if (!that.delivery_info.return_fee) isEmptyList.push('반품배송비(편도)');
        if (!that.delivery_info.exchange_fee) isEmptyList.push('교환배송비(왕복)');
        if (that.delivery_info.delivery_fee_type !== 'FREE' && !that.delivery_info.default_fee) isEmptyList.push('기본 배송비');
        if (that.delivery_info.delivery_fee_type !== 'FREE' && that.delivery_info.delivery_fee_type !== 'CHARGE' && !that.delivery_info.condition_value) isEmptyList.push('배송비 조건');
        if (that.delivery_info.delivery_fee_type === 'AREA' && !that.delivery_info.additional_fee) isEmptyList.push('추가배송비');

        if (!that.delivery_info.default_fee) that.delivery_info.default_fee = 0;
        if (!that.delivery_info.condition_value) that.delivery_info.condition_value = 0;
        if (!that.delivery_info.additional_fee) that.delivery_info.additional_fee = 0;
      } else {
        isEmptyList.push('배송정보');
      }

      if (isEmptyList.length === 0) {
        const data = {
          delivery_info: that.delivery_info,
          country_mountain_delivery: that.country_mountain_delivery,
        };
        const res = await this.$store.dispatch(`${prefix}/patchDelivery`, data);
        if (res.result === 'success') {
          that.popupAlert('수정완료 되었습니다.');
          that.$router.push(`/store_admin/template/delivery/${that.delivery_info.id}`);
        } else {
          that.popupAlert(res.message);
        }
      } else {
        that.popupAlert(`필수 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
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
