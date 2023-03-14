const prefix = 'store_admin/delivery_group';

const state = () => ({
  deliveriesGroup: [],
  totalCount: 0,
  pageSize: 0,
  result: '',
});

const actions = {
  async getDeliveriesGroup({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/`, { params: query });
    await commit('setDeliveriesGroup', res.data);
  },
  async deleteDeliveriesGroup(context, params) {
    const res = await this.$axios.put(`${prefix}/delete`, params);
    return res.data;
  },
};

const mutations = {
  setDeliveriesGroup(state, res) {
    state.deliveriesGroup = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  deliveriesGroup: (state) => state.deliveriesGroup,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
