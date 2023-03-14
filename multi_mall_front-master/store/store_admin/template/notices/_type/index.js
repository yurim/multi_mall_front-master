const prefix = 'store_admin/template';

const state = () => ({
  notices: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getNotices({ commit }, data) {
    const res = await this.$axios.get(`${prefix}`, { params: data });
    await commit('setNotices', res.data);
  },
  async deleteNotices(context, data) {
    return await this.$axios.put(`${prefix}/delete`, data);
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
