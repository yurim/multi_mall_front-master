import _ from 'lodash';

const prefix = 'super_admin/price_group';

const state = () => ({
  priceGroup: {},
  result: {},
});

const actions = {
  async getPriceGroup({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setPriceGroup', res.data);
  },
  async deletePriceGroup({ commit }, id) {
    const res = await this.$axios.delete(`${prefix}/${id}`);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setPriceGroup(state, res) {
    const priceGroup = res.data.priceGroup;
    priceGroup.products = _.sortBy(priceGroup.products, (p) => p.id !== priceGroup.lowest_product_id);
    state.priceGroup = priceGroup;
    state.count = res.data.count;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  priceGroup: (state) => state.priceGroup,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
