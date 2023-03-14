const prefix = 'super_admin/store';

const state = () => ({
  store: {},
  categories: [],
});

const actions = {
  async getStore({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setStore', res.data);
  },
  async getCategories({ commit }, query) {
    const res = await this.$axios.get('super_admin/category', { params: query });
    if (query) return res.data;
    await commit('setCategories', res.data.data);
  },
  async generateAPIKey() {
    const res = await this.$axios.get(`${prefix}/generate_api_key`);
    return res.data;
  },
};

const mutations = {
  setStore(state, res) {
    state.store = res.data.store;
  },
  setCategories(state, res) {
    state.categories = res.categories;
  },
};

const getters = {
  store: (state) => state.store,
  categories: (state) => state.categories,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
