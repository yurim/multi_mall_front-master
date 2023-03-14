const state = () => ({
  totalCount: 0,
  storeBalanceAccounts: [],
  pageSize: 0,
  totalInfo: null,
  startDate: null,
  endDate: null,
});

const prefix = 'super_admin/calculation/history';

const actions = {
  async GetDataTable({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setDataTable', res.data);
  },
};

const mutations = {
  setDataTable(state, json) {
    state.storeBalanceAccounts = json.data.storeBalanceAccounts;
    state.totalCount = json.data.totalCount;
    state.pageSize = json.data.pageSize;
    state.totalInfo = json.data.totalInfo;
    state.startDate = json.data.startDate;
    state.endDate = json.data.endDate;
  },
};

const getters = {
  storeBalanceAccounts: (state) => state.storeBalanceAccounts,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  totalInfo: (state) => state.totalInfo,
  startDate: (state) => state.startDate,
  endDate: (state) => state.endDate,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
