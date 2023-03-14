const prefix = 'super_admin/abroad-review';

const state = () => ({
  reviews: [],
  totalCount: 0,
  pageSize: 0,
  result: '',
});

const actions = {
  async getReviews({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setReviews', res.data);
  },
  async patchReviewShow({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/update_isshow`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setReviews(state, res) {
    state.reviews = res.data.reviews;
    state.totalCount = res.data.total_count;
    state.pageSize = res.data.page_size;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  reviews: (state) => state.reviews,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
