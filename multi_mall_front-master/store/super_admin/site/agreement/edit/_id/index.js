const prefix = 'super_admin/site/agreements';

const state = () => ({
  agreementList: {},
  result: {},
});

const actions = {
  async getAgreementList({ commit }) {
    const res = await this.$axios.get(`${prefix}`);
    await commit('setAgreementList', res.data);
  },
  async patchAgreements({ commit }, params) {
    const res = await this.$axios.post(`${prefix}`, params);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setAgreementList(state, res) {
    state.agreements = res.data.agreements;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  agreementList: (state) => state.agreements,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
