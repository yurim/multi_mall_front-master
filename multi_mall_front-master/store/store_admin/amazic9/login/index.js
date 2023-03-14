const urlPrefix = 'store_admin/amazic9';

const addAmazic9Cookie = (key, value, expiresDate) => {
  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expiresDate.toUTCString()}; path=/;`;
};

const state = () => ({
});

const actions = {
  async login({ commit }, data) {
    const res = await this.$axios.post(`${urlPrefix}/login`, data);
    await commit('login', res.data);
    return res.data;
  },
};

const mutations = {
  login(state, res) {
    if (res.result === 'success') {
      const expiresDate = new Date(res.data.expired_at);
      addAmazic9Cookie('amazic9Token', res.data.token, expiresDate);
      addAmazic9Cookie('amazic9Email', res.data.email, expiresDate);
      addAmazic9Cookie('amazic9Expires', res.data.expired_at, expiresDate);
    }
  },
};

const getters = {
};

export default {
  state,
  actions,
  mutations,
  getters,
};
