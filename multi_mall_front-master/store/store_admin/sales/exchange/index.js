const urlPrefix = 'store_admin/sales/exchange';

const state = () => ({
  totalCount: 0,
  orderProducts: [],
  pageSize: 0,
});

const actions = {
  async getOrderProducts({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/getDataTable`, {
      params: query,
    });
    await commit('setOrderProducts', res.data.data);
    return res.data;
  },
  async collect_info_edit(context, data) {
    return await this.$axios.post(`${urlPrefix}/collect_info_edit`, data);
  },
};

const mutations = {
  setOrderProducts(state, data) {
    if (data.orderProducts) state.orderProducts = data.orderProducts;
    if (data.totalCount) state.totalCount = data.totalCount;
    if (data.pageSize) state.pageSize = data.pageSize;
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
