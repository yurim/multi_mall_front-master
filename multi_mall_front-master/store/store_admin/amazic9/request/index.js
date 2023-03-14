const urlPrefix = 'store_admin/amazic9/request';

const state = () => ({
  order: {},
});

const actions = {
  async getOrderInfo({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_order_info`, { params: query });
    await commit('setOrderInfo', res.data.data);
  },
  async requestDelivery(context, fromData) {
    const res = await this.$axios.post(`${urlPrefix}/request_delivery`, fromData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

const mutations = {
  setOrderInfo(state, data) {
    if (data.order) state.order = data.order;
  },
};

const getters = {
  order: (state) => state.order,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
