const urlPrefix = 'super_admin/sales/return_delivery';

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
  async collect(context, data) {
    return await this.$axios.post(`${urlPrefix}/collect`, data);
  },
  async collect_complete(context, data) {
    return await this.$axios.post(`${urlPrefix}/collect_complete`, data);
  },
  async return_complete(context, data) {
    return await this.$axios.post(`${urlPrefix}/return_complete`, data);
  },
  async return_reject(context, data) {
    return await this.$axios.post(`${urlPrefix}/return_reject`, data);
  },
  async change(context, data) {
    return await this.$axios.post(`${urlPrefix}/change`, data);
  },
  async lock(context, data) {
    return await this.$axios.post(`${urlPrefix}/lock`, data);
  },
  async unlock(context, data) {
    return await this.$axios.post(`${urlPrefix}/unlock`, data);
  },
  async reason_edit(context, data) {
    return await this.$axios.post(`${urlPrefix}/reason_edit`, data);
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
