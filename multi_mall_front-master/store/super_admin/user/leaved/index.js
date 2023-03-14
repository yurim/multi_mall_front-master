const prefix = 'super_admin/user/leaved';

const state = () => ({
  leavedUsers: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getLeavedUsers({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, {
      params: query,
    });
    await commit('setLeavedUsers', res.data);
  },
};

const mutations = {
  setLeavedUsers(state, res) {
    state.leavedUsers = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
};

const getters = {
  leavedUsers: (state) => state.leavedUsers,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
