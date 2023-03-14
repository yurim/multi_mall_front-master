const urlPrefix = 'store_admin/sales/amazic9/agency';

const state = () => ({
  agencyList: [],
});

const actions = {
  async getAgencyList({ commit }) {
    const res = await this.$axios.get(`${urlPrefix}/get_agencies_by_store`);
    await commit('setAgencyList', res.data);
  },
  async updateAgency(context, data) {
    const res = await this.$axios.put(`${urlPrefix}/update_agency`, data);
    return res.data;
  },
  async batchUpdateAgency(context, data) {
    const res = await this.$axios.put(`${urlPrefix}/batch_update_agency`, data);
    return res.data;
  },
};

const mutations = {
  async setAgencyList(state, res) {
    state.agencyList = res.data.agency_list;
  },
};

const getters = {
  agencyList: (state) => state.agencyList,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
