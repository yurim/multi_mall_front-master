const prefix = 'store_admin/delivery_group';

const state = () => ({
  deliveryGroup: {},
  result: '',
});

const actions = {
  async getDeliveryGroup({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setDeliveryGroup', res.data);
  },
  async patchDeliveryGroup(context, data) {
    const res = await this.$axios.put(`${prefix}/update`, data);
    return res.data;
  },
};

const mutations = {
  setDeliveryGroup(state, res) {
    state.deliveryGroup = res.data.delivery_group;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  deliveryGroup: (state) => state.deliveryGroup,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
