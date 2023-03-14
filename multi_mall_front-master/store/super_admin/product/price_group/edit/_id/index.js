const prefix = 'super_admin/price_group';

const state = () => ({
  priceGroup: {},
});

const actions = {
  async getPriceGroup({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setPriceGroup', res.data);
  },
  async updateProductPriceGroup(context, data) {
    const res = await this.$axios.put(`${prefix}/${data.id}`, data);
    return res.data;
  },
};

const mutations = {
  setPriceGroup(state, res) {
    state.priceGroup = res.data.priceGroup;
    state.count = res.data.count;
  },
};

const getters = {
  priceGroup: (state) => state.priceGroup,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
