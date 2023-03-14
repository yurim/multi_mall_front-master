const prefix = 'store_admin/crawling';

const state = () => ({
  scrapInfos: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getScrapInfos({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/get_scrap_infos`, { params: query });
    await commit('setScrapInfos', res.data);
  },
  async getTempCategories(context, data) {
    return await this.$axios.get(`${prefix}/temp_categories`, { params: data });
  },
};

const mutations = {
  setScrapInfos(state, res) {
    state.scrapInfos = res.data.scrapInfos;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
};

const getters = {
  scrapInfos: (state) => state.scrapInfos,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
