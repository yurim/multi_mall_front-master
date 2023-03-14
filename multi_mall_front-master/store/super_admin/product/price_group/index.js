const prefix = 'super_admin/price_group';

const state = () => ({
  priceGroupListCount: 0,
  priceGroups: [],
  totalCount: 0,
  pageSize: 0,
  result: {},
});

const actions = {
  async getPriceGroups({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/`, {
      params: query,
    });
    await commit('setPriceGroups', res.data);
  },
  async getPriceGroupListCount({ commit }) {
    const res = await this.$axios.get(`${prefix}/count`);
    await commit('setPriceGroupListCount', res.data);
  },
};

const mutations = {
  setPriceGroups(state, res) {
    state.priceGroups = res.data.priceGroups;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setPriceGroupListCount(state, res) {
    state.totalCount = res.data.totalCount;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  priceGroupListCount: (state) => state.priceGroupListCount,
  priceGroups: (state) => state.priceGroups,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  result: (state) => state.result,
  count: (state) => state.count,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
