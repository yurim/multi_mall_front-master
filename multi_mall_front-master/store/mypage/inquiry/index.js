const prefix = 'mypage';

const state = () => ({
  inquiryList: [],
  totalCount: 0,
  pageSize: 0,
  result: {},
});

const actions = {
  async getInqiryList({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/inquiry`, { params: query });
    await commit('setInquiryList', res.data);
  },
  async createInquiry({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/inquiry`, { params: data });
    await commit('setResult', res.data);
  },
};

const mutations = {
  setInquiryList(state, res) {
    state.inquiryList = res.data.list;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  inquiryList: (state) => state.inquiryList,
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
