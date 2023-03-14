const state = () => ({
  totalCount: 0,
  orderProducts: [],
  pageSize: 0,
});

const prefix = 'super_admin/sales/exchange';

const actions = {
  async GetDataTable({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setDataTable', res.data);
  },
  async collect_info_edit(context, data) {
    return await this.$axios.post(`${prefix}/collect_info_edit`, data);
  },
};

const mutations = {
  setDataTable(state, json) {
    state.orderProducts = json.data.orderProducts;
    state.totalCount = json.data.totalCount;
    state.pageSize = json.data.pageSize;
  },
};

const getters = {
  orderProducts: (state) => state.orderProducts,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
