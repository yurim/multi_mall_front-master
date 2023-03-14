const prefix = 'super_admin/site';

const state = () => ({
  siteInfo: {},
  businessInfo: {},
  snsInfo: {},
  csInfo: {},
});

const actions = {
  async getSiteInfo({ commit }) {
    const res = await this.$axios.get(`${prefix}/info`);
    await commit('setSiteInfo', res.data);
  },
};

const mutations = {
  setSiteInfo(state, res) {
    if (res.data.info) {
      state.siteInfo = res.data.info;
    } else {
      state.siteInfo = {};
    }
    if (res.data.businessInfo) {
      state.businessInfo = res.data.businessInfo;
    } else {
      state.businessInfo = {};
    }
    if (res.data.snsInfo) {
      state.snsInfo = res.data.snsInfo;
    } else {
      state.snsInfo = {};
    }
    if (res.data.csInfo) {
      state.csInfo = res.data.csInfo;
    } else {
      state.csInfo = {};
    }
  },
};

const getters = {
  siteInfo: (state) => state.siteInfo,
  businessInfo: (state) => state.businessInfo,
  snsInfo: (state) => state.snsInfo,
  csInfo: (state) => state.csInfo,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
