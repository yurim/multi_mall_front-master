<template>

  <div class v-sticky sticky-offset="{top: 80, bottom: 30}" sticky-side="both" on-stick="onStick" sticky-z-index="20">
    <div class="side_bar_wrap">
      <div class="side_bar_content_wrap">
        <div class="side_cart_wrap m_b_10">
          <nuxt-link to="/cart">CART
            <span><b> {{ carts.length }}</b></span>
          </nuxt-link>
        </div>

        <div>
          <div class="cart_title font_12 m_b_10"><b>최근 본상품</b></div>
          <client-only>
            <swiper class="swiper recent_product_wrap" :options="sideBarProduct">
              <swiper-slide v-for="(group, index) in recentProducts" :key="index">
                <div v-for="product in group" :key="product.id">
                  <nuxt-link :to="product.linkUrl">
                    <div class="img_bg_wrap m_b_5"
                         v-bind:style="{ backgroundImage: `url(${ product.imageUrl ? product.imageUrl : require('@/assets/img/product_default_img.png') })` }"></div>
                  </nuxt-link>
                </div>
              </swiper-slide>

              <div class="swiper-pagination" slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </client-only>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';

export default {
  name: 'SideBar',
  data: () => ({

    sideBarProduct: {
      // direction: 'vertical',
      // spaceBetween: 60,
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

    // recent products
    recentProducts: [],

  }),
  computed: {
    ...mapGetters({
      carts: 'cart/carts',
    }),
  },
  async beforeMount() {
    const isLogin = !!Utils.getUserId(document.cookie);
    if (isLogin) {
      await this.$store.dispatch('cart/get_carts');
    } else {
      await this.getUnknownCarts();
    }
  },
  activated() {
    this.setRecentProducts();
  },
  mounted() {
    this.setRecentProducts();
  },
  methods: {
    /**
     * 스크롤을 최상단으로 이동
     */
    scrollTop() {
      window.scroll(0, 0);
    },
    setRecentProducts() {
      const getRecentProducts = sessionStorage.getItem('recentProducts');
      if (getRecentProducts) {
        const products = [];
        const recentProducts = JSON.parse(sessionStorage.getItem('recentProducts'));
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const items = recentProducts.splice(0, 3);
          if (items.length > 0) products.push(items);
          else break;
        }
        this.recentProducts = products;
      }
    },
    async getUnknownCarts() {
      const cookie = document.cookie;
      let unknownCartsStr = await Utils.getCookie(cookie, 'unknown_carts');
      if (unknownCartsStr) {
        unknownCartsStr = decodeURIComponent(unknownCartsStr);
        const unknownCarts = JSON.parse(unknownCartsStr);
        if (unknownCarts.length > 0) {
          await this.$store.dispatch('cart/get_unknown_carts', { unknown_carts: unknownCarts });
        }
      }
    },
  },
};
</script>

<style scoped>
</style>
