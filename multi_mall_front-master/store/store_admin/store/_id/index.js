const prefix = 'store_admin/store';

const state = () => ({
  store: {},
});

const actions = {
  async getStore({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setStore', res.data);
  },
  async leaveStore(context, params) {
    return await this.$axios.put(`${prefix}/${params.id}/leave`, params);
  },
};

const mutations = {
  setStore(state, res) {
    state.store = res.data.store;
  },
};

const getters = {
  store: (state) => state.store,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
