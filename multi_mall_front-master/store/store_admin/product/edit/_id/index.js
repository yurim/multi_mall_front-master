const prefix = 'store_admin/product';

const state = () => ({
  deliveryInfos: [],
  deliveryGroups: [],
  productData: {},
  commonCodes: {},
  templates: {
    PRDCT_NTC: [],
    EXCHNG_RTND: [],
    DLVRY_NTC: [],
    ABRD_PRDCT_BTM_NTC: [],
    ABRD_PRDCT_TOP_NTC: [],
  },
  deliveryInfoForDeliveryGroup: null,
});

const actions = {
  async getDeliveryInfos({ commit }) {
    const res = await this.$axios.get('store_admin/delivery_info/get_all?use_cmd=true');
    await commit('setDeliveryInfos', res.data);
  },
  async getDeliveryGroups({ commit }) {
    const res = await this.$axios.get('store_admin/delivery_group/get_all?use_cmd=true');
    await commit('setDeliveryGroups', res.data);
  },
  async getProduct({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setProduct', res.data);
  },
  async getTemplates({ commit }) {
    const res = await this.$axios.post('store_admin/template/get_all_type');
    await commit('setTemplates', res.data);
  },
  async getDeliveryInfoForDeliveryGroup({ commit }, deliveryGroupId) {
    const res = await this.$axios.get(`store_admin/delivery_info/for_delivery_group/${deliveryGroupId}`);
    await commit('setDeliveryInfoForDeliveryGroup', res.data);
  },
  async resetDeliveryInfoForDeliveryGroup({ commit }) {
    await commit('resetDeliveryInfoForDeliveryGroup');
  },
};

const mutations = {
  setDeliveryInfos(state, res) {
    state.deliveryInfos = res.data.list;
    state.deliveryInfos.forEach((info) => {
      info.delivery_info_id = info.id;
    });
  },
  setDeliveryGroups(state, res) {
    state.deliveryGroups = res.data.list;
  },
  setProduct(state, res) {
    state.productData = res.data.product;
    state.commonCodes = res.data.commonCodes;
  },
  setTemplates(state, res) {
    state.templates = res.data.templates;
  },
  setDeliveryInfoForDeliveryGroup(state, res) {
    state.deliveryInfoForDeliveryGroup = res.data.delivery_info;
  },
  resetDeliveryInfoForDeliveryGroup(state) {
    state.deliveryInfoForDeliveryGroup = null;
  },
};

const getters = {
  deliveryInfos: (state) => state.deliveryInfos,
  deliveryGroups: (state) => state.deliveryGroups,
  productData: (state) => state.productData,
  commonCodes: (state) => state.commonCodes,
  templates: (state) => state.templates,
  deliveryInfoForDeliveryGroup: (state) => state.deliveryInfoForDeliveryGroup,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
