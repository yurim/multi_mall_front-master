<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_text_wrap">
              <div class="progress_bar_wrap">
                <div class="progress_bar_message">
                  <p>진행중입니다.잠시만 기다려주세요</p>
                </div>

                <div class="progress_bar">
                  <div class="progress_done" v-bind:style="progressbarWidth"></div>
                </div>
                <div class="progress_bar_score_wrap">
                  <div class="progress_bar_state">진행률</div>
                  <div class="progress_bar_score">
                    <span class="color_main_01">{{ this.done }}</span>
                    <span>{{ this.total }}</span>
                  </div>
                </div>
              </div>
            </div>
<!--            <div class="popup_btn_wrap text-center">-->
<!--              <button @click="cancel" class="line_btn">취소</button>-->
<!--              <button @click="ok">확인</button>-->
<!--            </div>-->
          </div>

        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    checkProgress: {
      type: Function,
      default() {
        return null;
      },
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data: () => ({
    total: 100,
    done: 0,
  }),
  computed: {
    progressbarWidth() {
      if (parseInt(this.total, 10) >= parseInt(this.done, 10)) {
        const width = (this.done / this.total) * 100;
        return {
          width: (`${width}%`),
          opacity: 1,
        };
      }
    },
  },
  async created() {
    const res = await this.checkProgress();
    this.done = res.done;
    this.total = res.total;
    await this.startProgress();
  },
  beforeDestroy() {
    clearTimeout(this.interval);
  },
  methods: {
    async startProgress() {
      this.interval = setInterval(async () => {
        const res = await this.checkProgress();
        this.done = res.done;
        this.total = res.total;
        if (res.done === res.total) {
          clearTimeout(this.interval);
        }
      }, this.timeout);
    },
  },
});
</script>
