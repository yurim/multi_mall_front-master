const prefix = 'store_admin/delivery_info';

const state = () => ({
  deliveryGroup: [],
  deliveryInfo: {},
  deliveryInfoForDeliveryGroup: null,
});

const actions = {
  async getDeliveryGroup({ commit }) {
    const res = await this.$axios.get('store_admin/delivery_group/get_all');
    await commit('setDeliveryGroup', res.data);
  },
  async getDeliveryInfo({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setDeliveryInfo', res.data);
  },
  async patchDelivery(context, data) {
    const res = await this.$axios.put(`${prefix}/update`, data);
    return res.data;
  },
  async getDeliveryInfoForDeliveryGroup({ commit }, deliveryGroupId) {
    const res = await this.$axios.get(`${prefix}/for_delivery_group/${deliveryGroupId}`);
    await commit('setDeliveryInfoForDeliveryGroup', res.data);
  },
  async resetDeliveryInfoForDeliveryGroup({ commit }) {
    await commit('resetDeliveryInfoForDeliveryGroup');
  },
};

const mutations = {
  setDeliveryGroup(state, res) {
    state.deliveryGroup = res.data.list;
  },
  setDeliveryInfo(state, res) {
    state.deliveryInfo = res.data.delivery_info;
  },
  setDeliveryInfoForDeliveryGroup(state, res) {
    state.deliveryInfoForDeliveryGroup = res.data.delivery_info;
  },
  resetDeliveryInfoForDeliveryGroup(state) {
    state.deliveryInfoForDeliveryGroup = null;
  },
};

const getters = {
  deliveryGroup: (state) => state.deliveryGroup,
  deliveryInfo: (state) => state.deliveryInfo,
  result: (state) => state.result,
  deliveryInfoForDeliveryGroup: (state) => state.deliveryInfoForDeliveryGroup,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
