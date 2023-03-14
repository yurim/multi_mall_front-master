const prefix = 'super_admin/store';

const state = () => ({
  store: {},
  result: {},
});

const actions = {
  async getStore({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setStore', res.data);
  },
  async patchStoreState({ commit }, data) {
    const res = await this.$axios.put(`${prefix}/${data.id}/${data.api_type}`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setStore(state, res) {
    state.store = res.data.store;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  store: (state) => state.store,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
