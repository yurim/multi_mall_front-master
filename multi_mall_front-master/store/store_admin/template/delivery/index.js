const prefix = 'store_admin/delivery_info';
const cmaPrefix = 'store_admin/cma';

const state = () => ({
  deliveries: [],
  totalCount: 0,
  pageSize: 0,
  result: '',
  countryMountainAddressList: [],
});

const actions = {
  async getDeliveries({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/`, { params: query });
    await commit('setDeliveries', res.data);
  },
  async deleteDeliveryInfos(context, params) {
    const res = await this.$axios.put('store_admin/delivery_info/delete', params);
    return res.data;
  },
  async getCountryMountainAddress({ commit }) {
    const res = await this.$axios.get(`${cmaPrefix}/`);
    await commit('setCountryMountainAddress', res.data);
  },
};

const mutations = {
  setDeliveries(state, res) {
    state.deliveries = res.data.list;
    state.pageSize = res.data.pageSize;
    state.totalCount = res.data.totalCount;
  },
  setResult(state, res) {
    state.result = res;
  },
  setCountryMountainAddress(state, res) {
    state.countryMountainAddressList = res.data.country_mountain_address;
  },
};

const getters = {
  deliveries: (state) => state.deliveries,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  result: (state) => state.result,
  countryMountainAddressList: (state) => state.countryMountainAddressList,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
