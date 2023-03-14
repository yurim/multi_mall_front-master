<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <form>
            <div class="product_popup_wrap">
              <div class="popup_wrap width_m">
                <div class="popup_title">
                  리뷰 글번호 : {{ review.id }}
                  <Star
                    :readonly="true"
                    :disabled="true"
                    :star="review.score"
                    :rateNumber="0"
                  />
                  <div class="day">{{ review.created_at | date }}</div>
                </div>

                <div class="popup_text_wrap">
                  <div class="review_wrap">
                    <div v-if="review.review_type === 'PHOTO'">
                      <DefaultImage :imageUrl="review.image_url" />
                    </div>
                    <div>
                      <ul class="list_wrap">
                        <li>
                          <div>상품명 :</div>
                          <div><a v-on:click="pageToProductRedirect">{{ review.product_name }}</a></div>
                        </li>
                        <li>
                          <div>옵션 :</div>
                          <div>{{ review.option_values }}</div>
                        </li>
                        <li>
                          <div>작성자 :</div>
                          <div>{{ review.writer_id }}</div>
                        </li>
                        <li v-if="review.store_name">
                          <div>매장명 :</div>
                          <div><a v-on:click="pageToStoreRedirect">{{ review.store_name }}</a></div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="sub_title">
                    <div>
                      <div class="sub_txt color_main_01"><b>리뷰내용(원문):</b></div>
                      <div class="border_b7 p_10 font_12">
                        {{ review.content }}
                      </div>
                    </div>
                    <div>
                      <div class="sub_txt color_main_01"><b>리뷰내용(번역):</b></div>
                      <div class="border_b7 p_10 font_12">
                        {{ review.translation_content }}
                      </div>
                    </div>
                  </div>

                </div>
                <div class="popup_btn_wrap text-center">
                  <button @click.prevent="cancel">닫기</button>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import PopupMixin from '~/components/popups/popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    review: {
      type: Object,
      default: null,
    },
    $router: {
      type: Object,
      default: null,
    },
  },
  methods: {
    pageToStoreRedirect() {
      if (this.userGrade === '1') this.$router.push({ name: 'store_admin-store-id', params: { id: this.review.store_id } });
      if (this.userGrade === '2') this.$router.push({ name: 'super_admin-store-id', params: { id: this.review.store_id } });
      this.$destroy();
    },
    pageToProductRedirect() {
      if (this.userGrade === '1') this.$router.push({ name: 'store_admin-product-id', params: { id: this.review.product_id } });
      if (this.userGrade === '2') this.$router.push({ name: 'super_admin-product-id', params: { id: this.review.product_id } });
      this.$destroy();
    },
  },
});
</script>

<style scoped>

</style>
