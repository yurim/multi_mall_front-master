const prefix = 'super_admin/user';

const state = () => ({
  users: [],
  totalCount: 0,
  pageSize: 0,
  // result: '',
});

const actions = {
  async getUsers({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, {
      params: query,
    });
    await commit('setUsers', res.data);
  },
  // async createBenefit({ commit }, data) {
  //   const res = await this.$axios.post(`${prefix}/benefit`, data);
  //   await commit('setResult', res.data);
  // },
};

const mutations = {
  setUsers(state, res) {
    state.users = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  // setResult(state, res) {
  //   state.result = res.result;
  // },
};

const getters = {
  users: (state) => state.users,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
