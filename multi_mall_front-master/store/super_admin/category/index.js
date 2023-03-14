const urlPrefix = 'super_admin/category';

const state = () => ({
  categories: [],
});

const actions = {
  async getCategories({ commit }, query) {
    const res = await this.$axios.get(urlPrefix, { params: query });
    if (query) return res.data;
    await commit('setCategories', res.data.data);
  },
  async getRootCategory({ commit }) {
    const res = await this.$axios.get(`${urlPrefix}/get_root`);
    await commit('setRootCategory', res.data.data);
  },
  async hasProducts(context, query) {
    const res = await this.$axios.get(`${urlPrefix}/has_products`, { params: query });
    return res.data;
  },
};

const mutations = {
  setCategories(state, data) {
    data.categories.forEach((category) => {
      if (category.hasChild) category.children = [];
    });
    if (state.categories.length > 0) {
      state.categories[0].children = data.categories;
    }
  },
  setRootCategory(state, data) {
    if (data.category.hasChild) data.category.children = [];
    state.categories = [
      data.category,
    ];
  },
};

const getters = {
  categories: (state) => state.categories,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
