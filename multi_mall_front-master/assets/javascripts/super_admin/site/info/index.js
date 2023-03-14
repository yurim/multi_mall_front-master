import { mapGetters } from 'vuex';

const prefix = 'super_admin/site/info';

export default {
  data: () => ({
    keyword: '',
  }),
  async fetch({ store }) {
    await store.dispatch('super_admin/site/info/getSiteInfo');
  },
  computed: {
    ...mapGetters({
      siteInfo: `${prefix}/siteInfo`,
      businessInfo: `${prefix}/businessInfo`,
      snsInfo: `${prefix}/snsInfo`,
      csInfo: `${prefix}/csInfo`,
    }),
  },
  created() {
    // this.siteInfo.keywords.forEach((keyword, i) => {
    //   this.keyword += `#${keyword}`;
    //   if (this.siteInfo.keywords.length - 1 !== i) this.keyword += ', ';
    // });
  },
};
