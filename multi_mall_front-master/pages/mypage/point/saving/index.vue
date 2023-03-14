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

        <div>
          <div class="mypage_info_wrap">
            <div class="main_color_title">포인트 내역</div>
            <div class="border_b_dark p_b_10">
              <span>총 포인트</span>
              <span class="pull-right">{{ current_point | comma }}원</span>
            </div>
          </div>
        </div>

        <div class="list_title_wrap m_b_10">
          <ul class="tab_menu_wrap pull-left">
            <li><a class="on">적립 내역</a></li>
            <li><nuxt-link to="/mypage/point/using">차감 내역</nuxt-link></li>
          </ul>
        </div>
        <div>
          <table>
            <colgroup>
              <col width="120" />
              <col />
              <col width="120" />
            </colgroup>
            <thead>
              <tr>
                <th>일시</th>
                <th>내용</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody v-if="savingHistory && savingHistory.length > 0">
              <tr v-for="(history, i) in savingHistory" :key="i">
                <td>{{ $moment(history.created_at).format("YYYY-MM-DD") }}</td>
                <td>{{ history.save_type }}</td>
                <td>+{{ history.point | comma }}원</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">적립내역이 없습니다.</td>
              </tr>
            </tbody>
          </table>
          <div class="pagenation_wrap">
            <Pagenation :total-count="totalCount" :page-size="pageSize" :default-page="defaultPage"
                        :page-key-name="'page'" :page-size-key-name="'page_size'" :onPage="onPage" />
          </div>
        </div>
      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/point/saving/index.js"></script>
