<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_text_wrap">
              <div class="progress_message_wrap">
                {{ title }}
              </div>
              <div class="progress_wrap">
                <div class="inner_bar"
                     v-bind:style="progressbarWidth"
                ></div>
                <div class="background_bar"></div>
              </div>
              <div class="progress_score_wrap">
                <div class="progress_state">진행도</div>
                <div class="progress_score">
                  <span>{{ this.progressNum }}</span>
                  <span>{{ this.maxNum }}</span>
                </div>
              </div>
            </div>
            <div class="m_t_20 m_b_10 font_12 color_r pull-left w_100">닫기를 눌러도 연동은 계속됩니다.</div>
            <div class="popup_btn_wrap text-center">
              <button @click="ok">닫기</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

const prefix = 'store_admin/product/st11';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    subUrl: {
      type: String,
      default: '',
    },
    productIds: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      maxNum: 0,
      progressNum: 0,
    };
  },
  computed: {
    progressbarWidth() {
      if (this.maxNum >= this.progressNum) {
        const test = (this.progressNum / this.maxNum) * 100;
        return {
          width: (`${test}%`),
        };
      }
    },
  },
  async created() {
    this.maxNum = this.productIds.length;
    await this.startProgress();
  },
  beforeDestroy() {
    clearTimeout(this.interval);
  },
  methods: {
    async startProgress() {
      this.interval = setInterval(async () => {
        const res = await this.checkProgress();
        this.progressNum = res.completed_count + res.failed_count;
        if (res.product_count <= res.completed_count + res.failed_count) {
          clearTimeout(this.interval);
        }
      }, 1000);
    },
    async checkProgress() {
      const res = await this.$store.$axios.post(`${prefix}/${this.subUrl}`, {
        product_ids: this.productIds,
      });
      return res.data.data;
    },
  },
});
</script>
