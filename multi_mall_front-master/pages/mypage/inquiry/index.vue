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

        <div class="list_title_wrap">
          <div class="mypage_info_wrap">
            <div class="main_color_title">문의내역</div>
          </div>
<!--          <ul class="tab_menu_wrap pull-left">-->
<!--            <li><nuxt-link to="/mypage/inquiry/product">상품문의</nuxt-link></li>-->
<!--            <li><nuxt-link class="on" to="/mypage/inquiry">쇼핑몰문의</nuxt-link></li>-->
<!--          </ul>-->
        </div>

        <div class="d_ib_100">
          <data-table
            ref="dataTable"
            :loading="loading"
            :headers="headers"
            :items="inquiryList"
            :total="totalCount"
            :onTableOption="onTableOption"
            selectType="multi"
            :defaultPageSize="pageSize"
            hideDefaultFooter="true"
          >
            <template v-slot:body="{item}">
              <td><span class="text">기타</span></td>
              <td><span class="text">미답변</span></td>
              <td><span class="text">제목</span></td>
              <td><span class="text">작성일</span></td>
            </template>
          </data-table>
        </div>

        <!-- 쇼핑몰 문의하기 일때 -->
        <div class="but_wrap text-right m_t_20">
          <!-- 1차에는 faq 페이지 없음 -->
<!--          <nuxt-link to="/cs/faq">FAQ</nuxt-link>-->
<!--          <a v-on:click="createInquiry">문의하기</a>-->
        </div>

      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/inquiry/index.js"></script>
