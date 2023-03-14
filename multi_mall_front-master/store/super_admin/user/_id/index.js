const prefix = 'super_admin/user';

const state = () => ({
  userInfo: {},
  result: {},
});

const actions = {
  async getUserInfo({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setUserInfo', res.data);
  },
  async patchPoint({ commit }, data) {
    const res = await this.$axios.get(`${prefix}/${data.id}/point?type=${data.type}&${data.type}_type=${data.reason}&${data.type}_point=${data.point}`);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setUserInfo(state, res) {
    state.userInfo = res.data.data;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  userInfo: (state) => state.userInfo,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
