const prefix = 'super_admin/store';

const state = () => ({
  categories: [],
  result: '',
});

const actions = {
  async getCategories({ commit }, query) {
    const res = await this.$axios.get('super_admin/category', { params: query });
    if (query) return res.data;
    await commit('setCategories', res.data.data);
  },
  async createStore({ commit }, data) {
    const res = await this.$axios.post(`${prefix}`, data);
    await commit('setResult', res.data);
  },
  async generateAPIKey() {
    const res = await this.$axios.get(`${prefix}/generate_api_key`);
    return res.data;
  },
};

const mutations = {
  setCategories(state, res) {
    state.categories = res.categories;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  categories: (state) => state.categories,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
