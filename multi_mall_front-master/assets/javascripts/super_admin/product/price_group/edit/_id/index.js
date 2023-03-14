import { mapGetters } from 'vuex';
import _ from 'lodash';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/product/price_group/edit/_id';

export default {
  data: () => ({
    exceptionProductList: [],
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getPriceGroup`, params.id);
  },
  computed: {
    ...mapGetters({
      priceGroup: `${prefix}/priceGroup`,
    }),
  },
  methods: {
    addToGroup(product, i) {
      product.except_price_group = false;
      this.exceptionProductList.splice(i, 1);
      this.priceGroup.products.push(product);
    },
    exceptFromGroup(product, i) {
      this.priceGroup.products.splice(i, 1);
      this.exceptionProductList.push(product);
    },
    updateProductPriceGroup() {
      const groupProductIds = [];
      const exceptProducts = [];
      _.forEach(this.priceGroup.products, (product) => {
        groupProductIds.push(product.id);
      });
      _.forEach(this.exceptionProductList, (product) => {
        exceptProducts.push({
          id: product.id,
          can_product_price: !product.except_price_group,
        });
      });
      new this.$popup.Confirm({
        propsData: {
          title: '수정하시겠습니까?',
          okCallback: async (params) => {
            const res = await this.$store.dispatch(`${prefix}/updateProductPriceGroup`, {
              id: this.priceGroup.id,
              group_product_ids: groupProductIds,
              except_products: exceptProducts,
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
            this.showPriceGroupStoringPopup();
            params.$destroy();
          },
        },
      }).$mount();
    },
    showPriceGroupStoringPopup() {
      const exceptProductIds = [];
      _.forEach(this.exceptionProductList, (product) => {
        if (!product.except_price_group) {
          exceptProductIds.push(product.id);
        }
      });
      new Popup.PriceGroupStorage({
        propsData: {
          exceptCount: exceptProductIds.length,
          okCallback: (params) => {
            this.$router.push(`/super_admin/product/price_group/${this.priceGroup.id}`);
            params.$destroy();
          },
          cancelCallback: () => {
            this.$router.push(`/super_admin/product/price_group/${this.priceGroup.id}`);
          },
          createGroupCallback: (params) => {
            console.log(params);
            this.$router.push(`/super_admin/product/price_group/new?product_ids=${exceptProductIds.toString()}`);
            params.$destroy();
          },
        },
      }).$mount();
    },
    showPriceGroupAdditionPopup() {
      new Popup.PriceGroupAddition({
        propsData: {
          category: this.priceGroup.category,
          categoryId: this.priceGroup.categories.lastItem,
          okCallback: async (params) => {
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
  },
};
