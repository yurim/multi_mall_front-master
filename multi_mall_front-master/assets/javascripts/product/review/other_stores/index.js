import { mapGetters } from 'vuex';

const prefix = 'price_group/_id/other_store_product_review';

export default {
  props: {
    groupId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      scoreSlide: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 5,
        navigation: {
          nextEl: '.text_review_slide_prev',
          prevEl: '.text_review_slide_next',
        },
      },

      photoReviewSlide: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 5,
        freeMode: true,
        loop: true,
        navigation: {
          nextEl: '.photo_review_slide_next',
          prevEl: '.photo_review_slide_prev',
        },
      },

      // photo reviews
      photoReviews: [],
      photoReviewPageSize: 2,
      photoReviewCurrPage: 1,
    };
  },
  computed: {
    ...mapGetters({
      reviews: `${prefix}/reviews`,
      abroadReviews: `${prefix}/abroadReviews`,
      resPhotoReview: `${prefix}/resPhotoReview`,
      productScores: `${prefix}/productScores`,
    }),
  },
  async created() {
    await this.initPhotoReviews();
    await this.getNextPhotoReview(); // 다른 상품 포토리뷰 2페이지 미리 로드
  },
  methods: {
    initPhotoReviews() {
      this.photoReviews = this.resPhotoReview.reviews;
    },

    async getPhotoReviews() {
      this.photoReviewCurrPage += 1;
      const data = {
        groupId: this.groupId,
        query: {
          page: this.photoReviewCurrPage,
          pageSize: this.photoReviewPageSize,
        },
      };
      await this.$store.dispatch(`${prefix}/getOtherProductPhotoReviews`, data);
      this.photoReviews.push(...this.resPhotoReview.reviews);
    },
    async getPhotoAbroadReviews() {
      const data = {
        groupId: this.groupId,
        query: {
          cursor: this.resPhotoReview.nextCursor,
          pageSize: this.photoReviewPageSize,
        },
      };
      await this.$store.dispatch(`${prefix}/getOtherProductPhotoAbroadReviews`, data);
      this.photoReviews.push(...this.resPhotoReview.reviews);
    },

    /**
     * 포토 리뷰 swiper 페이지네이션
     * - 국내 포토리뷰 -> 해외 포토리뷰 순으로 조회
     * - 국내 포토리뷰 조회 완료(마지막 페이지) 시 해외 포토리뷰 조회 시작
     * - resPhotoReview.type 으로 스위칭
     *   - default : 국내 포토리뷰
     *   - abroad : 해외 포토리뷰
     */
    async getNextPhotoReview() {
      if (this.resPhotoReview.target === 'default') { // 현재 조회중인 포토리뷰는 국내리뷰
        if (this.resPhotoReview.reviews.length === this.photoReviewPageSize) { // 국내 포토리뷰 다음페이지 조회
          await this.getPhotoReviews();
        } else { // 국내 포토리뷰 조회 완료, 해외 포토리뷰 조회
          await this.getPhotoAbroadReviews();
        }
      } else { // 현재 조회중인 포토리뷰는 해외리뷰
        // eslint-disable-next-line no-lonely-if
        if (this.resPhotoReview.reviews.length === this.photoReviewPageSize) { // 해외 포토리뷰 다음페이지 조회
          await this.getPhotoAbroadReviews();
        }
      }
    },
  },
};
