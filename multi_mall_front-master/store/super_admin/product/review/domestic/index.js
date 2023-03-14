const prefix = 'super_admin/review';

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
  async createReply({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/${params.review_id}/reply`, { reply: params.reply, is_best: params.is_best });
    await commit('setResult', res.data);
  },
  async updateReply({ commit }, data) {
    const res = await this.$axios.put(`${prefix}/${data.review_id}/update_reply`, { review_reply_id: data.reply_id, is_best: data.is_best, content: data.reply });
    await commit('setResult', res.data);
  },
};

const mutations = {
  setReviews(state, res) {
    state.reviews = res.data.reviews;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
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
