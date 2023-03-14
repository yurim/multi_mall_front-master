const prefix = 'super_admin/product';

const state = () => ({
  productData: {},
  store: {},
  commonCodes: {},
  templates: {},
  optionMap: {},
  optionValueMap: {},
  result: {},
});

const actions = {
  async getProduct({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setProduct', res.data);
  },
  async patchProductBlocked({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/block`, params);
    await commit('setResult', res.data);
  },
  async patchProductBlockReason({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/${params.id}/block_reason`, params);
    await commit('setResult', res.data);
  },
  async updateProductCanPriceGroup({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/${params.id}/can_price_group`, params);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setProduct(state, res) {
    state.productData = res.data.product;
    if (res.data.product.optionValues && res.data.product.optionValues.length > 0) {
      res.data.product.optionValues.forEach((optionValue) => {
        state.optionValueMap[optionValue.id] = optionValue;
      });
    }
    if (res.data.product.product.options && res.data.product.product.options.length > 0) {
      res.data.product.product.options.forEach((option) => {
        state.optionMap[option._id] = option;
      });
    }
    state.store = res.data.store;
    state.commonCodes = res.data.commonCodes;
    state.templates = res.data.templates;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  productData: (state) => state.productData,
  store: (state) => state.store,
  commonCodes: (state) => state.commonCodes,
  optionMap: (state) => state.optionMap,
  optionValueMap: (state) => state.optionValueMap,
  templates: (state) => state.templates,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
