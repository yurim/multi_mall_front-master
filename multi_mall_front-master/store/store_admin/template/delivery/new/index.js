const prefix = 'store_admin/delivery_info';

const state = () => ({
  result: '',
  deliveryGroup: [],
  deliveryInfoForDeliveryGroup: null,
});

const actions = {
  async getDeliveryGroup({ commit }) {
    const res = await this.$axios.get('store_admin/delivery_group/get_all');
    await commit('setDeliveryGroup', res.data);
  },
  async createDelivery({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/`, data);
    await commit('setResult', res.data);
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
  setResult(state, res) {
    state.result = res;
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
  result: (state) => state.result,
  deliveryInfoForDeliveryGroup: (state) => state.deliveryInfoForDeliveryGroup,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
