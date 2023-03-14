import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/store/_id';

export default {
  data: () => ({
    loading: false,
    store_state_type: [],
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getStore`, params.id);
    await store.dispatch('common/getCodes', ['store_state_type', 'age_target']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      store: `${prefix}/store`,
      result: `${prefix}/result`,
    }),
    ageTargetStr() {
      return this.store.age_target_codes
        .filter((v) => v.is_checked)
        .map((v) => v.name)
        .join(', ');
    },
  },
  created() {
    this.store_state_type = this.codesArray('store_state_type');
  },
  methods: {
    async getStore() {
      this.loading = true;
      const params = this.$route.params;
      await this.$store.dispatch(`${prefix}/getStore`, params.id);
      this.loading = false;
    },
    checkAccept() {
      const isEmptyList = [];

      // 매장
      if (!this.store.name_kor) isEmptyList.push('매장명');
      if (!this.store.store_type) isEmptyList.push('매장 형태');
      if (!this.store.zipcode) isEmptyList.push('매장 주소 - 우편번호');
      if (!this.store.address) isEmptyList.push('매장 주소 - 주소');
      if (!this.store.cs_phone) isEmptyList.push('고객센터 연락처');
      if (this.store.represent_categories_list.length === 0) isEmptyList.push('대표 상품군');
      if (this.store.age_target_codes.length === 0) isEmptyList.push('타겟 연령층');
      if (!this.store.profile) isEmptyList.push('매장 프로필 이미지');
      if (!this.store.store_admin_name) isEmptyList.push('담당자명');
      if (!this.store.store_admin_phone) isEmptyList.push('담당자연락처');
      if (!this.store.store_return_exchange_address.zipcode) isEmptyList.push('반품교환지 - 우편번호');
      if (!this.store.store_return_exchange_address.address) isEmptyList.push('반품교환지 - 주소');
      if (!this.store.store_return_exchange_address.delivery_company) isEmptyList.push('반품교환 택배사');
      if (!this.store.store_business_info.ceo_name) isEmptyList.push('대표자명');
      if (!this.store.store_business_info.company_name) isEmptyList.push('상호명');
      if (!this.store.store_business_info.license_num) isEmptyList.push('사업자 등록번호');
      if (!this.store.store_business_info.sale_num) isEmptyList.push('통신판매 신고번호');
      if (!this.store.license_url) isEmptyList.push('사업자등록증');
      if (!this.store.sale_url) isEmptyList.push('통신판매업 신고증');
      if (!this.store.store_balance_account_info.bank_name) isEmptyList.push('정산정보 - 은행명');
      if (!this.store.store_balance_account_info.holder_name) isEmptyList.push('정산정보 - 예금주명');
      if (!this.store.store_balance_account_info.account) isEmptyList.push('정산정보 - 계좌번호');
      if (!this.store.store_balance_account_info.commission_rate) isEmptyList.push('정산정보 - 수수료율');

      let isValid = true;
      if (isEmptyList.length > 0) {
        this.$popup.showAlertPopup(`필수항목을 모두 입력 후 입점 승인이 가능합니다. \n${isEmptyList.join('\n')}`);
        isValid = false;
      }

      return isValid;
    },
    patchStoreStateType(type) {
      if (this.store.store_state_type === '입점요청') { // 입점요청상태
        if (!this.checkAccept()) return;
        if (type === 'NORMAL') this.popupShow(type, '해당 업체를 입점 승인하시겠습니까?', 'accept', true); // 입점승인
        if (type === 'ENTR_RJCT') this.popupShow(type, '해당업체를 입점 거부하시겠습니까?', 'reject'); // 입점거부
      } else if (this.store.store_state_type === '입점 거부') { // 입점거부상태
        if (type === 'NORMAL') this.popupShow(type, '해당업체 입점상태를 승인으로 변경하시겠습니까?', 'accept'); // 입점거부상태 -> 입점승인
      } else if (this.store.store_state_type === '정상') { // 정상 상태
        if (type === 'LEAVED') this.popupShow(type, '해당업체를 퇴점 처리하시겠습니까?', 'leave'); // 퇴점처리
        if (type === 'BLOCKED') this.popupShow(type, '해당업체를 제재하시겠습니까?', 'block'); // 매장 제재 처리
      } else if (this.store.store_state_type === '매장 제재') { // 매장제재 상태
        if (type === 'NORMAL') this.popupShow(type, '해당업체의 제재를 해제하시겠습니까?', 'unblock'); // 매장제재 해제
      } else if (this.store.store_state_type === '퇴점 요청') { // 퇴점요청 상태
        if (type === 'LEAVED') this.popupShow(type, '해당업체를 퇴점 처리하시겠습니까?', 'leave'); // 퇴점 완료
      }
    },
    getStoreStateTypeString(ssh) {
      let str = '';
      if (ssh.before_store_state_type) {
        str += this.store_state_type.find((v) => v.key === ssh.before_store_state_type).value;
        str += ' -> ';
      }
      str += this.store_state_type.find((v) => v.key === ssh.store_state_type).value;
      return str;
    },
    popupShow(type, message, apiType, reasonSkip) {
      const data = {
        id: this.store.id,
        store_state_type: type,
        api_type: apiType,
        reason: '',
      };
      if (reasonSkip) {
        this.popupConfirm(message, data);
      } else {
        this.popupReason(message, data);
      }
    },
    popupConfirm(message, data) {
      new this.$popup.Confirm({
        propsData: {
          title: message,
          okCallback: async (params) => {
            await this.$store.dispatch(`${prefix}/patchStoreState`, data);
            if (this.result.result === 'success') {
              this.popupAlert('성공적으로 상태변경이 완료되었습니다.');
              this.getStore();
            } else this.popupAlert(this.result.message);
            params.$destroy();
          },
        },
      }).$mount();
    },
    popupReason(message, data) {
      const that = this;
      new Popup.Reason({
        propsData: {
          title: message,
          okCallback: async (params) => {
            data.reason = params.reason;
            await that.$store.dispatch(`${prefix}/patchStoreState`, data);
            if (that.result.result === 'success') {
              that.popupAlert('성공적으로 상태변경이 완료되었습니다.');
              that.getStore();
            } else that.popupAlert(that.result.message);
            params.$destroy();
          },
        },
      }).$mount();
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
