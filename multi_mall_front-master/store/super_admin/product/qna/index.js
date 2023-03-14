const prefix = 'super_admin/qna';

const state = () => ({
  qnas: [],
  totalCount: 0,
  pageSize: 0,
  result: '',
});

const actions = {
  async getQnas({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/`, { params: query });
    await commit('setQnas', res.data);
  },
  async createReply({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/${data.question_id}/reply`, { content: data.content });
    await commit('setResult', res.data);
  },
  async patchReply(context, data) {
    const res = await this.$axios.post(`${prefix}/${data.answer_id}/reply/update`, { content: data.content });
    return res.data;
  },
  async patchQnaShow({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/update_isshow`, data);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setQnas(state, res) {
    state.qnas = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  qnas: (state) => state.qnas,
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
