const prefix = 'user/notice';

const state = () => ({
  notices: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getNotices({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setNotices', res.data);
  },
};

const mutations = {
  setNotices(state, res) {
    state.notices = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
};

const getters = {
  notices: (state) => state.notices,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
