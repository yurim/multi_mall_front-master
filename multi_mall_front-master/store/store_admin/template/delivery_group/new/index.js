const prefix = 'store_admin/delivery_group';

const state = () => ({
  result: '',
});

const actions = {
  async createDeliveryGroup({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
