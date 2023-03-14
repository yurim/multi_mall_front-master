const prefix = 'store_admin/product';

const state = () => ({
  productData: {},
  commonCodes: {},
  templates: {},
  optionMap: {},
  optionValueMap: {},
  countryMountainDeliveriesMap: {},
  result: {},
});

const actions = {
  async getProduct({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setProduct', res.data);
  },
  async updateOptionPrice(context, data) {
    const res = await this.$axios.put(`${prefix}/update_option_price`, data);
    return res.data;
  },
  async updateCanPriceGroup(context, data) {
    const res = await this.$axios.put(`${prefix}/update_can_product_price`, data);
    return res.data;
  },
  async setCanPriceGroup({ commit }, canPriceGroup) {
    await commit('setCanPriceGroup', canPriceGroup);
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
        state.optionMap[option.id] = option;
      });
    }
    if (res.data.product.deliveryInfo.country_mountain_deliveries && res.data.product.deliveryInfo.country_mountain_deliveries.length > 0) {
      res.data.product.deliveryInfo.country_mountain_deliveries.forEach((cmd) => {
        state.countryMountainDeliveriesMap[cmd.area_type] = cmd;
      });
    }
    state.store = res.data.store;
    state.commonCodes = res.data.commonCodes;
    state.templates = res.data.templates;
  },
  setCanPriceGroup(state, canPriceGroup) {
    state.productData.product.can_price_group = canPriceGroup;
    if (!canPriceGroup) {
      state.productData.product.product_price_group_id = null;
    }
  },
};

const getters = {
  productData: (state) => state.productData,
  commonCodes: (state) => state.commonCodes,
  optionMap: (state) => state.optionMap,
  optionValueMap: (state) => state.optionValueMap,
  countryMountainDeliveriesMap: (state) => state.countryMountainDeliveriesMap,
  templates: (state) => state.templates,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
