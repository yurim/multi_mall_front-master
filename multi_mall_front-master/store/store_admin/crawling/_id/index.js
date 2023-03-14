const prefix = 'store_admin/crawling';

const state = () => ({
  scrapInfo: {},
  tempProducts: [],
  totalCount: 0,
  pageSize: 0,
  categories: [],
  deliveryInfo: [],
  templates: [],
});

const actions = {
  async getScrapInfo({ commit }, data) {
    const res = await this.$axios.get(`${prefix}/${data.scrapInfoId}`, { params: data.query });
    await commit('setScrapInfo', res.data);
  },
  async getCategories({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/category`, { params: query });
    await commit('setCategories', res.data.data);
    return res.data;
  },
  async getDeliveryInfo({ commit }) {
    const res = await this.$axios.get(`${prefix}/template/delivery_info`);
    await commit('setDeliveryInfo', res.data);
  },
  async getDeliveryInfoDetail(context, id) {
    const res = await this.$axios.get(`${prefix}/template/delivery_info/${id}`);
    return res.data;
  },
  async transferTempProducts(context, data) {
    const res = await this.$axios.post(`${prefix}/transfer_temp_products`, data);
    return res.data;
  },
  async deleteTempProducts(context, data) {
    const res = await this.$axios.put(`${prefix}/delete_temp_products`, data);
    return res.data;
  },
  async getTemplates({ commit }) {
    const res = await this.$axios.post('store_admin/template/get_all_type');
    await commit('setTemplates', res.data);
  },
};

const mutations = {
  setScrapInfo(state, res) {
    state.scrapInfo = res.data.scrapInfo;
    state.tempProducts = res.data.tempProducts;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setCategories(state, res) {
    if (res.categories) {
      res.categories.forEach((category) => {
        if (category.hasChild) category.children = [];
      });
      state.categories = res.categories;
    }
  },
  setDeliveryInfo(state, res) {
    state.deliveryInfo = res.data.list;
  },
  setTemplates(state, res) {
    state.templates = res.data.templates;
  },
};

const getters = {
  scrapInfo: (state) => state.scrapInfo,
  tempProducts: (state) => state.tempProducts,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  categories: (state) => state.categories,
  deliveryInfo: (state) => state.deliveryInfo,
  templates: (state) => state.templates,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
