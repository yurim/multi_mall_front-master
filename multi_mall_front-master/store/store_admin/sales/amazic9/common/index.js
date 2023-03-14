const urlPrefix = 'store_admin/amazic9';

const state = () => ({
  orders: [],
  orderTotalCount: 0,
  orderPageSize: 0,

  items: [],
  itemCurrPage: 0,
  itemTotalCount: 0,
  itemPageSize: 0,

  currencyUnits: [],
});

const actions = {
  async getAbroadOrders({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_abroad_orders`, { params: query });
    await commit('setAbroadOrders', res.data.data);
    return res.data;
  },
  async getItems({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_items`, { params: query });
    const result = {
      data: res.data.data,
      page: (query && query.page) ? query.page : 1,
    };
    await commit('setItems', result);
    return res.data;
  },
  async getCurrencyUnits({ commit }) {
    const res = await this.$axios.get(`${urlPrefix}/get_currency_units`);
    await commit('setCurrencyUnits', res.data.data);
  },
  async updateTrackingNum(context, data) {
    const res = await this.$axios.put(`${urlPrefix}/update_tracking_num`, data);
    return res.data;
  },
  async getCourier(context, deliveryRequestId) {
    const res = await this.$axios.get(`${urlPrefix}/get_courier/${deliveryRequestId}`);
    return res.data;
  },
  async translate(context, data) {
    const res = await this.$axios.post(`${urlPrefix}/translate`, data);
    return res.data;
  },
  async getNotice(context, data) {
    const res = await this.$axios.get(`${urlPrefix}/get_notice`, data);
    return res.data;
  },
};

const mutations = {
  setAbroadOrders(state, data) {
    if (data.abroadOrders) state.orders = data.abroadOrders;
    if (data.totalCount) state.orderTotalCount = data.totalCount;
    if (data.pageSize) state.orderPageSize = data.pageSize;
  },
  setItems(state, result) {
    const optionItems = [];
    if (result.data.items.length > 0) {
      state.itemCurrPage = result.page;
      result.data.items.forEach((item) => {
        item.value = `${item.kor_name}·${item.eng_name}·${item.cna_name}`;
        optionItems.push(item);
      });
    }
    state.items = state.items.concat(optionItems);
    state.itemTotalCount = result.data.totalCount;
    state.itemPageSize = result.data.pageSize;
  },
  resetItems(state) {
    state.items = [];
    state.itemCurrPage = 1;
    state.itemTotalCount = 0;
    state.itemPageSize = 0;
  },
  setCurrencyUnits(state, data) {
    if (data.currency_units) state.currencyUnits = data.currency_units;
  },
};

const getters = {
  orders: (state) => state.orders,
  orderTotalCount: (state) => state.orderTotalCount,
  orderPageSize: (state) => parseInt(state.orderPageSize, 10),

  items: (state) => state.items,
  itemCurrPage: (state) => state.itemCurrPage,
  itemTotalCount: (state) => state.itemTotalCount,
  itemPageSize: (state) => parseInt(state.itemPageSize, 10),

  currencyUnits: (state) => state.currencyUnits,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
