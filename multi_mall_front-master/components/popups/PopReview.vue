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
                    <DefaultImage :imageUrl="review.review_image" />
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
                        <div>상품주문번호 :</div>
                        <div>{{ review.order_num }}</div>
                      </li>
                      <!--
                      <li>
                        <div>구매자 키/몸무게 :</div>
                        <div>0cm / 0kg</div>
                      </li>
                      -->
                      <li>
                        <div>작성자 :</div>
                        <div>{{ review.user }}</div>
                      </li>
                      <li v-if="userGrade === '2'">
                        <div>매장명 :</div>
                        <div><a v-on:click="pageToStoreRedirect">{{ review.store_name }}</a></div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="sub_title">
                  <div>
                    <div class="sub_txt color_main_01"><b>리뷰내용:</b></div>
                    <div class="border_b7 p_10 font_12">
                      {{ review.content }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="popup_text_wrap">
                    <div class="color_main_01"><b>답변내용 :</b></div>
                    <textarea name="" id="" cols="30" rows="10" v-model.lazy="params.reply"></textarea>
                  </div>
                </div>

                <ul class="list_wrap" v-if="userGrade === '2'">
                  <li>
                    <div class="title">베스트 리뷰 선정</div>
                    <div class="body">
                      <select v-model="params.is_best">
                        <option :value="true">Y</option>
                        <option :value="false">N</option>
                      </select>
                    </div>
                  </li>
                  <!--
                  <li>
                    <div class="title">혜택지급</div>
                    <div class="body">
                      <select>
                        <option>고객혜택</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <div class="title">템플릿 제목 :</div>
                    <div class="body">템플릿 1</div>
                  </li>
                  <li>
                    <div class="title">혜택내용 :</div>
                    <div class="body">1000p 적립</div>
                  </li>
                  -->
                </ul>
                <ul class="list_wrap two" v-else>
                  <li>
                    <div class="title">베스트 리뷰 여부</div>
                    <div class="body">{{ review.is_best === false ? 'N' : 'Y' }}</div>
                  </li>
                </ul>
              </div>
              <div class="popup_btn_wrap text-center">
                <button @click.prevent="cancel" class="line_btn">취소</button>
                <button @click.prevent="ok">저장</button>
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
import Utils from '@/plugins/utils';
import PopupMixin from './popupMixin';

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
  data: () => ({
    params: { review_id: '', reply: '', is_best: true },
    userGrade: '',
  }),
  created() {
    this.params.review_id = this.review.id;
    this.params.is_best = this.review.is_best;
    if (this.review.reply_id) {
      this.params.reply_id = this.review.reply_id;
      this.params.reply = this.review.reply_content;
    }
  },
  beforeMount() {
    const jwt = Utils.getCookie(document.cookie, 'jwt');
    if (jwt) {
      const info = JSON.parse(atob(jwt.split('.')[1]));
      this.userGrade = info.info.split('_')[1];
    }
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
