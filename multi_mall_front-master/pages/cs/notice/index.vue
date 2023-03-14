<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>

        <div class="list_title_wrap">
          <span>NOTICE</span>
          <ul class="tab_menu_wrap">
            <li><nuxt-link to="/cs/notice" class="on">NOTICE</nuxt-link></li>
            <!-- 1차 끝나고 FAQ 생김 -->
            <li><nuxt-link to="/cs/faq">FAQ</nuxt-link></li>
          </ul>
        </div>

        <div class="text-center d_ib_100 search_icon_wrap">
          <input
            type="text"
            class="text-left d_ib"
            id="search"
            placeholder="공지사항 검색"
            v-on:keyup.enter="onSearch"
          />
          <a id="search_btn" v-on:click="onSearch">검색</a>
          <div class="font_12 color_r" v-if="message">{{ message }}</div>
        </div>

        <div class="notice_list_wrap">
          <table>
            <colgroup>
              <col width="60">
              <col>
              <col width="30">
            </colgroup>
            <tbody>
              <tr v-for="(notice, i) in notices" :key="i">
                <td>{{ (i + 1) + (default_page - 1) * pageSize }}</td>
                <td>
                  <div>[공지]{{ notice.title }}</div>
                  <div :id="`content_${i}`" style="display: none;" class="m_t_10">{{ notice.content }}</div>
                </td>
                <td class="text-center">
<!--                  TODO 클릭하면 arrow_wrap에 .on 들어가야함 -->
                  <a v-on:click="contentShow(i)" class="arrow_wrap">
                    <img alt="텍스트 펼치기 아래화살표 아이콘" src="@/assets/img/icon/icon_arrow_main_color.png">
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagenation_wrap">
          <Pagenation
            :total-count="totalCount"
            :page-size="pageSize"
            :default-page="default_page"
            :page-key-name="'page'"
            :page-size-key-name="'page_size'"
            :onPage="onPage"
          />
        </div>
      </div>

    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/cs/notice/index.js"></script>
