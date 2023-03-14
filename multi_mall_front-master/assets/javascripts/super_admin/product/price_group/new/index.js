import { mapGetters } from 'vuex';
import _ from 'lodash';
import util from '@/assets/javascripts/util';

const prefix = 'super_admin/product/price_group/new';

export default {
  data: () => ({
    // category
    copiedItems: [],
    selectedCategories: [''],

    groupProductCount: 0,
    exceptionProductList: [],

    priceGroup: {
      products: [],
    },
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getCategories`);
    if (query.product_ids) {
      await store.dispatch(`${prefix}/getInitProducts`, { product_ids: query.product_ids.split(',') });
    }
  },
  computed: {
    ...mapGetters({
      categories: `${prefix}/categories`,
      initProducts: `${prefix}/initProducts`,
      initSelectedCategoryIds: `${prefix}/initSelectedCategoryIds`,
    }),
  },
  created() {
    this.copiedItems.push(this.categories);
    if (this.initProducts) {
      this.priceGroup.products = this.initProducts;
    }
  },
  async destroyed() {
    await this.$store.commit(`${prefix}/resetState`);
  },
  async mounted() {
    if (this.initSelectedCategoryIds) {
      await util.asyncForEach(this.initSelectedCategoryIds, async (categoryId, index) => {
        const category = _.find(this.copiedItems[index], (c) => c._id === categoryId);
        if (category) {
          if (index === 0) {
            this.selectedCategories = [category];
          } else {
            this.selectedCategories[index] = category;
          }
          await this.selectedCategory(index);
        }
        return true;
      });
    }
  },
  methods: {
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
    addToGroup(product, i) {
      this.exceptionProductList.splice(i, 1);
      this.priceGroup.products.push(product);
    },
    exceptFromGroup(product, i) {
      this.priceGroup.products.splice(i, 1);
      this.exceptionProductList.push(product);
    },
    createProductPriceGroup() {
      let lastCategory = null;
      this.selectedCategories.forEach((v) => {
        if (v && !v.hasChild) lastCategory = v;
      });

      const groupProductIds = [];
      _.forEach(this.priceGroup.products, (product) => {
        groupProductIds.push(product.id);
      });

      new this.$popup.Confirm({
        propsData: {
          title: '등록하시겠습니까?',
          okCallback: async (params) => {
            const res = await this.$store.dispatch(`${prefix}/createProductPriceGroup`, {
              category_id: lastCategory._id,
              group_product_ids: groupProductIds,
            });
            if (res.result === 'error') this.$popup.showAlertPopup(res.message);
            else {
              this.$popup.showAlertPopup('등록되었습니다.', () => {
                // console.log(res.data);
                this.$router.push(`/super_admin/product/price_group/${res.data.product_price_group_id}`);
              });
            }
            params.$destroy();
          },
        },
      }).$mount();
    },
    async showPriceGroupAdditionPopup() {
      if (!this.selectedCategories) return this.popupAlert('카테고리를 선택해주세요');
      let lastCategory = null;
      this.selectedCategories.forEach((v) => {
        if (v && !v.hasChild) lastCategory = v;
      });
      if (!lastCategory) return this.popupAlert('카테고리를 끝까지 선택해주세요');
      new this.$popup.PriceGroupAddition({
        propsData: {
          category: this.selectedCategories.map((sc) => sc.name).join(' > '),
          categoryId: this.selectedCategories.lastItem._id,
          okCallback: (params) => {
            if (params.addProductList && params.addProductList.length > 0) {
              _.forEach(params.addProductList, (product) => {
                this.priceGroup.products.push({
                  id: product.id,
                  main_image: product.main_image,
                  name: product.name,
                  category: product.category,
                  discount_price: product.discount_price,
                  price: product.price,
                });
              });
            }

            params.$destroy();
          },
        },
      }).$mount();
    },
    popupAlert(message) {
      this.$popup.showAlertPopup(message);
    },

  },
};
