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
          <div class="main_color_title">문의내역</div>
        </div>

<!--        <div class="list_title_wrap m_b_10 m_t_0">-->
<!--          <ul class="tab_menu_wrap pull-left">-->
<!--            <li><nuxt-link class="on" to="/mypage/inquiry/product">상품문의</nuxt-link></li>-->
<!--            <li><nuxt-link to="/mypage/inquiry">쇼핑몰문의</nuxt-link></li>-->
<!--          </ul>-->
<!--        </div>-->

        <div>
          <ul class="mypage_inquiry_list_wrap">
            <!-- Inquiry List START -->
            <li v-for="questionGroup in productInquiryList">
              <div class="mypage_inquiry_list_wrap__title_wrap">
                <!-- todo: 아래의 프로모션코드/이벤트 제거되어야 합니다 -->
<!--                <div>프로모션코드/이벤트</div>-->
                <div v-if="questionGroup[0].is_replied" class="color_main_01"><b>답변완료</b></div>
                <div v-else class="color_r"><b>미답변</b></div>
                <div class="pull-right mypage_inquiry_list_wrap__data_wrap">
                  <div class="m_r_20 pull-left">{{ questionGroup[0].created_at | date }}</div>
                  <div class="square_but_wrap pull-right">
                    <a href="javascript:;" @click="deleteQuestion(questionGroup[0].id)">삭제</a>
                  </div>
                </div>

                <div class="w_100 color_gray_7 m_t_20">{{ questionGroup[0].store_name_kor }}</div>
                <div class="w_100 m_b_20"><nuxt-link :to="`/product/${questionGroup[0].product_id}`">{{ questionGroup[0].product_name }}</nuxt-link></div>
              </div>
              <div class="mypage_inquiry_list_wrap__info_wrap">
                <ul>
                  <template v-for="question in questionGroup">
                    <li>
                      <span class="color_main_01 m_r_10">Q</span> {{ question.content }}
                    </li>
                    <li v-if="question.is_replied" v-for="answer in question.answers">
                      <span class="color_r m_r_10">A</span> {{ answer.content }}
                      <div class="color_gray_7 font_12">{{ answer.created_at | date }}</div>
                    </li>
                  </template>
                </ul>
              </div>

            </li>
            <!-- Inquiry List END -->
          </ul>
          <!-- Pagenation START -->
          <div class="pagenation_wrap">
            <Pagenation :total-count="totalCount" :page-size="pageSize" :default-page="defaultPage"
                        :page-key-name="'page'" :page-size-key-name="'page_size'"
                        :onPage="onProductInquiryListPage"></Pagenation>
          </div>
          <!-- Pagenation END -->
        </div>

      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/inquiry/product/index.js"></script>
