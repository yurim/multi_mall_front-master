const prefix = 'store_admin/template/abroad_product';

const state = () => ({
  abroad: {},
});

const actions = {
  async getTemplate({ commit }, data) {
    const res = await this.$axios.get(`${prefix}`, { params: data });
    await commit('setTemplate', res.data);
  },
  async patchTemplate(context, formData) {
    return await this.$axios.post(`store_admin/template/${formData.get('id')}`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  },
};

const mutations = {
  setTemplate(state, res) {
    state.abroad = res.data.template;
  },
};

const getters = {
  abroad: (state) => state.abroad,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
