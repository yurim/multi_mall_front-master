import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/site/agreement/edit/_id';

export default {
  data: () => ({
    agreement: {
      id: '',
      agreement_type: '',
      agreement_type_str: '',
      content: '',
    },
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getAgreementList`);
    await store.dispatch('common/getAgreements', [params.id]);
  },
  computed: {
    ...mapGetters({
      agreementObject: 'common/agreementObject',
      agreementList: `${prefix}/agreementList`,
      result: `${prefix}/result`,
    }),
  },
  created() {
    const params = this.$route.params;
    Object.keys(this.agreementObject(params.id)).forEach((key) => {
      this.agreement[key] = this.agreementObject(params.id)[key];
    });
    this.agreement.agreement_type = this.agreement.agreement_type.toLowerCase();
  },
  methods: {
    onEditor(data) {
      this.agreement.content = data.content;
    },
    async patchContent() {
      const data = {
        agreement_terms: '',
        agreement_privacy: '',
        agreement_third: '',
        agreement_exchng: '',
        agreement_rtrn: '',
        agreement_n_mmbr_buy: '',
      };
      Object.keys(this.agreementList).forEach((key) => {
        const ckey = key.toLowerCase();
        if (ckey === this.agreement.agreement_type) data[`agreement_${ckey}`] = this.agreement.content;
        else data[`agreement_${ckey}`] = this.agreementList[key];
      });
      await this.$store.dispatch(`${prefix}/patchAgreements`, data);
      if (this.result.result === 'success') {
        this.PopupAlert(`${this.agreement.agreement_type_str}이(가) 수정되었습니다.`);
        window.location = `/super_admin/site/agreement/${this.agreement.agreement_type}`;
        // this.$router.replace({ name: 'super_admin-site-agreement-id', params: { id: this.agreement.agreement_type } });
      } else {
        this.PopupAlert(this.result.message);
      }
    },
    PopupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (inParams) => inParams.$destroy(),
        },
      }).$mount();
    },
  },
};
