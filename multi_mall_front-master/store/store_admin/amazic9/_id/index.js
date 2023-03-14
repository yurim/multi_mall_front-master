const urlPrefix = 'store_admin/amazic9';

const state = () => ({
  order: {},
});

const actions = {
  async getAbroadOrder({ commit }, orderNum) {
    const res = await this.$axios.get(`${urlPrefix}/get_abroad_order/${orderNum}`);
    await commit('setAbroadOrder', res.data.data);
  },
};

const mutations = {
  setAbroadOrder(state, data) {
    if (data.order) state.order = data.order;
  },
};

const getters = {
  order: (state) => state.order,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
