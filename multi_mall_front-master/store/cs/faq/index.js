const prefix = 'user/faq';

const state = () => ({
  faqList: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getFaqList({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setFaqList', res.data);
  },
};

const mutations = {
  setFaqList(state, res) {
    state.faqList = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
};

const getters = {
  faqList: (state) => state.faqList,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
