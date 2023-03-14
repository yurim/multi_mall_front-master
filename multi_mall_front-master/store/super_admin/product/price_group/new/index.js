const prefix = 'super_admin/price_group';

const state = () => ({
  categories: [],
  products: [],
  nextCursor: null,
  initProducts: [],
  initSelectedCategoryIds: [],
});

const actions = {
  async getCategories({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/category`, { params: query });
    await commit('setCategories', res.data.data);
    return res.data;
  },
  async createProductPriceGroup(context, payload) {
    const res = await this.$axios.post(`${prefix}/`, payload);
    return res.data;
  },
  async getNoPriceGroups({ commit }, query) {
    const res = await this.$axios.get('super_admin/product/no_price_group/', { params: query });
    await commit('setNoPriceGroupProducts', res.data.data);
    return res.data;
  },
  async initNextCursor({ commit }) {
    await commit('setNextCursor', null);
  },
  async getInitProducts({ commit }, query) {
    const res = await this.$axios.post(`${prefix}/products_category`, query);
    await commit('setInitProductsCategory', res.data);
    return res.data;
  },
};

const mutations = {
  setCategories(state, res) {
    if (res.categories) {
      res.categories.forEach((category) => {
        if (category.hasChild) category.children = [];
      });
      state.categories = res.categories;
    }
  },
  setNoPriceGroupProducts(state, data) {
    state.products = data.products;
    if (data.nextCursor) state.nextCursor = data.nextCursor;
  },
  setNextCursor(state, value) {
    state.nextCursor = value;
  },
  setInitProductsCategory(state, data) {
    if (data.result === 'success') {
      state.initProducts = data.data.products;
      state.initSelectedCategoryIds = data.data.selected_category_ids;
    }
  },
  resetState(state) {
    state.categories = [];
    state.products = [];
    state.nextCursor = null;
    state.initProducts = [];
    state.initSelectedCategoryIds = [];
  },
};

const getters = {
  products: (state) => state.products,
  categories: (state) => state.categories,
  nextCursor: (state) => state.nextCursor,
  initProducts: (state) => state.initProducts,
  initSelectedCategoryIds: (state) => state.initSelectedCategoryIds,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
