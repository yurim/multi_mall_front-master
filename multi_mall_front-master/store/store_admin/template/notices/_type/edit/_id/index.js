const prefix = 'store_admin/template';

const state = () => ({
  notice: {},
});

const actions = {
  async getNotice({ commit }, params) {
    const res = await this.$axios.get(`${prefix}/${params.id}`);
    await commit('setNotice', res.data);
  },
  async deleteTemplate(context, data) {
    return await this.$axios.put(`${prefix}/delete`, data);
  },
  async updateTemplate(context, formData) {
    return await this.$axios.post(`${prefix}/${formData.get('id')}`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  },
};

const mutations = {
  setNotice(state, res) {
    state.notice = res.data.data;
  },
};

const getters = {
  notice: (state) => state.notice,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
