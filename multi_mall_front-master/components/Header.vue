<template>
  <div class="nav_wrap">
    <div>
      <div class="top_header">
        <v-container>
          <nuxt-link to="/user/regist">
            <div><img alt="회원가입시 적립금 2000원" src="@/assets/img/user/icon/icon_regist.png"> 지금 몰리 회원가입시 최대 <b>2000</b> 포인트 지급 <b>회원가입 바로가기 ></b></div>
          </nuxt-link>
        </v-container>
      </div>
      <div class="bottom_nav_wrap">
        <v-container class="p_t_0 p_b_0 bottom_nav_wrap__flex_wrap ">
          <div class="logo_wrap">
            <nuxt-link to="/main"><img alt="company logo" src="@/assets/img/admin/molly_logo.svg"/></nuxt-link>
          </div>

          <div class="main_search_wrap" v-on:click="searchBox('topNav')">
            <input type="text" autocomplete="off" placeholder="검색어를 입력해주세요." id="searchBox" v-model="keyword" v-on:keypress.enter="search"/>
<!--            <label for="searchBox">오늘은 <span class="main_c_b">{{ placeholderKeyword }}</span>를 검색해볼까요?</label>-->
            <a v-on:click="search"><img alt="company logo" src="@/assets/img/user/icon/m_search_black.png"/></a>
          </div>

          <div class="latest_search_word_wrap" v-show="isVisibleSearchBox" v-on:mouseleave="setActiveSearchBox('topNav')">
            <div class="wrap_title"><span class="main_c_b">인기</span> 검색어</div>
            <div class="popularity_keywords_wrap">
              <ul>
                <li v-for="(keyword, i) in popularityKeywords" :key="i">
                  <b :class="i <= 2 ? 'main_c_b':''">{{i + 1}}. </b>
                  <a v-on:click="setKeywordAndSearch(keyword)">{{keyword}}</a>
                </li>
              </ul>
            </div>
            <div class="bar"></div>
            <div class="wrap_title"><span class="main_c_b">최근</span> 검색어</div>
            <div class="search_word_empty" v-if="keywords.length === 0">최근 검색어 내역이 없습니다.</div>
            <div class="latest_search_word_box">
              <ul v-if="keywords.length > 0">
                <li v-for="(keyword, i) in keywords" :key="i">
                  <a class="keyword" :id="`${keyword.q}_${i}`" v-on:click="searchKeyword">{{ keyword.q }}</a>
                  <a class="delete_icon" v-on:click="deleteKeyword" :id="`deleteIcon_${i}`"><img
                    src="@/assets/img/user/icon/main_close_icon.png" :id="`deleteKeyword_${i}`"/></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="top_nav_wrap">

            <ul class="pull-right">
              <!-- LOG ON -->
              <template v-if="isUserLogin">
                <li><a v-on:click="logout">LOGOUT</a></li>
                <li class="m_r_40">
                  <nuxt-link to="/cart" class="cart_wrap">
                    <span>CART</span>
                    <span class="cart_wrap__cart_icon">{{ carts.length }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/mypage/order">주문조회</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/mypage/info">MY PAGE</nuxt-link>
                </li>
              </template>
              <!-- LOG OFF -->
              <template v-else>
                <li>
                  <nuxt-link to="/user/login">LOGIN</nuxt-link>
                </li>
                <li class="tooltip_wrap">
                  <nuxt-link to="/user/regist">
                    <span>JOIN</span>
                    <div class="tooltip_wrap__join_point">2000P</div>
                  </nuxt-link>
                </li>
                <li class="m_r_40">
                  <nuxt-link to="/cart" class="cart_wrap">
                    <span>CART</span>
                    <span class="cart_wrap__cart_icon">{{ carts.length }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/user/login">주문조회</nuxt-link>
                </li>
              </template>
              <!-- 1차에는 고객센터 없음 -->
              <!--      <li><nuxt-link to="/cs/faq">고객센터</nuxt-link></li>-->
            </ul>
              <!--        <ul>-->
              <!--          <li><nuxt-link to="/store/request/check">입점/제휴문의</nuxt-link></li>-->
              <!--        </ul>-->
          </div>
        </v-container>
      </div>
      <div class="main_category_wrap">
        <v-container>
          <div class="all_list_wrap">
            <div class="all_but_wrap">
              <a :class="isVisible ? 'total_depth open' : 'total_depth'" v-on:click="setMenuVisible('topNav')">전체보기</a>
            </div>
            <div>
              <ul class="one_depth" :class="isVisible ? 'active' : ''">
                <li
                  v-for="(menu, idx) in oneDepthMenu"
                  :key="`one_depth_${idx}`"
                  v-on:mouseenter="setMenuVisibleByLevel(menu, 2)"
                  v-on:click="pageToCategory(menu.id)"
                  :class="menu.id === menuPath[0] ? 'on' : ''"
                ><span>{{ menu.name }}</span>
                </li>
              </ul>
              <ul class="two_depth" :class="isVisible && twoDepthMenu.length > 0 ? 'active' : ''">
                <li
                  v-for="(menu, idx) in twoDepthMenu"
                  :key="`two_depth_${idx}`"
                  v-on:mouseenter="setMenuVisibleByLevel(menu, 3)"
                  v-on:click="pageToCategory(menu.id)"
                  :class="menu.id === menuPath[1] ? 'on' : ''"
                ><span>{{ menu.name }}</span>
                </li>
              </ul>
              <ul class="three_depth" :class="isVisible && threeDepthMenu.length > 0 ? 'active' : ''">
                <li
                  v-for="(menu, idx) in threeDepthMenu"
                  :key="`three_depth_${idx}`"
                  v-on:mouseenter="setMenuVisibleByLevel(menu, 4)"
                  v-on:click="pageToCategory(menu.id)"
                  :class="menu.id === menuPath[2] ? 'on' : ''"
                ><span>{{ menu.name }}</span>
                </li>
              </ul>
              <ul class="fourth_depth" :class="isVisible && fourDepthMenu.length > 0 ? 'active' : ''">
                <li
                  v-for="(menu, idx) in fourDepthMenu"
                  :key="`fourth_depth_${idx}`"
                  v-on:mouseenter="setMenuVisibleByLevel(menu, 5)"
                  :class="menu.id === menuPath[3] ? 'on' : ''"
                  v-on:click="pageToCategory(menu.id)"
                ><span>{{ menu.name }}</span>
                </li>
              </ul>
            </div>
          </div>

          <ul class="category_wrap">
            <li><nuxt-link to="/main">HOME</nuxt-link></li>
            <li><nuxt-link to="/store">STORE</nuxt-link></li>
            <li><nuxt-link to="/store/42">리퍼샵</nuxt-link></li>
            <li><nuxt-link to="/price_group" class="price_icon color_main_01 point">가격비교</nuxt-link></li>
          </ul>
        </v-container>
      </div>
    </div>

    <!--  스크롤했을때 내려온다.  -->
    <div class="scroll_nav_wrap" :class="scrollNavActive? 'on':''">
      <div>
        <v-container>
          <div class="main_category_wrap">
            <div class="all_list_wrap">
              <div class="all_but_wrap">
                <a :class="isVisibleScrollNav ? 'total_depth open' : 'total_depth'" v-on:click="setMenuVisible('scrollNav')">카테고리 전체보기</a>
              </div>
              <div>
                <ul class="one_depth" :class="isVisibleScrollNav ? 'active' : ''">
                  <li
                    v-for="(menu, idx) in oneDepthMenu"
                    :key="`one_depth_${idx}`"
                    v-on:mouseenter="setMenuVisibleByLevel(menu, 2)"
                    v-on:click="pageToCategory(menu.id)"
                    :class="menu.id === menuPath[0] ? 'on' : ''"
                  ><span>{{ menu.name }}</span>
                  </li>
                </ul>
                <ul class="two_depth" :class="isVisibleScrollNav && twoDepthMenu.length > 0 ? 'active' : ''">
                  <li
                    v-for="(menu, idx) in twoDepthMenu"
                    :key="`two_depth_${idx}`"
                    v-on:mouseenter="setMenuVisibleByLevel(menu, 3)"
                    v-on:click="pageToCategory(menu.id)"
                    :class="menu.id === menuPath[1] ? 'on' : ''"
                  ><span>{{ menu.name }}</span>
                  </li>
                </ul>
                <ul class="three_depth" :class="isVisibleScrollNav && threeDepthMenu.length > 0 ? 'active' : ''">
                  <li
                    v-for="(menu, idx) in threeDepthMenu"
                    :key="`three_depth_${idx}`"
                    v-on:mouseenter="setMenuVisibleByLevel(menu, 4)"
                    v-on:click="pageToCategory(menu.id)"
                    :class="menu.id === menuPath[2] ? 'on' : ''"
                  ><span>{{ menu.name }}</span>
                  </li>
                </ul>
                <ul class="fourth_depth" :class="isVisibleScrollNav && fourDepthMenu.length > 0 ? 'active' : ''">
                  <li
                    v-for="(menu, idx) in fourDepthMenu"
                    :key="`fourth_depth_${idx}`"
                    v-on:mouseenter="setMenuVisibleByLevel(menu, 5)"
                    :class="menu.id === menuPath[3] ? 'on' : ''"
                    v-on:click="pageToCategory(menu.id)"
                  ><span>{{ menu.name }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <ul class="category_wrap">
              <li><nuxt-link to="/main">HOME</nuxt-link></li>
              <li><nuxt-link to="/store">STORE</nuxt-link></li>
              <li><nuxt-link to="/store/42">리퍼샵</nuxt-link></li>
              <li><nuxt-link to="/price_group" class="price_icon color_main_01">가격비교</nuxt-link></li>
            </ul>
          </div>
          <div class="bottom_nav_wrap">

            <div class="main_search_wrap" v-on:click="searchBox('scrollNav')">
              <input type="text" autocomplete="off" id="searchBoxScroll" placeholder="검색어를 입력해주세요." v-model="keyword" v-on:keypress.enter="search" />
<!--              <label for="searchBoxScroll">오늘은 <span class="main_c_b">{{ placeholderKeyword }}</span>를 검색해볼까요?</label>-->
              <a v-on:click="search"><img alt="company logo" src="@/assets/img/user/icon/m_search_black.png" /></a>
            </div>
            <div class="latest_search_word_wrap latest_search_word_wrap_scroll" v-show="isVisibleSearchBoxScrollNav" v-on:mouseleave="setActiveSearchBox('scrollNav')">
              <div class="wrap_title"><span class="main_c_b">최근</span> 검색어</div>
              <div class="search_word_empty" v-if="keywords.length === 0">최근 검색어 내역이 없습니다.</div>
              <div class="latest_search_word_box">
                <ul v-if="keywords.length > 0">
                  <li v-for="(keyword, i) in keywords" :key="i">
                    <a class="keyword" :id="`${keyword.q}_${i}`" v-on:click="searchKeyword">{{ keyword.q }}</a>
                    <a class="delete_icon" v-on:click="deleteKeyword" :id="`deleteIcon_${i}`"><img src="@/assets/img/user/icon/main_close_icon.png" :id="`deleteKeyword_${i}`" /></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="top_nav_wrap">
            <!--        <ul>-->
            <!--          <li><nuxt-link to="/store/request/check">입점/제휴문의</nuxt-link></li>-->
            <!--        </ul>-->
            <ul>
              <!-- LOG ON -->
              <template v-if="isUserLogin">
                <li><a v-on:click="logout">LOGOUT</a></li>
                <li class="m_r_40">
                  <nuxt-link to="/cart" class="cart_wrap">
                    <span>CART</span>
                    <span class="cart_wrap__cart_icon">{{ carts.length }}</span>
                  </nuxt-link>
                </li>
                <li><nuxt-link to="/mypage/order">주문조회</nuxt-link></li>
                <li><nuxt-link to="/mypage/info">MY PAGE</nuxt-link></li>
              </template>
              <!-- LOG OFF -->
              <template v-else>
                <li><nuxt-link to="/user/login">LOGIN</nuxt-link></li>
                <li class="tooltip_wrap"><nuxt-link to="/user/regist"><span>JOIN</span></nuxt-link></li>
                <li class="m_r_40">
                  <nuxt-link to="/cart" class="cart_wrap">
                    <span>CART</span>
                    <span class="cart_wrap__cart_icon">{{ carts.length }}</span>
                  </nuxt-link>
                </li>
                <li><nuxt-link to="/user/login">주문조회</nuxt-link></li>
              </template>
              <!-- 1차에는 고객센터 없음 -->
              <!--      <li><nuxt-link to="/cs/faq">고객센터</nuxt-link></li>-->
            </ul>
          </div>
        </v-container>
      </div>
    </div>

  </div>
</template>

<script>
import Utils from '@/plugins/utils';
import Popup from '@/components/popups/popup';
import moment from 'moment-timezone';
import { mapGetters } from 'vuex';
import _ from 'lodash';

moment.tz.setDefault('Asia/Seoul');
const JWT = 'jwt';
const LOGIN_TARGET = 'lgn_tgt';

export default {
  name: 'Header',
  data: () => ({
    keyword: '',
    keywords: [],
    isVisibleSearchBox: false,
    isVisibleSearchBoxScrollNav: false,
    isVisible: false,
    isVisibleScrollNav: false,
    categories: [],
    oneDepthMenu: [],
    twoDepthMenu: [],
    threeDepthMenu: [],
    fourDepthMenu: [],
    menuPath: ['', '', '', ''],
    isUserLogin: false,
    isCategoryRetrieve: false,
    scrollNavActive: false,

    popularityKeywords: [
      '트위드자켓',
      '원피스',
      '나이키운동화',
      '탈모샴푸',
      '가습기',
      '공기청정기',
      '헹거',
      '게이밍의자',
      '포켓몬카드',
      '비타민',
    ],
    placeholderKeyword: '',
  }),
  created() {
    this.init();
  },
  computed: {
    ...mapGetters({
      carts: 'cart/carts',
    }),
  },
  activated() {
    this.init();
    this.checkLogin();
  },
  beforeMount() {
    this.checkLogin();
  },
  mounted() {
    window.onclick = (e) => {
      this.setMenus(e);
    };
    window.addEventListener('scroll', this.handleScroll);
    this.randomKeyword();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // init
    init() {
      const query = { ...this.$route.query };
      if (query.q) this.keyword = query.q;
      else this.keyword = '';
      this.isVisible = false;
      this.isVisibleScrollNav = false;
    },
    checkLogin() {
      const jwt = Utils.getCookie(document.cookie, JWT);
      if (jwt) {
        const userInfo = JSON.parse(atob(jwt.split('.')[1]));
        const userGrade = userInfo.info.split('_')[1];
        if (userGrade === '0') this.isUserLogin = true;
      } else {
        this.isUserLogin = false;
      }
      if (this.isUserLogin) this.$store.dispatch('cart/get_carts');
      else this.getUnknownCarts();
    },
    logout() {
      if (this.isUserLogin) {
        Utils.removeCookie(JWT);
        Utils.removeCookie(LOGIN_TARGET);
      }
      const currentPath = this.$router.currentRoute.path;
      if (currentPath.indexOf('main') > -1) this.$router.go(0);
      else this.$router.push({ name: 'main' });
    },
    async getUnknownCarts() {
      const cookie = document.cookie;
      let unknownCartsStr = await Utils.getCookie(cookie, 'unknown_carts');
      if (unknownCartsStr) {
        unknownCartsStr = decodeURIComponent(unknownCartsStr);
        const unknownCarts = JSON.parse(unknownCartsStr);
        if (unknownCarts.length > 0) {
          await this.$store.dispatch('cart/get_unknown_carts', { unknown_carts: unknownCarts });
        }
      }
    },
    async getProducts() {
      const query = { q: this.keyword };
      const currentPath = this.$router.currentRoute.name;
      if (currentPath === 'price_group') {
        this.$router.push({ query });
      } else {
        this.$router.push({ name: 'price_group', query });
      }
    },
    setActiveSearchBox(e) {
      if (e === 'scrollNav') {
        this.isVisibleSearchBoxScrollNav = false;
      } else {
        this.isVisibleSearchBox = false;
      }
    },
    searchBox(e) {
      if (e === 'scrollNav') {
        this.isVisibleSearchBoxScrollNav = true;
      } else {
        this.isVisibleSearchBox = true;
      }

      const keywordList = Utils.getCookie(document.cookie, 'q');
      if (keywordList) this.keywords = JSON.parse(keywordList);
    },
    search() {
      const keyword = this.keyword;

      if (keyword) {
        const isSameKeyword = Array.prototype.find.call(this.keywords, (key) => key.q === keyword);
        if (!isSameKeyword) {
          const now = moment().format();
          this.keywords.push({ q: this.keyword, day: now });
          Utils.addCookie('q', JSON.stringify(this.keywords));
        }
        this.isVisibleSearchBox = false;
        this.isVisibleSearchBoxScrollNav = false;
        this.getProducts();
      }
    },
    searchKeyword(e) {
      const id = e.target.id;
      const idx = id.split('_')[1];
      const now = moment().format();

      this.keyword = id.split('_')[0];
      this.keywords.splice(idx, 1);
      this.keywords.unshift({ q: this.keyword, day: now });

      Utils.addCookie('q', JSON.stringify(this.keywords));

      this.getProducts();
    },
    deleteKeyword(e) {
      const idx = e.target.id.split('_')[1];
      this.keywords.splice(idx, 1);
      Utils.addCookie('q', JSON.stringify(this.keywords));
    },
    setMenus(e) {
      const className = e.target.className;
      if ((this.isVisible || this.isVisibleScrollNav) && className.indexOf('total_depth') === -1) {
        this.isVisible = false;
        this.isVisibleScrollNav = false;
        this.twoDepthMenu = [];
        this.threeDepthMenu = [];
        this.fourDepthMenu = [];
        this.menuPath = ['', '', '', ''];
      }
    },
    async setMenuVisible(target) {
      if (this.oneDepthMenu.length === 0) {
        const res = await this.$axios.get('user/category/path', { path: null, level: 1 });
        this.oneDepthMenu = res.data.data.categories;
        this.categories = res.data.data.categories;
      }
      if (target === 'scrollNav') {
        this.isVisibleScrollNav = !this.isVisibleScrollNav;
      } else {
        this.isVisible = !this.isVisible;
      }
    },
    initMenu(menu, level) {
      switch (level) {
        case 2:
          this.menuPath = [menu.id, '', '', ''];
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
          break;
        case 3:
          this.menuPath = [this.menuPath[0], menu.id, '', ''];
          this.fourDepthMenu = [];
          break;
        case 4:
          this.menuPath = [this.menuPath[0], this.menuPath[1], menu.id, ''];
          break;
        default:
          this.menuPath = [menu.id, '', '', ''];
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
      }
    },
    setMenu(data) {
      switch (data.level) {
        case 3:
          this.twoDepthMenu = data.categories;
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
          break;
        case 4:
          this.threeDepthMenu = data.categories;
          this.fourDepthMenu = [];
          break;
        case 5:
          this.fourDepthMenu = data.categories;
          break;
        default:
          this.twoDepthMenu = data.categories;
          this.threeDepthMenu = [];
          this.fourDepthMenu = [];
      }
    },
    // recursive하게 category 조회
    findCategoryByLevel(targetLevel, level = null, targetCategories = []) {
      if (targetCategories && targetCategories.length > 0) {
        const menuPath = this.menuPath.filter((n) => n);
        const category = _.find(targetCategories, (tc) => tc.id === menuPath[level - 2]);
        if (category) {
          if (targetLevel === level) {
            return category;
          }

          return this.findCategoryByLevel(targetLevel, level + 1, category.children);
        }

        return null;
      }

      return null;
    },
    async setMenuVisibleByLevel(menu, level) {
      if (!this.isCategoryRetrieve) {
        this.isCategoryRetrieve = true;
        // menu 데이터 셋팅
        if (level < 5) {
          // menu 초기화
          this.initMenu(menu, level);
          // search category in memory
          const category = this.findCategoryByLevel(level, 2, this.categories);
          if (category && !category.children) {
            const res = await this.$axios.get(`user/category/path?path=${this.menuPath.filter((n) => n).join(',')}&level=${level}`);
            category.children = res.data.data.categories;
          }

          this.setMenu({
            level: level + 1,
            categories: category ? category.children : [],
          });
        }
        this.isCategoryRetrieve = false;
      }
    },
    async pageToCategory(categoryId) {
      await this.$router.push({ name: 'price_group', query: { cate: categoryId } });
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },

    handleScroll() {
      const scrollTop = document.documentElement.scrollTop; // 현재 스크롤바 위치
      const fullHeight = document.body.scrollHeight; //  margin 값은 포함 x
      // 헤더 270 + 네비게이션 뎁스 360 + 간격 20 만큼 내려왔을때, 페이지 전체 높이가 1500 보다 클때
      this.scrollNavActive = fullHeight > 1500 && scrollTop > 650;
    },

    randomKeyword() {
      const randomIndex = Math.floor(Math.random() * 10);
      this.placeholderKeyword = '';
      this.placeholderKeyword = this.popularityKeywords[randomIndex];
    },

    setKeywordAndSearch(keyword) {
      this.keyword = keyword;
      this.search();
    },

  },
};
</script>

<style scoped></style>
