const prefix = 'store_admin/delivery_group';

const state = () => ({
  deliveryGroup: {},
});

const actions = {
  async getDeliveryGroup({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setDeliveryGroup', res.data);
  },
  async deleteDeliveryGroup(context, data) {
    const res = await this.$axios.put(`${prefix}/delete`, data);
    return res.data;
  },
};

const mutations = {
  setDeliveryGroup(state, res) {
    state.deliveryGroup = res.data.delivery_group;
  },
};

const getters = {
  deliveryGroup: (state) => state.deliveryGroup,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
