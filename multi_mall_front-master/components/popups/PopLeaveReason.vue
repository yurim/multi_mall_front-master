<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">정말 탈퇴하시겠습니까?</div>
<!--            TODO 2차 -->
<!--            <div class="popup_text_wrap font_14 explain">회원탈퇴를 요청하기 위한 유형과 사유를 입력해주세요.</div>-->
<!--            <div class="popup_text_wrap">-->
<!--              <div class="color_main_01"><b>탈퇴 유형</b></div>-->
<!--              <div>-->
<!--                <select v-model="params.leave_type">-->
<!--                  <option value="">유형 선택</option>-->
<!--                  <option v-for="(type, i) in leaveType" :key="i" :value="type.key">{{ type.value }}</option>-->
<!--                </select>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="popup_text_wrap">-->
<!--              <div class="color_main_01"><b>사유 입력</b></div>-->
<!--              <div>-->
<!--                <textarea v-model="params.reason" rows="3" placeholder="내용을 입력해주세요."></textarea>-->
<!--              </div>-->
<!--            </div>-->
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">확인</button>
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
  data: () => ({
    leaveType: [],
    params: {
      leave_type: '',
      reason: '',
    },
  }),
  async created() {
    if (this.leaveType.length === 0) {
      await this.$store.dispatch('common/getCodes', 'leave_type');
      this.leaveType = this.codesArray('leave_type');
    }
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
  },
});
</script>
