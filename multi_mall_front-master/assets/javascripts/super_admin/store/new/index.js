import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import util from '@/assets/javascripts/util';
import _ from 'lodash';

const prefix = 'super_admin/store/new';

export default {
  data: () => ({
    // 공통 코드
    storeTypes: [],
    deliveryCompanies: [],
    linkageTypes: [],
    // 입점매장 정보
    store: {
      url: '',
      store_state_type: 'ENTR_RQSTD',
      name_kor: '',
      name_eng: '',
      is_crawling: false,
      store_type: '',
      has_abroad_product: false,
      zipcode: '',
      address: '',
      detail_address: '',
      cs_phone: '',
      age_start: '',
      age_end: '',
      age_target_codes: [],
      represent_categories_list: [],
      kakao_plus_url: '',
      instagram_id: '',
      sigungu_code: '',
      linkage_auth_list: [],
      is_show: false,
    },
    profile: {},
    selectedCategoryObj: {},
    represent_category_ids: [],
    admin: { email: '', name: '', phone: '', password: '' },
    return_exchange_address: { zipcode: '', address: '', delivery_company: '', detail_address: '' },
    return_exchange_account_info: { bank_name: '', holder_name: '', account: '' },
    business_info: { ceo_name: '', company_name: '', license_num: '', sale_num: '' },
    balance_account_info: { bank_name: '', holder_name: '', account: '', commission_rate: 10 },
    license: {},
    sale: {},
    // etc.
    categories_list: [],
    selectCategory: [],
    profileURL: '',
    licenseURL: '',
    saleURL: '',
    agency_auth_info: {
      agency_selectable: false,
      st11_linkable: false,
      st11_api_key: '',
    },
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getCategories`);
    await store.dispatch('common/getCodes', ['delivery_company', 'store_type', 'age_target', 'linkage_type']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      categories: `${prefix}/categories`,
      result: `${prefix}/result`,
    }),
  },
  async created() {
    this.deliveryCompanies = this.codesArray('delivery_company');
    this.storeTypes = this.codesArray('store_type');
    const linkageTypeList = this.codesArray('linkage_type');
    linkageTypeList.forEach((v) => {
      this.linkageTypes.push({
        linkage_type: v.key,
        linkage_name: v.value,
        is_selected: false,
        api_key: null,
        is_allowed_all_ip: true,
        white_list_ips: [''],
      });
    });

    let ageTargets = Array.prototype.reduce.call(this.codesArray('age_target'), (list, data) => {
      if (!Number.isNaN(Number(data.key))) data.key = Number(data.key);
      list.push(data);
      return list;
    }, []);
    ageTargets = Array.prototype.sort.call(ageTargets, (prev, next) => {
      if (prev.key < next.key) return -1;
      if (prev.value < next.value) return 1;
      if (prev.key > next.key) return 1;
      if (prev.value > next.value) return -1;
      return 0;
    });
    this.store.age_target_codes = ageTargets.reduce((list, item, i) => {
      list.push({ is_checked: false, code: item.key, name: item.value, order: i });
      return list;
    }, []);
    this.categories_list.push(this.categories);
    if (!this.store.linkage_auth_list) this.store.linkage_auth_list = [];
  },
  methods: {
    isUrl() {
      if (!this.store.url) this.isCrawling();
    },
    isCrawling(e) {
      if (e) this.store.is_crawling = e.target.checked;
      if (!this.store.url && this.store.is_crawling) {
        this.popupAlert('크롤링 연동에 필요한 쇼핑몰 주소가 필요합니다.');
        this.store.is_crawling = false;
      }
    },
    postCode(e) {
      const id = e.target.id;

      util.showSearchAddress((data) => {
        this[`${id}`].zipcode = data.zonecode;
        this[`${id}`].address = data.address;
        if (id === 'store') this.store.sigungu_code = data.sigungu_code;
      });
    },
    setAddress(target) {
      document.getElementById(target).click();
    },
    async selectedCategories(e) {
      const id = e.target.id;
      const startCount = Number(e.target.id) + 1;
      const deleteCount = this.categories_list.length - startCount;

      this.categories_list.splice(startCount, deleteCount);

      if (e.target.value) {
        const query = {};
        query._id = e.target.value;
        const res = await this.$store.dispatch(`${prefix}/getCategories`, query);
        if (res.data.categories.length > 0) this.categories_list.push(res.data.categories);
      }
      const element = document.getElementById(id);
      const name = element[element.selectedIndex].getAttribute('name');
      const _id = e.target.value;

      if (id === '0') this.selectedCategoryObj = {};
      if (name && _id) this.selectedCategoryObj[id] = { _id, name };
    },
    addCategoryGroup() {
      const that = this;
      if (Object.keys(that.selectedCategoryObj).length > 0) {
        if (that.store.represent_categories_list.length < 5) {
          that.store.represent_categories_list.push(Object.values(that.selectedCategoryObj));
          document.getElementById('0').options[0].selected = true;
          that.categories_list.splice(1, 4);
          that.selectedCategoryObj = {};
        } else {
          this.$popup.showAlertPopup('최대 5개까지 추가할 수 있습니다.');
        }
      } else {
        this.$popup.showAlertPopup('카테고리를 추가해주세요.');
      }
    },
    deleteCategory(idx) {
      this.store.represent_categories_list.splice(idx, 1);
    },
    imageUpload(e) {
      const that = this;
      const id = e.target.id;
      const imageFile = e.target.files[0];
      const recommendSize = (10 * 1024 * 1024);

      if (recommendSize > imageFile.size) {
        that[id] = imageFile;
        that[`${id}URL`] = window.URL.createObjectURL(imageFile);
      } else {
        this.popupAlert('이미지 용량이 10MB를 초과합니다.');
      }
    },
    deleteImage(target) {
      this[target] = {};
      this[`${target}URL`] = '';
      document.getElementById(target).value = '';
    },
    setTarget() {
      const ageTargetList = [];
      this.store.age_target_codes.forEach((data) => {
        if (data.is_checked) ageTargetList.push(data);
      });

      this.store.age_start = this.store.age_target_codes[0].code;
      this.store.age_end = this.store.age_target_codes[this.store.age_target_codes.length - 1].code;
    },
    async createStore() {
      const isEmptyList = [];
      const that = this;

      // 매장
      if (!that.store.name_kor) isEmptyList.push('매장명');
      // if (!that.store.name_eng) isEmptyList.push('매장명(영문)');
      if (!that.store.store_type) isEmptyList.push('매장 형태');
      if (!that.store.zipcode) isEmptyList.push('매장 주소 - 우편번호');
      if (!that.store.address) isEmptyList.push('매장 주소 - 주소');
      if (!that.profile) isEmptyList.push('매장 프로필');
      if (!that.store.cs_phone) isEmptyList.push('고객센터 연락처');
      if (this.store.age_target_codes.legnth === 0) isEmptyList.push('타겟 연령층');

      // 대표 상품군
      if (that.store.represent_categories_list.length === 0) isEmptyList.push('대표 상품군');

      // 담당자
      if (!that.admin.email) isEmptyList.push('어드민 아이디(이메일)');
      if (!that.admin.password) isEmptyList.push('어드민 비밀번호');
      if (!that.admin.name) isEmptyList.push('담당자명');
      if (!that.admin.phone) isEmptyList.push('담당자연락처');

      // 반품 교환 배송
      if (!that.return_exchange_address.zipcode) isEmptyList.push('반품교환지 - 우편번호');
      if (!that.return_exchange_address.address) isEmptyList.push('반품교환지 - 주소');
      if (!that.return_exchange_address.delivery_company) isEmptyList.push('반품교환 택배사');

      // 반품비용 수령 계좌
      if (!that.return_exchange_account_info.bank_name) isEmptyList.push('반품비용 수령 계좌 - 은행명');
      if (!that.return_exchange_account_info.holder_name) isEmptyList.push('반품비용 수령 계좌 - 예금주명');
      if (!that.return_exchange_account_info.account) isEmptyList.push('반품비용 수령 계좌 - 계좌번호');

      // 사업자
      if (!that.business_info.ceo_name) isEmptyList.push('대표자명');
      if (!that.business_info.company_name) isEmptyList.push('상호명');
      if (!that.business_info.license_num) isEmptyList.push('사업자 등록번호');
      if (!that.business_info.sale_num) isEmptyList.push('통신판매 신고번호');
      if (!that.license) isEmptyList.push('사업자등록증');
      if (!that.sale) isEmptyList.push('통신판매업 신고증');

      // 구매/배송대행 권한
      if (that.agency_auth_info.agency_selectable && that.agency_auth_info.st11_linkable) {
        if (!that.agency_auth_info.st11_api_key) isEmptyList.push('11번가 연동 API KEY');
      }

      // 연동 권한
      that.store.linkage_auth_list = [];
      const selectedLinkages = _.filter(this.linkageTypes, { is_selected: true });
      if (selectedLinkages && selectedLinkages.length > 0) {
        selectedLinkages.forEach((v) => {
          if (!v.api_key) isEmptyList.push(`${v.linkage_name}의 API KEY`);
          let whiteListIps = null;
          if (!v.is_allowed_all_ip) {
            let items = _.map(v.white_list_ips, _.trim);
            items = items.filter((ip) => (ip != null) && (ip !== ''));
            if (!items || items.length <= 0) isEmptyList.push(`${v.linkage_name}의 허용 IP`);
            whiteListIps = items;
          }
          that.store.linkage_auth_list.push({
            linkage_type: v.linkage_type,
            api_key: v.api_key,
            is_allowed_all_ip: v.is_allowed_all_ip,
            white_list_ips: whiteListIps,
          });
        });
      }

      // 은행
      if (!that.balance_account_info.bank_name) isEmptyList.push('은행명');
      if (!that.balance_account_info.holder_name) isEmptyList.push('예금주명');
      if (!that.balance_account_info.account) isEmptyList.push('계좌번호');
      if (!that.balance_account_info.commission_rate) isEmptyList.push('수수료율');

      if (isEmptyList.length === 0) {
        const formData = new FormData();
        const ageTargetCodes = this.store.age_target_codes.filter((obj) => obj.is_checked).map((obj) => obj.code);
        this.represent_category_ids = this.store.represent_categories_list.map((group) => group[group.length - 1]._id);
        formData.append('store_info', JSON.stringify(that.store));
        formData.append('admin', JSON.stringify(that.admin));
        formData.append('return_exchange_address', JSON.stringify(that.return_exchange_address));
        formData.append('return_exchange_account_info', JSON.stringify(that.return_exchange_account_info));
        formData.append('business_info', JSON.stringify(that.business_info));
        formData.append('balance_account_info', JSON.stringify(that.balance_account_info));
        formData.append('age_target_codes', JSON.stringify(ageTargetCodes));
        formData.append('represent_category_ids', JSON.stringify(that.represent_category_ids));
        formData.append('profile', that.profile);
        formData.append('license', that.license);
        formData.append('sale', that.sale);
        formData.append('agency_auth_info', JSON.stringify(that.agency_auth_info));

        const res = await that.$axios.post('super_admin/store/', formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
        });

        if (res.data.result === 'success') {
          that.popupAlert('입점매장이 정상적으로 입점요청되었습니다.');
          that.$router.push({ name: 'super_admin-store' });
        } else {
          that.popupAlert(res.data.message);
        }
      } else {
        that.popupAlert(`아래 필수항목을 모두 입력해주세요.\n${isEmptyList.join('\n')}`);
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
    async generateAPIKey(index) {
      const res = await this.$store.dispatch(`${prefix}/generateAPIKey`);
      if (res.result === 'success') {
        const key = res.data.key;
        const data = this.linkageTypes[index];
        data.api_key = key;
        this.linkageTypes.splice(index, 1, data);
      } else {
        this.$popup.showAlertPopup('오류가 발생했습니다. 다시 시도해주세요');
      }
    },
    async addWhiteIp(linkageIndex) {
      const data = this.linkageTypes[linkageIndex];
      data.white_list_ips.push('');
      this.linkageTypes.splice(linkageIndex, 1, data);
    },
    async removeWhiteIp(linkageIndex, ipIndex) {
      this.linkageTypes[linkageIndex].white_list_ips.splice(ipIndex, 1);
    },
  },
};
