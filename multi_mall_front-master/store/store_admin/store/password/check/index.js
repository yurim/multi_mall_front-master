const prefix = 'store_admin';

const state = () => ({
  result: {},
});

const actions = {
  async getAdminVerify({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/validatePw`, data);
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
