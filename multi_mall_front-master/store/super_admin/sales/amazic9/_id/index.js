const urlPrefix = 'super_admin/sales/amazic9';

const state = () => ({
  order: {},
  delivery_request: {},
});

const actions = {
  async getDeliveryRequest({ commit }, deliveryRequestId) {
    const res = await this.$axios.get(`${urlPrefix}/get_delivery_request/${deliveryRequestId}`);
    await commit('setDeliveryRequest', res.data.data);
  },
};

const mutations = {
  setDeliveryRequest(state, data) {
    if (data.order) state.order = data.order;
    if (data.delivery_request) state.delivery_request = data.delivery_request;
  },
};

const getters = {
  order: (state) => state.order,
  delivery_request: (state) => state.delivery_request,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
