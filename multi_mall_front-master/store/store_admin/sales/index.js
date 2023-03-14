const urlPrefix = 'store_admin/sales';

const state = () => ({
  orderProduct: {},
});

const actions = {
  async getOrderProduct({ commit }, id) {
    const res = await this.$axios.get(`${urlPrefix}/${id}`);
    await commit('setOrderProduct', res.data.data);
    return res;
  },
  async updateAdminMemo(context, data) {
    return await this.$axios.post(`${urlPrefix}/updateAdminMemo`, data);
  },
  async update_dispatch_delivery(context, data) {
    return await this.$axios.post(`${urlPrefix}/update_dispatch_delivery`, data);
  },
  async update_collect_delivery(context, data) {
    return await this.$axios.post(`${urlPrefix}/update_collect_delivery`, data);
  },
};

const mutations = {
  setOrderProduct(state, data) {
    state.orderProduct = data.orderProduct;
  },
};

const getters = {
  orderProduct: (state) => state.orderProduct,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
