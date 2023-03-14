const prefix = 'super_admin/site/info';

const state = () => ({
  siteInfo: [],
  businessInfo: [],
  snsInfo: [],
  csInfo: [],
  result: '',
});

const actions = {
  async getSiteInfo({ commit }) {
    const res = await this.$axios.get(`${prefix}`);
    await commit('setSiteInfo', res.data);
  },
  async patchSiteInfo({ commit }, params) {
    const res = await this.$axios.post(`${prefix}`, params);
    await commit('setResult', res.data);
  },
};

const mutations = {
  setSiteInfo(state, res) {
    // ? else 이하는 initial data
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
      state.snsInfo = {
        NAVER: {
          is_used: false,
          script: '',
        },
        KAKAO: {
          is_used: false,
          script: '',
        },
        INSTA: {
          is_used: false,
          script: '',
        },
        FACE: {
          is_used: false,
          script: '',
        },
      };
    }
    if (res.data.csInfo) {
      state.csInfo = res.data.csInfo;
    } else {
      state.csInfo = {};
    }
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  siteInfo: (state) => state.siteInfo,
  businessInfo: (state) => state.businessInfo,
  snsInfo: (state) => state.snsInfo,
  csInfo: (state) => state.csInfo,
  result: (state) => state.result,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
