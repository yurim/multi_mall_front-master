<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>
        <div class="list_title_wrap"><span>마이페이지</span></div>

        <MypageCondition></MypageCondition>
        <div class="m_b_40 d_ib_100">
          <TopTabNav></TopTabNav>
        </div>

        <div class="mypage_info_wrap">
          <div class="main_color_title">MY 리뷰</div>
        </div>

        <div class="list_title_wrap m_b_10 m_t_0">
          <ul class="tab_menu_wrap pull-left">
            <li v-on:click="tabType = 'write'"><a :class="{ on: tabType === 'write' }">작성가능 리뷰</a></li>
            <li v-on:click="tabType = 'wrote'"><a :class="{ on: tabType === 'wrote' }">내가 쓴 리뷰</a></li>
          </ul>
        </div>

        <div class="mypage_review_wrap">
          <template v-if="tabType === 'write'">
            <!-- 작성가능 리뷰 -->
            <ul class="review_show_wrap__list">
              <!-- 포토리뷰-->
              <li v-if="orderProducts.length > 0">
                <template v-for="(orderProduct, i) in orderProducts">
                  <div class="review_show_wrap__info_wrap" :key="`review_${i}`">
                    <!-- 상품이름 -->
                    <div><b>{{ orderProduct.product_name }}</b></div>
                    <div class="review_show_wrap__info_wrap_option">
                      <!-- 판매자 이름 -->
                      <span>{{ orderProduct.store_name_kor }}</span> ㅣ
                      <span>옵션 : [{{ orderProduct.product_option_names }}]  I  {{ orderProduct.amount | comma }}개</span></div>
                  </div>
                  <div class="review_show_wrap__img_wrap square_but_wrap text-right" :key="i">
                    <a class="line_but" v-on:click="popReview(orderProduct)">리뷰쓰기</a>
                  </div>
                </template>
              </li>
              <!-- 리뷰 없을시-->
              <li class="empty_text_wrap" v-else>작성가능한 리뷰가 존재하지 않습니다.</li>
            </ul>

            <div class="paginationWrap m_t_20 text-center w_100">
              <Pagenation :total-count="orderProductTotalCount" :page-size="orderProductPageSize" :default-page="1"
                          :page-key-name="'order_product_page'" :page-size-key-name="'order_product_page_size'"
                          :onPage="onOrderProductPage"></Pagenation>
            </div>
          </template>

          <template v-else>
            <!-- 내가 쓴 리뷰 -->
            <ul class="review_show_wrap__list w_100">
              <!-- 포토리뷰-->
              <li v-if="reviews.length > 0">
                <template v-for="(review, i) in reviews">
                  <div class="list_wrap">
                    <div class="review_show_wrap__info_wrap" :key="`review_${i}`">
                      <div>
                        <Star :readonly="true" :disabled="true" :star="review.score" :rateNumber="i" />
                        <span class="m_l_10">{{ review.score }}점</span>
                        <!-- BEST 선정시-->
                        <span class="color_r m_l_10" v-if="review.is_best">BEST</span>
                      </div>
                      <div class="review_show_wrap__info_wrap_option">
                        <span>{{ review.store_name_kor }}</span> ㅣ
                        <span>{{ review.created_at | date }}</span> ㅣ <span>옵션 : [{{ review.option_values }}]  I  {{ review.amount | comma }}개</span></div>
                      <div class="review_show_wrap__info_wrap_text">{{ review.content }}</div>
                      <div class="admin_txt" v-if="review.reply_content">
                        <p><em>판매자답변</em> {{ review.reply_content }}</p>
                      </div>
                    </div>

                    <div class="review_show_wrap__img_wrap" :key="i" v-if="review.review_type === 'PHOTO' && review.review_images.length > 0"
                         @click="showReviewPopup(review)">
                      <DefaultImage :imageUrl="review.review_images[0]" />
                    </div>
                  </div>
                </template>
              </li>

              <li class="empty_text_wrap" v-else>리뷰가 존재하지 않습니다.</li>
            </ul>

            <div class="paginationWrap m_t_20 text-center w_100">
              <Pagenation :total-count="reviewTotalCount" :page-size="reviewPageSize" :default-page="1"
                          :page-key-name="'review_page'" :page-size-key-name="'review_page_size'"
                          :onPage="onReviewPage"></Pagenation>
            </div>
          </template>

        </div>
      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/review/index.js"></script>
