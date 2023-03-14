const prefix = 'admin/user/forgot/password';

const state = () => ({
  result: {},
});

const actions = {
  async getVerifyNumber({ commit }, data) {
    const res = await this.$axios.get(`common/smsVerify/${data}`);
    await commit('setResult', res.data);
  },
  async getFindPassword({ commit }, params) {
    const res = await this.$axios.get(`common/smsCheck/${params.send_to}/${params.code}`, params);
    await commit('setResult', res.data);
  },
  async getChangePassword({ commit }, params) {
    const res = await this.$axios.post(`${prefix}`, params);
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
