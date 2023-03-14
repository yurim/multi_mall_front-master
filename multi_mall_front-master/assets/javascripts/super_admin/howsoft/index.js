import { mapGetters } from 'vuex';
// import Popup from '@/components/popups/popup';

const prefix = 'super_admin/howsoft';

export default {
  data: () => ({
    loading: false,
    queryTypes: [
      { name: 'Find', type: 'find', comment: '' },
      { name: 'Find Aggregate', type: 'find_aggregate', comment: '' },
      { name: 'Find Page', type: 'find_page', comment: '' },
      { name: 'Update By Id', type: 'update', comment: '' },
      // { name: 'Find Update', type: 'find_update', comment: '' },
    ],
    collections: [
      { name: 'product', comment: '' },
      { name: 'product_delivery_info', comment: '' },
      { name: 'product_option_compositions', comment: '' },
      { name: 'product_option_values', comment: '' },
      { name: 'st11_product', comment: '' },
    ],
    selectedQueryType: 'find',
    selectedCollection: 'product',
    params: {
      filters: '',
      sort: '',
      projection: '',
      pipelines: '',
    },
    resultJsonData: {},
  }),
  computed: {
    ...mapGetters({
    }),
  },
  created() {
  },
  methods: {
    async apply() {
      this.params.query_type = this.selectedQueryType;
      this.params.collection = this.selectedCollection;
      this.params.filters = this.params.filters.replace(/\s/g, '');
      this.params.sort = this.params.sort.replace(/\s/g, '');
      this.params.projection = this.params.projection.replace(/\s/g, '');
      this.params.pipelines = this.params.pipelines.replace(/\s/g, '');

      const res = await this.$store.dispatch(`${prefix}/executeQuery`, this.params);
      if (res.result === 'success') {
        this.resultJsonData = { data: res.data.data };
      } else {
        this.$popup.showAlertPopup(res.message);
      }
    },
  },
};
