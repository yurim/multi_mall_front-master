const prefix = 'super_admin/store';

const state = () => ({
  storeSwitcher: [],
  stores: [],
  count: {
    total: 0,
    enterRequested: 0,
    leaveRequested: 0,
    blocked: 0,
  },
  totalCount: 0,
  pageSize: 50,
  result: {},
  sigunguCodes: [],

  // 셀렉트에서 매장 검색
  storeSearchList: [],
  storeTotalCount: 0,
  storePageSize: 0,
  storeCurrPage: 0,
});

const actions = {
  async getStores({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, {
      params: query,
    });
    await commit('setStores', res.data);
  },
  async getStoresCount({ commit }) {
    const res = await this.$axios.get(`${prefix}/count`);
    await commit('setStoresCount', res.data);
  },
  async getStoreSwitcher({ commit }) {
    const res = await this.$axios.get(`${prefix}/switcher`);
    await commit('setStoreSwitcher', res.data);
  },
  async getSigunguCodes({ commit }, data) {
    const res = await this.$axios.get('common/sigungu_codes', { params: data });
    await commit('setSigunguCodes', res.data);
  },
  async patchStoresShow({ commit }, data) {
    const res = await this.$axios.post(`${prefix}/change_state`, data);
    await commit('setResult', res.data);
  },

  // 셀렉트에서 매장 검색
  async getStoreSearchList({ commit }, query) {
    const res = await this.$axios.get('super_admin/common/get_stores', { params: query });
    const result = {
      data: res.data.data,
      page: (query && query.page) ? query.page : 1,
    };
    await commit('setStoreSearchList', result);
  },
  async resetStoreSearchList({ commit }) {
    await commit('resetStoreSearchList');
  },
};

const mutations = {
  setStores(state, res) {
    state.stores = res.data.stores;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
  },
  setStoresCount(state, res) {
    state.count.total = res.data.total;
    state.count.enterRequested = res.data.enterRequested;
    state.count.leaveRequested = res.data.leaveRequested;
    state.count.blocked = res.data.blocked;
  },
  setStoreSwitcher(state, res) {
    state.storeSwitcher = res.data.stores;
  },
  setSigunguCodes(state, res) {
    state.sigunguCodes = res.data.sigunguCodes;
  },
  setResult(state, res) {
    state.result = res;
  },

  // 셀렉트에서 매장 검색
  async setStoreSearchList(state, result) {
    if (result.data.stores.length > 0) {
      state.storeCurrPage = result.page;
    }
    state.storeSearchList = state.storeSearchList.concat(result.data.stores);
    state.storeTotalCount = result.data.totalCount;
    state.storePageSize = result.data.pageSize;
  },
  async resetStoreSearchList(state) {
    state.storeSearchList = [];
    state.storeCurrPage = 1;
    state.storeTotalCount = 0;
    state.storePageSize = 0;
  },
};

const getters = {
  storeSwitcher: (state) => state.storeSwitcher,
  count: (state) => state.count,
  stores: (state) => state.stores,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  result: (state) => state.result,
  sigunguCodes: (state) => state.sigunguCodes,

  // 셀렉트에서 매장 검색
  storeSearchList: (state) => state.storeSearchList,
  storeCurrPage: (state) => state.storeCurrPage,
  storeTotalCount: (state) => state.storeTotalCount,
  storePageSize: (state) => parseInt(state.storePageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
