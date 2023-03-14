import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/template/delivery_group/new';

export default {
  data: () => ({
    delivery_group: {
      name: '',
      area_num: null,
      is_default: true,
      is_smaller: true,
      is_country_mountain: false,
    },
    country_mountain_delivery: [],
    countryMountainAddressList: [],
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  methods: {
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
        this.delivery_group.area_num = 2;
        this.country_mountain_delivery.push({ area_type: areaType, additional_price: '' });
      } else {
        this.delivery_group.area_num = 3;
        const areaTypes = areaType.split('-');
        this.country_mountain_delivery.push({ area_type: areaTypes[0], additional_price: '' });
        this.country_mountain_delivery.push({ area_type: areaTypes[1], additional_price: '' });
      }
    },
    async createDeliveryGroup() {
      const that = this;
      const isEmptyList = [];

      if (!that.delivery_group.name) isEmptyList.push('템플릿명');
      if (that.delivery_group.is_country_mountain) {
        if (!that.delivery_group.area_num) {
          isEmptyList.push('배송권역');
        } else if (that.country_mountain_delivery.length === 0) {
          isEmptyList.push('제주/도서산간 추가 배송비');
        } else {
          let isPrice = false;
          that.country_mountain_delivery.forEach((item) => {
            if (!item.additional_price) isPrice = true;
          });
          if (isPrice) isEmptyList.push(`${that.delivery_group.area_num}권역 추가 배송비`);
        }
      }

      if (isEmptyList.length === 0) {
        const data = {
          deliveryGroup: that.delivery_group,
          countryMountainDelivery: that.country_mountain_delivery,
        };
        await that.$store.dispatch(`${prefix}/createDeliveryGroup`, data);
        if (that.result.result === 'success') {
          that.popupAlert('묶음배송그룹 템플릿이 성공적으로 등록되었습니다.');
          that.$router.push({ name: 'store_admin-template-delivery_group' });
        } else {
          that.popupAlert(that.result.message);
        }
      } else {
        this.popupAlert(`다음 필수 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
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
