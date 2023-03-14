import Utils from '@/plugins/utils';

const urlPrefix = 'main';

const state = () => ({
  products: [],
  productTotalCount: 0,
  productPageSize: 0,
  productNextCursor: null,

  stores: [],
  storeTotalCount: 0,
  storePageSize: 0,

  businessInfo: {},
  csInfo: {},
});

const actions = {
  async getProducts({ commit }, query) {
    const config = {
      params: query,
    };

    const mainPageUid = Utils.getCookie(document.cookie, 'mainPageUid');
    if (mainPageUid) {
      config.headers = {
        'X-MAINPAGEUID': mainPageUid,
      };
    }
    const res = await this.$axios.get(`${urlPrefix}/get_products`, config);
    await commit('setProducts', res.data.data);
    return res.data;
  },
  async getStores({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_stores`, { params: query });
    await commit('setStores', res.data.data);
    return res.data;
  },
  async getBusinessInfo({ commit }) {
    const res = await this.$axios.get(`${urlPrefix}/get_business_info`);
    await commit('setBusinessInfo', res.data.data);
    return res.data;
  },
  async initNextCursor({ commit }) {
    await commit('setProductNextCursor', null);
  },
};

const mutations = {
  setProducts(state, data) {
    state.products = data.products;
    if (data.totalCount) state.productTotalCount = data.totalCount;
    if (data.pageSize) state.productPageSize = data.pageSize;
    if (data.nextCursor) state.productNextCursor = data.nextCursor;
    if (!data.products) state.productNextCursor = 0;
    Utils.addCookie('mainPageUid', data.x_page_uid);
  },
  setStores(state, data) {
    if (data.stores) state.stores = data.stores;
    if (data.totalCount) state.storeTotalCount = data.totalCount;
    if (data.pageSize) state.storePageSize = data.pageSize;
  },
  setBusinessInfo(state, data) {
    if (data.business_info) state.businessInfo = data.business_info;
    if (data.cs_info) state.csInfo = data.cs_info;
  },
  setProductNextCursor(state, value) {
    state.productNextCursor = value;
  },
};

const getters = {
  products: (state) => state.products,
  productTotalCount: (state) => state.productTotalCount,
  productPageSize: (state) => parseInt(state.productPageSize, 10),
  productNextCursor: (state) => state.productNextCursor,

  stores: (state) => state.stores,
  storeTotalCount: (state) => state.storeTotalCount,
  storePageSize: (state) => parseInt(state.storePageSize, 10),

  businessInfo: (state) => state.businessInfo,
  csInfo: (state) => state.csInfo,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
