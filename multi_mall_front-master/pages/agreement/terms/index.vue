<template>
  <div class="userWrap">
    <div class="body_wrap">
      <Header></Header>
      <v-container>

        <div class="content_wrap">
          <div class="list_title_wrap text-center m_b_40"><span>이용약관</span></div>
          <div class="d_ib_100 p_20 border_b7 scroll_box">
            <client-only>
              <SummernoteEditor :preview="true" :detailContent="termsAgreement.content" />
            </client-only>
          </div>
          <div class="but_wrap m_t_40 text-center">
            <a href="javascript:history.back() " class="line_but">이전</a>
          </div>
        </div>

      </v-container>
      <Footer></Footer>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    termsAgreement: {
      content: '',
    },
  }),
  async fetch({ store }) {
    await store.dispatch('common/getAgreements', ['terms']);
  },
  computed: {
    ...mapGetters({
      agreementObject: 'common/agreementObject',
    }),
  },
  created() {
    if (Object.keys(this.agreementObject('terms')).length > 0) this.termsAgreement.content = this.agreementObject('terms').content;
  },
};
</script>
