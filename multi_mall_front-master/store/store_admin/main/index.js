const prefix = 'store_admin/';

const state = () => ({
  salesStatus: {},
  enterStatus: {},
  productStatus: {},
  orderSubStatus: {},
  noAnswer: {},
  saleDelayStatus: {},
});

const actions = {
  async getMainStatus({ commit }) {
    const res = await this.$axios.get(`${prefix}`);
    await commit('setMainStatus', res.data);
  },
};

const mutations = {
  setMainStatus(state, res) {
    state.salesStatus = res.data.판매;
    state.enterStatus = res.data.입점;
    state.productStatus = res.data.상품;
    state.orderSubStatus = res.data['취소/반품/교환'];
    state.noAnswer = res.data.미답변문의;
    state.saleDelayStatus = res.data.판매처리지연;
  },
};

const getters = {
  salesStatus: (state) => state.salesStatus,
  enterStatus: (state) => state.enterStatus,
  productStatus: (state) => state.productStatus,
  orderSubStatus: (state) => state.orderSubStatus,
  noAnswer: (state) => state.noAnswer,
  saleDelayStatus: (state) => state.saleDelayStatus,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
