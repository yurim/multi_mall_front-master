const urlPrefix = 'store_admin/sales/decide';

const state = () => ({
  orderProducts: [],
  totalCount: 0,
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
