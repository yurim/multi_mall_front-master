import Utils from '@/plugins/utils';

const state = () => ({
  jwt: '',
  result: '',
  username: '',
});

// return은 하지 않도록 권자아아아아앙!
const actions = {
  async getLogin({ commit }, data) {
    const res = await this.$axios.post('admin/user/login', data);
    await commit('setLogin', res.data);
  },
  async getAdminUserName({ commit }) {
    const res = await this.$axios.get('admin/user/info');
    await commit('setAdminUserName', res.data);
  },
};

const mutations = {
  setLogin(state, res) {
    state.result = res;
    if (res.result === 'success') {
      state.username = '';
      state.jwt = res.data.token;
      Utils.addCookie('jwt', res.data.token);
    }
    if (res.result === 'error') Utils.removeCookie('csrf');
  },
  setAdminUserName(state, res) {
    state.username = res.data.name;
  },
};

const getters = {
  result: (state) => state.result,
  username: (state) => state.username,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
