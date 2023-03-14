import { mapGetters } from 'vuex';
import SelperMixin from '@/components/SelperCommonMixin';

const prefix = 'main';

export default {
  name: 'pc-main',
  mixins: [SelperMixin],
  data() {
    return {
      product_list: [],
      isRequesting: false,

      mainEventList: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      products: `${prefix}/products`,
      productTotalCount: `${prefix}/productTotalCount`,
      productPageSize: `${prefix}/productPageSize`,
      productNextCursor: `${prefix}/productNextCursor`,
      stores: `${prefix}/stores`,
      storeTotalCount: `${prefix}/storeTotalCount`,
      storePageSize: `${prefix}/storePageSize`,
    }),
  },
  methods: {
    async infiniteHandler($state) {
      if (this.productNextCursor === '0') return $state.complete(); // 다음 페이지 없음
      if (this.isRequesting) return;
      this.isRequesting = true;
      await this.$store.dispatch(`${prefix}/getProducts`, { cursor: this.productNextCursor });
      if (!this.products || this.products.length <= 0) return $state.complete(); // 조회되는 상품이 없음
      this.product_list.push(...this.products);
      this.isRequesting = false;
      $state.loaded();
    },
    async getProducts(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getProducts`, query);
      this.loading = false;
    },
    async getStores(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getStores`, query);
      this.loading = false;
    },
    clickBanner(url) {
      this.$router.push(url);
    },
    async onProductsPage(query) {
      await this.getProducts(query);
    },
    async onStoresPage(query) {
      await this.getStores(query);
    },
  },
};
