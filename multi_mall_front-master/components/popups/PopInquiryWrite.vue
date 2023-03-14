<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap width_m">
            <div class="popup_title">문의하기</div>

            <div class="popup_content_wrap">
              <ul class="list_wrap w_100" v-if="isMallInquiry">
                <li>
                  <div class="title">문의 유형</div>
                  <div class="body">
                    <select>
                      <option value="">선택</option>
                      <option v-for="(type, i) in faqTypeList" :key="`faqType_${i}`" :value="type.key">{{ type.value }}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">작성자</div>
                  <div class="body">
                    <input type="text" name="email" placeholder="이메일을 입력해주세요." v-model="params.author">
                  </div>
                </li>
                <li>
                  <div class="title">제목</div>
                  <div class="body">
                    <input type="text" placeholder="제목 입력" class="w_100" v-model="params.title">
                  </div>
                </li>
              </ul>
              <ul class="list_wrap w_100" v-else>
                <li v-if="Object.keys(data).length > 0">
                  <div class="w_100 m_b_10 color_main_01">
                    구매하시려는 상품에 대해 궁금하신 점이 있으신 경우 문의해주세요.<br>
                    <!--                    TODO 쇼핑몰 관련 문의 1차에 없음 -->
                    <!--                    상품문의 이외에 쇼핑몰 관련 문의는 <a v-on:click="pageToRedirect" class="under_line color_main_01 bold">[여기]</a>를 이용해 주시기 바랍니다.-->
                  </div>
                  <div class="title">상품명</div>
                  <div class="body">
<!--                    <div class="w_100 m_b_5">{{ data.store_name_kor }}</div>-->
                    <div class="m1_r_10">{{ data.name }} {{ data.option ? `[${data.option}] |` : '' }} {{ data.amount ? data.amount : 0 | comma }}개</div>
                  </div>
                </li>
                <li class="m_b_0">
                  <div class="title">내용 <span class="color_main_01 font_12">({{ contentLength }}/{{ maxContentLength }}자)</span></div>
                  <div class="body">
                    <textarea v-model="params.content" cols="30" rows="10" class="w_100 border_b7 p_10"></textarea>
                    <div class="checkbox_wrap m_t_10">
                      <input type="checkbox" id="agreementAll" v-model="params.is_secret">
                      <label for="agreementAll">비밀글로 문의하기</label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">작성</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    data: {
      type: Object,
      default: {},
    },
    isMallInquiry: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    maxContentLength: 500,
    faqTypeList: [],
    params: {
      faq_type: '',
      author: '',
      title: '',
      is_secret: false,
      content: '',
    },
  }),
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
    contentLength() {
      return this.params.content.length;
    },
  },
  async created() {
    if (this.isMallInquiry) {
      await this.$store.dispatch('common/getCodes', 'faq_type');
      this.faqTypeList = this.codesArray('faq_type');
    }
  },
  methods: {
    checkData() {
      if (this.params.content) this.params.content = this.params.content.trim();
      if (!this.params.content) return this.$popup.showAlertPopup('문의 내용을 입력해주세요.');
      if (this.params.content.length > this.maxContentLength) return this.$popup.showAlertPopup('입력 가능한 글자수를 초과하였습니다.');
      return true;
    },
    ok() {
      if (this.okCallback) {
        const check = this.checkData();
        if (check) {
          this.okCallback(this.params);
        }
      }
    },
    pageToRedirect() {
      this.$router.push({ name: 'mypage-inquiry' });
    },
  },
});
</script>
