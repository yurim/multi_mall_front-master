<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap width_m">
<!--            <div class="popup_title">타이틀</div>-->
            <div class="popup_content_wrap">
              <ul class="pop_review_show_wrap">
<!--                li하나당 리뷰하나 -->
                <li>
                  <div class="img_wrap">
                    <swiper v-if="review.review_images && review.review_images.length > 0" class="swiper" :options="mainSlide">
                      <swiper-slide v-for="(image, index) in review.review_images" :key="index"><img alt="기본 이미지" :src="image"></swiper-slide>
                      <div class="swiper-pagination swiper-pagination-bullets swiper-pagination-black" slot="pagination"></div>
                      <div class="swiper-button-prev swiper-button-white hidden-xs" slot="button-prev"></div>
                      <div class="swiper-button-next swiper-button-white hidden-xs" slot="button-next"></div>
                    </swiper>
                    <img v-else alt="기본 이미지" src="@/assets/img/admin/default_img.png">
                  </div>
                  <div class="info_wrap">
                    <div class="rate_wrap">
                      <Star :readonly="true"
                            :disabled="true"
                            :rateNumber="`pop-${review.id}`"
                            :star="review.score"></Star>
                      <span class="point"><span>{{ review.score }}</span>점</span>
                      <span v-if="review.is_best" class="best_icon">BEST</span>
                    </div>
                    <div class="date_wrap">
                      {{ review.name }} ㅣ {{ review.created_at | date }}<br/>
                      옵션 : {{ review.option_values }}
                      <template v-if="!review.isAbroad"> | {{ review.amount | comma }}개</template>
                    </div>

                    <!-- 해외상품 리뷰 (원문, 번역) -->
                    <template v-if="review.isAbroad">
                      <div class="text_wrap">
                        <div class="review_text">
                          <span class="text_title">
                            {{ isAbroadTranslation ? '번역 리뷰' : '원본 리뷰' }}
                          </span>
                          <span class="checkbox_wrap pull-right">
                          <input v-model="isAbroadTranslation" type="checkbox" id="test01" name="test01" checked>
                          <label for="test01">한글로 번역하기</label>
                        </span>
                        </div>
                        <div class="review_content">
                          {{ isAbroadTranslation ? review.translation_content : review.content }}
                        </div>
                      </div>
                    </template>
                    <!-- 국내상품 리뷰 -->
                    <template v-else>
                      <div class="text_wrap">
                        <div class="review_text">
                          <div class="text_title m_b_5">
                            <em>리뷰내용</em>
                          </div>
                          <p class="txt_story">{{ review.content }}</p>
                        </div>
                      </div>
                      <div class="admin_txt" v-if="review.reply_content">
                        <div class="review_text">
                          <div class="text_title m_b_5">
                            <span class="abbreviation_icon"></span><em>판매자답변</em>
                          </div>
                          <p class="txt_story">{{ review.reply_content }}</p>
                        </div>
                      </div>
                    </template>
                  </div>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">닫기</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    review: {
      type: Object,
    },
  },
  data: () => ({
    mainSlide: {
      slidesPerView: 1,
      slidesPerGroup: 1,
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
    isAbroadTranslation: true,
  }),
  created() {
  },
  methods: {
  },
});
</script>
