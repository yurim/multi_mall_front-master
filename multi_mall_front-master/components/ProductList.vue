<template>
  <ul>
    <li class="list_inner" v-for="product in productList" :key="product.id">
      <nuxt-link :to="`/product/${product.id}`">
        <div class="img_wrap">
          <DefaultImage :imageUrl="product.main_image"/>
        </div>
      </nuxt-link>
      <div class="text_wrap">
        <div class="store_wrap">
          <nuxt-link :to="`/store/${product.store_id}`" v-if="product.store_id">{{ product.store_name }}</nuxt-link>
          <span v-else>{{ product.store_name }}</span>
        </div>
        <div class="title_wrap">
          <nuxt-link :to="`/product/${product.id}`">{{ product.name }}</nuxt-link>
        </div>
        <div class="reaction">
          <div class="data_star" v-if="product.total_score > 0 && product.total_review_count > 0">
            <div class="only_star"></div>
            <em>{{ (product.total_score / product.total_review_count) | ceil(1) }}</em>
          </div>
          <div class="data_star" v-else>
            <div class="only_star disabled"></div>
            <em>0</em>
          </div>
          <div class="data">
            <em>{{ product.total_sale_count | kUnit | comma }}</em>개 판매
          </div>
          <div class="data">
            <nuxt-link :to="{ path: `/product/${product.id}`, hash: '#review'}">
              <em>{{ product.total_review_count | kUnit | comma }}</em>개의 리뷰
            </nuxt-link>
          </div>
        </div>
        <div class="price_wrap" v-if="product.discount_price">
          <div class="discount-percentage"><em>{{ (1 - product.discount_price / product.price) * 100 | rate }}</em>%
          </div>
          <div class="base-price">{{ product.price | comma }}원</div>
          <div class="sale-price"><em>{{ product.discount_price | comma }}</em>원</div>
        </div>
        <div class="price_wrap" v-else>
          <div class="sale-price"><em>{{ product.price | comma }}</em>원</div>
        </div>
      </div>
      <!--            <ul class="icon_wrap">-->
      <!--              <li class="new">NEW</li>-->
      <!--              <li class="best">BEST</li>-->
      <!--              <li v-if="product.isAboard" class="abroad">해외직구-->
      <!--                <DefaultImage :imageUrl="product.imageUrl"/>-->
      <!--              </li>-->
      <!--            </ul>-->
    </li>
  </ul>
</template>
<script>
export default {
  name: 'ProductList',
  props: {
    productList: Array,
  },
  data() {
    return {
    };
  },
};
</script>
