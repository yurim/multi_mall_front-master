const prefix = 'store_admin/product/st11';

const state = () => ({
  products: [],
  totalCount: 0,
  pageSize: 0,
  result: '',
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
    const res = await this.$axios.get(`${prefix}/`, { params: query });
    await commit('setProducts', res.data);
  },
  async getProductsCount({ commit }) {
    const res = await this.$axios.post(`${prefix}/count`);
    await commit('setProductsCount', res.data);
  },
  async createSt11Product(context, data) {
    const res = await this.$axios.post(`${prefix}/create_st11_product`, data);
    return res.data;
  },
  async deleteSt11Product(context, data) {
    const res = await this.$axios.post(`${prefix}/delete_st11_product`, data);
    return res.data;
  },
  async setLockedSt11Product(context, data) {
    const res = await this.$axios.put(`${prefix}/lock_st11_product`, data);
    return res.data;
  },
  async updateAllSt11Product(context, data) {
    const res = await this.$axios.post(`${prefix}/update_all_st11_product`, data);
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
