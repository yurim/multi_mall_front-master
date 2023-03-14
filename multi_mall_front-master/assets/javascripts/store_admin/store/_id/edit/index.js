import { mapGetters } from 'vuex';
import util from '@/assets/javascripts/util';

const prefix = 'store_admin/store/_id/edit';

export default {
  data: () => ({
    categories_list: [],
    selectedCategoryObj: {},
    profilePreview: '',
    logoPreview: '',
    licensePreview: '',
    isSetRepresentProduct: false,
    represent_product: [],
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getStore`, params.id);
    await store.dispatch(`${prefix}/getCategories`);
    await store.dispatch('common/getCodes', ['delivery_company']);
  },
  computed: {
    ...mapGetters({
      store: `${prefix}/store`,
      categories: `${prefix}/categories`,
      codesArray: 'common/codesArray',
    }),
  },
  created() {
    this.categories_list.push(this.categories);

    this.initEmptyData();
  },
  beforeUpdate() {
    this.initEmptyData();
  },
  mounted() {
    this.initPreview();
  },
  methods: {
    selectedRepresentProductCallback(products) {
      this.isSetRepresentProduct = false;
      this.store.represent_products = products;
    },
    initPreview() {
      if (this.store) {
        if (this.store.profile) this.profilePreview = this.store.profile;
        if (this.store.appProfile) this.appProfilePreview = this.store.appProfile;
        const sui = this.store.store_business_info;
        if (sui && sui.license) this.licensePreview = sui.license;
      }
    },
    initEmptyData() {
      if (!this.store.store_return_exchange_address) this.store.store_return_exchange_address = {};
      if (!this.store.store_return_exchange_account_info) this.store.store_return_exchange_account_info = {};
    },
    postCode(e) {
      util.showSearchAddress((data) => {
        if (e.target.id === 'store_return_exchange_address') {
          this.store.store_return_exchange_address.zipcode = data.zonecode;
          this.store.store_return_exchange_address.address = data.address;
        } else {
          this.store.zipcode = data.zonecode;
          this.store.address = data.address;
        }
      });
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
      if (name && _id) {
        that.selectedCategoryObj[id] = { _id, name };
      }
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
      const id = e.target.id;
      const imageFile = e.target.files[0];
      const recommendSize = (10 * 1024 * 1024);

      if (recommendSize > imageFile.size) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        if (id === 'profile') {
          reader.onload = (event) => {
            this.profilePreview = event.target.result;
          };
          this.store.profileImage = imageFile;
        } else if (id === 'logo') {
          console.log('앱용 프로필 등록중');

          reader.onload = (event) => {
            this.logo = event.target.result;
          };
          this.store.logo = imageFile;
        } else {
          // 사업자 등록증
          reader.onload = (event) => {
            this.licensePreview = event.target.result;
          };
          this.store.licenseImage = imageFile;
        }
      } else {
        this.$popup.showAlertPopup('이미지 용량이 10MB를 초과합니다.');
      }
    },
    deleteImage(target) {
      if (target === 'profile') {
        this.store.profileImage = '';
      } else {
        this.store.licenseImage = '';
      }

      document.getElementById(`${target}_name`).setAttribute('src', '');
      document.getElementById(`${target}`).value = '';
    },
    async updateCancel() {
      await this.$router.push(`/store_admin/store/${this.store.id}`);
    },
    async updateStore() {
      this.store.age_target_codes = this.store.age_target_codes.filter((obj) => obj.is_checked).map((obj) => obj.code);

      this.store.store_represent_category_ids = this.store.represent_categories_list.map((group) => group[group.length - 1]._id);
      const res = await this.$store.dispatch(`${prefix}/updateStore`, this.store);
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
      this.$popup.showAlertPopup('완료되었습니다.');
      await this.$router.push(`/store_admin/store/${this.store.id}`);
    },
  },
};
