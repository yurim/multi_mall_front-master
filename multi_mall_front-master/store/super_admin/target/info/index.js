const prefix = 'super_admin/target/info';

const state = () => ({
  targetInfo: [],
});

const actions = {
  async getTargetInfo({ commit }) {
    const res = await this.$axios.get(`${prefix}`);
    await commit('setTargetInfo', res.data);
  },
  async createTargetInfo(context, data) {
    return await this.$axios.post(`${prefix}`, data);
  },
  async updateTargetInfo(context, data) {
    return await this.$axios.post(`${prefix}/update`, data);
  },
  async deleteTargetInfo(context, data) {
    return await this.$axios.post(`${prefix}/delete`, data);
  },
};

const mutations = {
  setTargetInfo(state, res) {
    if (res.data) {
      state.targetInfo = res.data.targetInfo;
    } else {
      state.targetInfo = [];
    }
  },
};

const getters = {
  targetInfo: (state) => state.targetInfo,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
