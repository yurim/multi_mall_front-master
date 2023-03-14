const prefix = 'store_admin/delivery_info';

const state = () => ({
  deliveryInfo: {},
});

const actions = {
  async getDeliveryInfo({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setDeliveryInfo', res.data);
  },
  async deleteDeliveryInfo(context, data) {
    const res = await this.$axios.put(`${prefix}/delete`, data);
    return res.data;
  },
};

const mutations = {
  setDeliveryInfo(state, res) {
    state.deliveryInfo = res.data.delivery_info;
  },
};

const getters = {
  deliveryInfo: (state) => state.deliveryInfo,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
