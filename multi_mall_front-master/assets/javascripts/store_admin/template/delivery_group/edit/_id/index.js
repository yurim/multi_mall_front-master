import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/template/delivery_group/edit/_id';

export default {
  data: () => ({
    countryMountainAddressList: [],
    isMountainAreaSetting: false,
    country_mountain_delivery: [],
    mountainArea: null,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getDeliveryGroup`, params.id);
  },
  computed: {
    ...mapGetters({
      deliveryGroup: `${prefix}/deliveryGroup`,
      result: `${prefix}/result`,
    }),
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (this.deliveryGroup.country_mountain_deliveries && this.deliveryGroup.country_mountain_deliveries.length > 0) {
        this.isMountainAreaSetting = true;
        this.country_mountain_delivery = this.deliveryGroup.country_mountain_deliveries;
        this.mountainArea = this.deliveryGroup.area_num;
      }
      if (this.deliveryGroup.area_num === '') {
        this.deliveryGroup.area_num = null;
      }
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
        this.deliveryGroup.area_num = 2;
        this.country_mountain_delivery.push({ area_type: areaType, additional_price: '' });
      } else {
        this.deliveryGroup.area_num = 3;
        const areaTypes = areaType.split('-');
        this.country_mountain_delivery.push({ area_type: areaTypes[0], additional_price: '' });
        this.country_mountain_delivery.push({ area_type: areaTypes[1], additional_price: '' });
      }
    },
    async patchDeliveryGroup() {
      const isEmptyList = [];

      if (!this.deliveryGroup.name) isEmptyList.push('템플릿명');
      if (this.isMountainAreaSetting) {
        if (!this.deliveryGroup.area_num) {
          isEmptyList.push('배송권역');
        } else if (this.country_mountain_delivery.length === 0) {
          isEmptyList.push('제주/도서산간 추가 배송비');
        } else {
          let isPrice = false;
          this.country_mountain_delivery.forEach((item) => {
            if (!item.additional_price) isPrice = true;
          });
          if (isPrice) isEmptyList.push(`${this.deliveryGroup.area_num}권역 추가 배송비`);
        }
      }

      if (isEmptyList.length > 0) return this.popupAlert(`다음 필수 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);

      this.deliveryGroup.is_country_mountain = this.isMountainAreaSetting;

      const data = { delivery_group: this.deliveryGroup, country_mountain_delivery: this.country_mountain_delivery };
      const res = await this.$store.dispatch(`${prefix}/patchDeliveryGroup`, data);
      if (res.result === 'success') {
        this.popupAlert('수정완료 되었습니다.');
        this.$router.push(`/store_admin/template/delivery_group/${this.deliveryGroup.id}`);
      } else {
        this.popupAlert(res.message);
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
