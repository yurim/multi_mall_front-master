const prefix = 'super_admin/product';

const state = () => ({
  productsCount: [],
  products: [],
  totalCount: 0,
  pageSize: 0,
  result: {},
  count: {
    totalCount: 0,
    isSaleCount: 0,
    isSoldOutCount: 0,
    isBlockedCount: 0,
    isDuplicatedCount: 0,
  },
  hitCount: 0,
});

const actions = {
  async getProducts({ commit }, query) {
    const res = await this.$axios.get(`${prefix}/`, {
      params: query,
    });
    await commit('setProducts', res.data);
  },
  async getProductsCount({ commit }) {
    const res = await this.$axios.post(`${prefix}/count`);
    await commit('setProductsCount', res.data);
  },
  async patchProductsByType({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/patches_type`, params);
    await commit('setResult', res.data);
  },
  async patchProducts({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/patches`, params);
    await commit('setResult', res.data);
  },
  async patchProductBlocked({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/block`, params);
    await commit('setResult', res.data);
  },
  async patchProductSale({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/sale`, params);
    await commit('setResult', res.data);
  },
  async patchProductListed({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/listed`, params);
    await commit('setResult', res.data);
  },
  async deleteProducts({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/delete`, params);
    await commit('setResult', res.data);
  },
  async patchProductsBlock({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/block_list`, params);
    await commit('setResult', res.data);
  },
  async getDeletedProducts(context, query) {
    const res = await this.$axios.get(`${prefix}/recover/`, { params: query });
    return res.data;
  },
  async recoverProducts({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/recover/`, params);
    await commit('setResult', res.data);
    return res.data;
  },
  async updateProductCategory({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/category`, params);
    await commit('setResult', res.data);
    return res.data;
  },
  async moveProductPriceGroup({ commit }, params) {
    const res = await this.$axios.post(`${prefix}/price_group/move`, params);
    await commit('setResult', res.data);
    return res.data;
  },
};

const mutations = {
  setProducts(state, res) {
    state.products = res.data.products;
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
    state.hitCount = res.data.hitCount;
  },
  setProductsCount(state, res) {
    state.count.totalCount = res.data.totalCount;
    state.count.isSaleCount = res.data.isSaleCount;
    state.count.isSoldOutCount = res.data.isSoldOutCount;
    state.count.isBlockedCount = res.data.isBlockedCount;
    state.count.isDuplicatedCount = res.data.isDuplicatedCount;
  },
  setResult(state, res) {
    state.result = res;
  },
};

const getters = {
  productsCount: (state) => state.productsCount,
  products: (state) => state.products,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  result: (state) => state.result,
  count: (state) => state.count,
  hitCount: (state) => state.hitCount,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
