const prefix = 'super_admin';

const state = () => ({
  result: {},
});

const actions = {
  async patchAdminPassword({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/changePw`, params);
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
