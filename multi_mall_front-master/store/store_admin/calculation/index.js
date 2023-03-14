const state = () => ({
  storeBalanceAccount: null,
  storeBalanceAccountOrderProducts: [],
  pageSize: 0,
  totalCount: 0,
  startDate: null,
  endDate: null,
});

const prefix = 'store_admin/calculation';

const actions = {
  async GetDataTable({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setDataTable', res.data);
  },
};

const mutations = {
  setDataTable(state, json) {
    state.storeBalanceAccount = json.data.storeBalanceAccount;
    state.storeBalanceAccountOrderProducts = json.data.storeBalanceAccountOrderProducts;
    state.pageSize = json.data.pageSize;
    state.totalCount = json.data.totalCount;
    state.startDate = json.data.startDate;
    state.endDate = json.data.endDate;
  },
};

const getters = {
  storeBalanceAccount: (state) => state.storeBalanceAccount,
  storeBalanceAccountOrderProducts: (state) => state.storeBalanceAccountOrderProducts,
  pageSize: (state) => parseInt(state.pageSize, 10),
  totalCount: (state) => state.totalCount,
  startDate: (state) => state.startDate,
  endDate: (state) => state.endDate,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
