<template>
  <div class="mini_review_wrap">
    <!-- *** 다른 상품 리뷰 평점 START *** -->
    <section>
      <div class="review_card_title">다른 상품 리뷰 평점</div>
      <div class="review_card_wrap">
        <ul>
          <swiper :options="scoreSlide" v-if="productScores.length > 0">
            <swiper-slide v-for="item in productScores" :key="item.product_id">
              <li>
                <div class="text_box">
                  <div class="f_bold">매장명</div>
                  <div class="store_name color_gray_70">{{ item.store_name }}</div>
                  <div class="review_star_total">
                    <div class="data_star">
                      <div class="only_star" :class="{'disabled': item.score <= 0}"></div>
                      <em>{{ item.score }}</em><span class="review_total">/ 5</span>
                    </div>
                  </div>
                  <div>
                    <nuxt-link :to="`/product/${item.product_id}`" class="color_gray_70 under_line">{{ item.total_review_count | comma }}개의 리뷰 평점</nuxt-link>
                  </div>
                </div>
              </li>
            </swiper-slide>
          </swiper>
          <!--리뷰가 존재하지 않을때 -->
          <li class="empty_text_wrap bg_none" v-else>리뷰가 존재하지 않습니다.</li>
        </ul>
        <div class="swiper-button-prev text_review_slide_prev swiper-button-white" slot="button-prev"></div>
        <div class="swiper-button-next text_review_slide_next swiper-button-white" slot="button-next"></div>
      </div>
    </section>
    <!-- *** 다른 상품 리뷰 평점 END *** -->

    <!-- *** 다른 상품 포토리뷰 START *** -->
    <section>
      <div class="review_card_title">다른 상품 포토리뷰</div>
      <div class="review_card_wrap">
        <ul class="review_card_best">
          <swiper :options="photoReviewSlide" v-if="photoReviews.length > 0" @reachEnd="getNextPhotoReview">
            <swiper-slide v-for="review in photoReviews" :key="review.id">
              <li>
                <nuxt-link :to="`/product/${review.product_id}`">
                  <div class="best_review_img">
                    <DefaultImage :imageUrl="review.image"/>
                    <div class="store_name">{{ review.store_name }}</div>
                  </div>
                </nuxt-link>
              </li>
            </swiper-slide>
          </swiper>
          <!--리뷰가 존재하지 않을때 -->
          <li class="empty_text_wrap bg_none" v-else>리뷰가 존재하지 않습니다.</li>
        </ul>
        <div class="swiper-button-prev photo_review_slide_prev swiper-button-white" slot="button-prev"></div>
        <div class="swiper-button-next photo_review_slide_next swiper-button-white" slot="button-next"></div>
      </div>
    </section>
    <!-- *** 다른 상품 포토리뷰 END *** -->

    <!-- *** 다른 상품 해외 구매리뷰 START *** -->
    <section>
      <div class="review_card_title p_0 m_b_0">다른 상품 해외 구매리뷰</div>
      <div class="review_show_content">
        <ul class="review_show_wrap__list">
          <li>
            <div class="review_show_wrap__info_wrap">
              <ul v-if="abroadReviews.length > 0">
                <li v-for="review in abroadReviews" :key="review.id">
                  <div>
                    <Star :readonly="true"
                          :disabled="true"
                          :rateNumber="`other-${review.id}`"
                          :star="review.score"></Star>
                    <span class="m_l_10">{{ review.score }}점</span>
                  </div>
                  <div class="color_gray_70 m_t_10">{{ review.store_name }}</div>
                  <div class="content_txt" :class="{'on': review.expand}">
                    <div class="review_show_wrap__info_wrap_text">
                      <p class="txt_story">{{ review.translation_content }}</p>
                    </div>
                    <!-- 나중에 접었다 펼치기 버튼 추가될시 -->
                    <!-- <div class="info_text_btn">-->
                    <!-- <a>펼치기</a>-->
                    <!-- <a>접기</a>-->
                    <!-- </div>-->
                  </div>
                  <nuxt-link :to="`/product/${review.product_id}`" class="color_gray_70 under_line d_ib">자세히 보기</nuxt-link>
                </li>
              </ul>
              <!--리뷰가 존재하지 않을때 -->
              <div class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다.</div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!-- *** 다른 상품 해외 구매리뷰 END *** -->

    <!-- *** 다른 상품 국내 구매리뷰 START *** -->
    <section>
      <div class="review_card_title p_0 m_b_0">다른 상품 국내 구매리뷰</div>
      <div class="review_show_content">
        <ul class="review_show_wrap__list">
          <li>
            <div class="review_show_wrap__info_wrap">
              <ul v-if="reviews.length > 0">
                <li v-for="review in reviews" :key="review.id">품
                  <div>
                    <Star :readonly="true"
                          :disabled="true"
                          :rateNumber="`other-${review.id}`"
                          :star="review.score"></Star>
                    <span class="m_l_10">{{ review.score }}점</span>
                  </div>
                  <div class="color_gray_70 m_t_10">{{ review.store_name }}</div>
                  <div class="content_txt" :class="{'on': review.expand}">
                    <div class="review_show_wrap__info_wrap_text">
                      <p class="txt_story">{{ review.content }}</p>
                    </div>
                  </div>
                  <nuxt-link :to="`/product/${review.product_id}`" class="color_gray_70 under_line d_ib">자세히 보기</nuxt-link>
                </li>
              </ul>
              <!--리뷰가 존재하지 않을때 -->
              <div class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다.</div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!-- *** 다른 상품 국내 구매리뷰 END *** -->
  </div>
</template>
<script src="@/assets/javascripts/product/review/other_stores/index.js"></script>
