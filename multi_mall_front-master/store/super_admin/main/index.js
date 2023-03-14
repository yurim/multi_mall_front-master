const prefix = 'super_admin/';

const state = () => ({
  mainStatus: {},
});

const actions = {
  async getMainStatus({ commit }) {
    const res = await this.$axios.get(`${prefix}`);
    await commit('setMainStatus', res.data);
  },
};

const mutations = {
  setMainStatus(state, res) {
    state.mainStatus = res.data;
  },
};

const getters = {
  mainStatus: (state) => state.mainStatus,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
