const state = () => ({
  totalCount: 0,
  storeBalanceAccountOrderProducts: [],
  pageSize: 0,
  storeBalanceAccount: null,
});

const prefix = 'super_admin/calculation/history';

const actions = {
  async getHistory({ commit }, params) {
    const res = await this.$axios.get(`${prefix}/${params.id}`, { params: params.query });
    await commit('setHistory', res.data);
  },
};

const mutations = {
  setHistory(state, res) {
    state.storeBalanceAccountOrderProducts = res.data.storeBalanceAccountOrderProducts;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
    state.storeBalanceAccount = res.data.storeBalanceAccount;
  },
};

const getters = {
  storeBalanceAccountOrderProducts: (state) => state.storeBalanceAccountOrderProducts,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  storeBalanceAccount: (state) => state.storeBalanceAccount,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
