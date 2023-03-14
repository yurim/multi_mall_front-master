const prefix = 'super_admin/site/couriers';

const state = () => ({
  courierInfo: [],
});

const actions = {
  async getCourierInfo({ commit }) {
    const res = await this.$axios.get(`${prefix}`);
    await commit('setCourierInfo', res.data);
  },
  async saveCourierInfo(context, data) {
    return await this.$axios.post(`${prefix}/update`, data);
  },
  async deleteCourierInfo(context, data) {
    return await this.$axios.post(`${prefix}/delete`, data);
  },
};

const mutations = {
  setCourierInfo(state, res) {
    state.courierInfo = res.data.infos;
  },
};

const getters = {
  courierInfo: (state) => state.courierInfo,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
