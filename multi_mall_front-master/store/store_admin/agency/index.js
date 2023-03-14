const prefix = 'store_admin/agency';

const state = () => ({
  agencyInfo: [],
});

const actions = {
  async getAgencyInfo({ commit }) {
    const res = await this.$axios.get(`${prefix}`);
    await commit('setAgencyInfo', res.data);
  },
  async createAgencyInfo(context, data) {
    return await this.$axios.post(`${prefix}`, data);
  },
  async updateAgencyInfo(context, data) {
    return await this.$axios.post(`${prefix}/update`, data);
  },
  async deleteAgencyInfo(context, data) {
    return await this.$axios.post(`${prefix}/delete`, data);
  },
};

const mutations = {
  setAgencyInfo(state, res) {
    if (res.data) {
      state.agencyInfo = res.data.agencyInfo;
    } else {
      state.agencyInfo = [];
    }
  },
};

const getters = {
  agencyInfo: (state) => state.agencyInfo,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
