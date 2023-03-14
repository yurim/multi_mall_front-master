const prefix = 'store_admin/linkage';

const state = () => ({
  linkageProducts: [],
  totalCount: 0,
  pageSize: 0,
  linkageTypes: {},
  categories: [],
  deliveryInfo: [],
  templates: [],
});

const actions = {
  async getLinkageProducts({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_linkage_products`, { params: query });
    await commit('setLinkageProducts', res.data);
  },
  async getCategories({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_categories`, { params: query });
    await commit('setCategories', res.data.data);
    return res.data;
  },
  async getDeliveryInfos({ commit }) {
    const res = await this.$axios.get(`${prefix}/template/delivery_info`);
    await commit('setDeliveryInfo', res.data);
  },
  async getDeliveryInfoDetail(context, id) {
    const res = await this.$axios.get(`${prefix}/template/delivery_info/${id}`);
    return res.data;
  },
  async getTemplates({ commit }) {
    const res = await this.$axios.post('store_admin/template/get_all_type');
    await commit('setTemplates', res.data);
  },
  async transferLinkageProducts(context, data) {
    const res = await this.$axios.post(`${prefix}/transfer_linkage_products`, data);
    return res.data;
  },
};

const mutations = {
  setLinkageProducts(state, res) {
    state.linkageProducts = res.data.linkage_products;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
    state.linkageTypes = res.data.linkage_types;
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
  linkageProducts: (state) => state.linkageProducts,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  linkageTypes: (state) => state.linkageTypes,
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
