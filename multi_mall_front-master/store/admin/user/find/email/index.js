const prefix = 'admin/user/forgot/email';

const state = () => ({
  result: {},
  email: '',
  name: '',
});

const actions = {
  async getVerifyNumber({ commit }, data) {
    const res = await this.$axios.get(`common/smsVerify/${data}`);
    await commit('setResult', res.data);
  },
  async getFindEmail({ commit }, params) {
    const res = await this.$axios.post(`${prefix}`, params);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setResult(state, res) {
    state.result = res;
    if (Object.prototype.hasOwnProperty.call(res, 'data')) {
      state.email = res.data.email;
      state.name = res.data.name;
    }
  },
};

const getters = {
  result: (state) => state.result,
  email: (state) => state.email,
  name: (state) => state.name,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
