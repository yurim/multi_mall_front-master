import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    termsAgreement: {},
    privacyAgreement: {},
    thirdAgreement: {},
    services: false,
    privacy: false,
    third: false,
    message: '',
  }),
  async fetch({ store }) {
    await store.dispatch('common/getAgreements', ['terms', 'privacy', 'third']);
  },
  computed: {
    allCheck: {
      get() {
        return this.services && this.privacy && this.third;
      },
      set(value) {
        this.services = value;
        this.privacy = value;
        this.third = value;
      },
    },
    ...mapGetters({
      agreementObject: 'common/agreementObject',
    }),
  },
  created() {
    this.termsAgreement = this.agreementObject('terms');
    this.privacyAgreement = this.agreementObject('privacy');
    this.thirdAgreement = this.agreementObject('third');
  },
  methods: {
    historyBack() {
      this.$router.go(-1);
    },
    historyNext() {
      this.message = '';
      if (this.services && this.privacy && this.third) this.$router.push({ name: 'store-request-info', query: { services: this.services, privacy: this.privacy, third: this.third } });
      else this.message = '약관을 모두 동의하셔야만 다음 단계로 넘어갈 수 있습니다.';
    },
  },
};
