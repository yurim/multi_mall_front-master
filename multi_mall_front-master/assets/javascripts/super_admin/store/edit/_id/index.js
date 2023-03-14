import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import util from '@/assets/javascripts/util';
import _ from 'lodash';

const prefix = 'super_admin/store/edit/_id';

export default {
  data: () => ({
    selectedCategoryObj: {},
    represent_category_ids: [],
    // 공통 코드
    storeStateTypes: [],
    storeTypes: [],
    linkageTypes: [],
    deliveryCompanies: [],
    // 입점매장 정보
    represent_category: [],
    represent_product: [],
    license: {},
    sale: {},
    // etc.
    categories_list: [],
    selectCategory: [],
    profileURL: '',
    licenseURL: '',
    saleURL: '',
    isSetRepresentProduct: false,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getStore`, params.id);
    await store.dispatch(`${prefix}/getCategories`);
    await store.dispatch('common/getCodes', ['delivery_company', 'store_type', 'store_state_type', 'linkage_type']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      store: `${prefix}/store`,
      categories: `${prefix}/categories`,
    }),
  },
  created() {
    this.deliveryCompanies = this.codesArray('delivery_company');
    this.storeTypes = this.codesArray('store_type');
    const linkageTypeList = this.codesArray('linkage_type');
    linkageTypeList.forEach((v) => {
      const linkageAuth = _.find(this.store.linkage_auth_list, { linkage_type: v.key });
      this.linkageTypes.push({
        linkage_type: v.key,
        linkage_name: v.value,
        is_selected: !!linkageAuth,
        api_key: linkageAuth ? linkageAuth.api_key : null,
        is_allowed_all_ip: linkageAuth ? linkageAuth.is_allowed_all_ip : true,
        white_list_ips: linkageAuth && !linkageAuth.is_allowed_all_ip ? linkageAuth.white_list_ips : [''],
      });
    });

    this.storeStateTypes = this.codesArray('store_state_type');
    this.categories_list.push(this.categories);

    this.init();
  },
  methods: {
    init() {
      this.storeTypes.forEach((type) => {
        if (type.key === this.store.store_type || type.value === this.store.store_type) this.store.store_type = type.key;
      });
      this.storeStateTypes.forEach((type) => {
        if (type.key === this.store.store_state_type || type.value === this.store.store_state_type) this.store.store_state_type = type.key;
      });

      this.profileURL = this.store.profile;
      this.licenseURL = this.store.store_business_info.license;
      this.saleURL = this.store.store_business_info.sale;
      this.represent_product = this.store.represent_products;

      if (!this.store.store_balance_account_info) this.store.store_balance_account_info = { bank_name: '', holder_name: '', account: '' };
      if (!this.store.store_return_exchange_account_info) this.store.store_return_exchange_account_info = { bank_name: '', holder_name: '', account: '' };
      if (!this.store.store_return_exchange_address) this.store.store_return_exchange_address = { zipcode: '', address: '', detail_address: '' };
      if (!this.store.store_external_api_key) this.store.store_external_api_key = { api_key: '' };
    },
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
        if (id === 'return_exchange_address') {
          if (!this.store.store_return_exchange_address
            || !Object.keys(this.store.store_return_exchange_address).length > 0) {
            this.store.store_return_exchange_address = {};
          }
          this.store.store_return_exchange_address.zipcode = data.zonecode;
          this.store.store_return_exchange_address.address = data.address;
        } else {
          this[`${id}`].zipcode = data.zonecode;
          this[`${id}`].address = data.address;
          if (id === 'store') this.store.sigungu_code = data.sigungu_code;
        }
      });
    },
    setAddress(target) {
      document.getElementById(target).click();
    },
    async selectedCategories(e) {
      const that = this;
      const id = e.target.id;
      const startCount = Number(e.target.id) + 1;
      const deleteCount = that.categories_list.length - startCount;

      that.categories_list.splice(startCount, deleteCount);

      if (e.target.value) {
        const query = {};
        query._id = e.target.value;
        const res = await that.$store.dispatch(`${prefix}/getCategories`, query);
        if (res.data.categories.length > 0) that.categories_list.push(res.data.categories);
      }
      const element = document.getElementById(id);
      const name = element[element.selectedIndex].getAttribute('name');
      const _id = e.target.value;

      if (id === '0') that.selectedCategoryObj = {};
      if (name && _id) that.selectedCategoryObj[id] = { _id, name };
    },
    addCategoryGroup() {
      const that = this;
      if (Object.keys(that.selectedCategoryObj).length > 0) {
        if (that.store.represent_categories_list.length < 5) {
          that.store.represent_categories_list.push(Object.values(that.selectedCategoryObj));
          document.getElementById('0').options[0].selected = true;
          that.categories_list.splice(1, 4);
          that.selectedCategoryObj = {};
        } else this.$popup.showAlertPopup('최대 5개까지 추가할 수 있습니다.');
      } else this.$popup.showAlertPopup('카테고리를 추가해주세요.');
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
      } else this.popupAlert('이미지 용량이 10MB를 초과합니다.');
    },
    deleteImage(target) {
      this[target] = {};
      this[`${target}URL`] = '';
      document.getElementById(target).value = '';
    },
    editProfile(target) {
      document.getElementById(target).click();
    },
    selectedRepresentProductCallback(products) {
      this.isSetRepresentProduct = false;
      this.represent_product = products;
    },
    async patchStore() {
      const isEmptyList = [];
      const that = this;

      // 매장
      if (!that.store.name_kor) isEmptyList.push('매장명(한글)');
      // if (!that.store.name_eng) isEmptyList.push('매장명(영문)');
      if (!that.store.store_type) isEmptyList.push('매장 형태');
      if (!that.store.zipcode) isEmptyList.push('매장 주소 - 우편번호');
      if (!that.store.address) isEmptyList.push('매장 주소 - 주소');
      if (!that.profile && !that.store.profile) isEmptyList.push('매장 프로필');
      if (!that.store.cs_phone) isEmptyList.push('고객센터 연락처');
      if (this.store.age_target_codes.length === 0) isEmptyList.push('타겟 연령층');

      // 대표 상품군
      if (that.store.represent_categories_list.length === 0) isEmptyList.push('대표 상품군');

      // 담당자
      if (!that.store.store_admin_name) isEmptyList.push('담당자명');
      if (!that.store.store_admin_phone) isEmptyList.push('담당자연락처');

      // 반품 교환 배송
      if (!that.store.store_return_exchange_address.zipcode) isEmptyList.push('반품교환지 - 우편번호');
      if (!that.store.store_return_exchange_address.address) isEmptyList.push('반품교환지 - 주소');
      if (!that.store.store_return_exchange_address.delivery_company) isEmptyList.push('반품교환 택배사');

      // 반품비용 수령 계좌
      if (!that.store.store_return_exchange_account_info.bank_name) isEmptyList.push('반품비용 수령 계좌 - 은행명');
      if (!that.store.store_return_exchange_account_info.holder_name) isEmptyList.push('반품비용 수령 계좌 - 예금주명');
      if (!that.store.store_return_exchange_account_info.account) isEmptyList.push('반품비용 수령 계좌 - 계좌번호');

      // 사업자
      if (!that.store.store_business_info.ceo_name) isEmptyList.push('대표자명');
      if (!that.store.store_business_info.company_name) isEmptyList.push('상호명');
      if (!that.store.store_business_info.license_num) isEmptyList.push('사업자 등록번호');
      if (!that.license && !that.store.store_business_info.license) isEmptyList.push('사업자등록증');
      if (!that.store.store_business_info.sale_num) isEmptyList.push('통신판매 신고번호');
      if (!that.sale && !that.store.store_business_info.sale) isEmptyList.push('통신판매업 신고증');

      // 구매/배송대행 권한
      if (that.store.agency_selectable && that.store.st11_linkable) {
        if (!that.store.store_external_api_key.api_key) isEmptyList.push('11번가 연동 API KEY');
      }

      // 연동 권한
      const newLinkageAuthList = [];
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
          newLinkageAuthList.push({
            linkage_type: v.linkage_type,
            api_key: v.api_key,
            is_allowed_all_ip: v.is_allowed_all_ip,
            white_list_ips: whiteListIps,
          });
        });
      }

      // 은행
      if (!that.store.store_balance_account_info.bank_name) isEmptyList.push('은행명');
      if (!that.store.store_balance_account_info.holder_name) isEmptyList.push('예금주명');
      if (!that.store.store_balance_account_info.account) isEmptyList.push('계좌번호');
      if (!that.store.store_balance_account_info.commission_rate) isEmptyList.push('수수료율');

      if (isEmptyList.length === 0) {
        const formData = new FormData();
        const store = {
          id: that.store.id,
          name_kor: that.store.name_kor,
          zipcode: that.store.zipcode,
          address: that.store.address,
          sigungu_code: that.store.sigungu_code,
          detail_address: that.store.detail_address,
          cs_phone: that.store.cs_phone,
          kakao_plus_url: that.store.kakao_plus_url,
          instagram_id: that.store.instagram_id,
          store_type: that.store.store_type,
          url: that.store.url,
          is_crawling: that.store.is_crawling,
          has_abroad_product: that.store.has_abroad_product,
          linkage_auth_list: newLinkageAuthList,
        };
        const storeAdmin = { email: that.store.store_admin_email, name: that.store.store_admin_name, phone: that.store.store_admin_phone };
        const representProduct = Array.prototype.reduce.call(that.represent_product, (list, product) => {
          if (!product.id) product.id = product._id;
          list.push(product);
          return list;
        }, []);

        const ageTargetCodes = this.store.age_target_codes.filter((obj) => obj.is_checked).map((obj) => obj.code);
        const agencyAuthInfo = {
          agency_selectable: that.store.agency_selectable,
          st11_linkable: that.store.st11_linkable,
          st11_api_key: that.store.store_external_api_key.api_key,
        };
        this.represent_category_ids = this.store.represent_categories_list.map((group) => group[group.length - 1]._id);
        formData.append('store_info', JSON.stringify(store));
        formData.append('store_admin', JSON.stringify(storeAdmin));
        formData.append('store_return_exchange_address', JSON.stringify(that.store.store_return_exchange_address));
        formData.append('store_return_exchange_account_info', JSON.stringify(that.store.store_return_exchange_account_info));
        formData.append('store_business_info', JSON.stringify(that.store.store_business_info));
        formData.append('store_balance_account_info', JSON.stringify(that.store.store_balance_account_info));
        formData.append('age_target_codes', JSON.stringify(ageTargetCodes));
        formData.append('store_represent_category_ids', JSON.stringify(that.represent_category_ids));
        formData.append('represent_products', JSON.stringify(representProduct));
        formData.append('profileImage', that.profile);
        formData.append('licenseImage', that.license);
        formData.append('saleImage', that.sale);
        formData.append('agency_auth_info', JSON.stringify(agencyAuthInfo));

        await this.$createLoading(async () => {
          const res = await that.$axios.post(`super_admin/store/${that.store.id}/update`, formData, {
            headers: {
              'content-type': 'multipart/form-data',
            },
          });
          if (res.data.result === 'success') {
            that.popupAlert('수정되었습니다.');
            that.$router.push({ name: 'super_admin-store', params: { id: that.store.id } });
          } else that.popupAlert(res.data.message);
        });
      } else that.popupAlert(`아래 필수항목을 모두 입력해주세요.\n${isEmptyList.join('\n')}`);
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
