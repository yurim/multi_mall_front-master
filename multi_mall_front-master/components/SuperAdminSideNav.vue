<template>
    <div class="admin_side_nav_wrap">
        <ul id="adminSideNav">

            <li @click="clickLi(menu.name, menu.path)" v-for="menu in menus" :key="menu.name"
                v-bind:class="{open: currentOpen===menu.name || $route.path.includes(menu.path)}">
                <a href="javascript:;">{{menu.name}}</a>
                <ul>
                    <li v-for="child in menu.child" :key="child.name">
                      <nuxt-link :to="menu.path + child.path" :class="{'nuxt-link-active': `${menu.path}${child.path}` === $route.path}">
                        {{child.name}}</nuxt-link>
                    </li>
                </ul>
            </li>

        </ul>
    </div>
</template>

<script>

export default {
  name: 'SuperAdminSideNav',
  data: () => ({
    currentOpen: null,

    menus: [
      {
        name: '입점매장관리',
        path: '/super_admin/store',
        child: [
          { name: '입점 매장 목록', path: '/' },
          { name: '입점 매장 등록', path: '/new' },
          // { name: '입점 매장 공지사항', path: '' },
        ],
      }, {
        name: '상품관리',
        path: '/super_admin/product',
        child: [
          { name: '상품목록', path: '/' },
          { name: '해외 상품리뷰 관리', path: '/review/abroad' },
          { name: '국내 상품리뷰 관리', path: '/review/domestic' },
          { name: '상품문의', path: '/qna' },
          { name: '상품 가격비교 그룹 관리', path: '/price_group' },
          // { name: 'NEW 상품관리', path: '' },
          // { name: 'BEST 상품관리', path: '' },
        ],
      }, {
        name: '판매관리',
        path: '/super_admin/sales',
        child: [
          { name: '주문조회', path: '/order' },
          { name: '미결제 확인', path: '/not_paid' },
          { name: '발주/발송 관리', path: '/dispatch' },
          { name: '배송현황 관리', path: '/delivery' },
          { name: '구매확정 내역', path: '/decide' },
          { name: '취소관리', path: '/cancel' },
          { name: '반품관리', path: '/return_delivery' },
          { name: '교환관리', path: '/exchange' },
          { name: '배송대행신청', path: '/amazic9' },
        ],
      },
      // {
      //   name: '메인화면관리',
      //   path: '',
      //   child: [
      //     { name: 'PC/웹', path: '' },
      //     { name: '추가메뉴관리', path: '' },
      //   ],
      // },
      // {
      //   name: '추천관리',
      //   path: '',
      //   child: [
      //     { name: '카테고리 추천', path: '' },
      //     { name: '스토어 추천', path: '' },
      //     { name: '상품 추천', path: '' },
      //     { name: '테그 추천', path: '' },
      //   ],
      // },
      {
        name: '카테고리설정',
        path: '/super_admin/category',
        child: [
          { name: '카테고리 설정', path: '/' },
        ],
      },
      // {
      //   name: '이벤트관리',
      //   path: '',
      // }, {
      //   name: '특가관리',
      //   path: '',
      // }, {
      //   name: '게시판관리',
      //   path: '',
      //   child: [
      //     { name: '사용자 공지사항', path: '' },
      //     { name: '사용자 1:1 문의', path: '' },
      //     { name: '사용자 FAQ', path: '' },
      //   ],
      // },
      {
        name: '정산관리',
        path: '/super_admin/calculation',
        child: [
          { name: '정산내역', path: '/history' },
          // { name: '정산/세금계산서 발행', path: '' },
        ],
      }, {
        name: '유저관리',
        path: '/super_admin/user',
        child: [
          { name: '회원관리', path: '/' },
          // { name: '탈퇴회원', path: '' },
        ],
      },
      // {
      //   name: '제재 관리',
      //   path: '',
      // }, {
      //   name: '고객혜택 관리',
      //   path: '',
      //   child: [
      //     { name: '고객혜택 목록', path: '' },
      //     { name: '고객혜택 사용내역', path: '' },
      //   ],
      // }, {
      //   name: '통계',
      //   path: '',
      // }, {
      //   name: '메뉴얼관리',
      //   path: '',
      // },
      {
        name: '쇼핑몰관리',
        path: '/super_admin/site',
        child: [
          { name: '쇼핑몰정보', path: '/info' },
          { name: '택배사관리', path: '/couriers' },
          { name: '약관관리', path: '/agreement/terms' },
          { name: '비밀번호 변경', path: '/password/check' },
        ],
      },
      {
        name: '해외쇼핑몰관리',
        path: '/super_admin/target',
        child: [
          { name: '속성관리', path: '/info' },
        ],
      },
      // {
      //   name: '업체문의사항관리',
      //   path: '',
      //   child: [
      //     { name: '입점 매장 목록', path: '' },
      //     { name: '입점 매장 공지사항', path: '' },
      //   ],
      // }, {
      //   name: '업체 패널티관리',
      //   path: '',
      // },
    ],
  }),
  methods: {
    clickLi(name, path) {
      const isCurrentPath = this.$route.path.includes(path);
      if (!isCurrentPath) {
        if (this.currentOpen === name) this.currentOpen = null;
        else this.currentOpen = name;
      }
    },
  },
};
</script>

<style scoped>
</style>
