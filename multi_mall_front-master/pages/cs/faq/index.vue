<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>

        <div class="list_title_wrap">
          <span>FAQ</span>
          <ul class="tab_menu_wrap">
            <li><nuxt-link to="/cs/notice">NOTICE</nuxt-link></li>
            <li><nuxt-link to="/cs/faq" class="on">FAQ</nuxt-link></li>
          </ul>
        </div>
        <div class="list_title_wrap m_t_0">
          <ul class="tab_menu_wrap">
            <li v-for="(type, i) in faqType" :key="i">
              <a :class="type.isChecked ? 'on' : ''" :id="i" v-if="type.isChecked">{{ type.value }}</a>
              <a :class="type.isChecked ? 'on' : ''" :id="i" v-on:click="faqTypeChange" v-else>{{ type.value }}</a>
            </li>
          </ul>
        </div>

        <div class="text-center d_ib_100 search_icon_wrap">
          <input
            type="text"
            class="text-left d_ib"
            id="search"
            placeholder="자주 묻는 질문 검색"
            v-model="q"
            v-on:keyup.enter="onSearch"
          />
          <a id="search_btn" v-on:click="onSearch">검색</a>
          <div class="font_12 color_r" v-if="message">{{ message }}</div>
        </div>

        <div class="notice_list_wrap">
          <table>
            <colgroup>
              <col width="60">
              <col width="150">
              <col>
              <col width="30">
            </colgroup>
            <tbody>
              <tr v-for="(faq, i) in faqList" :key="i">
                <td>{{ (i + 1) + (default_page - 1) * pageSize }}</td>
                <td>[{{ faq.faq_type }}]</td>
                <td>
                  <div>{{ faq.title }}</div>
                  <div :id="`content_${i}`" style="display: none;" class="m_t_10">{{ faq.content }}</div>
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
<script src="@/assets/javascripts/cs/faq/index.js"></script>
