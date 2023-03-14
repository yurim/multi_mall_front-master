/*
샘플용!~~!!!!!!!!!!!
 */

const state = () => ({
  books: [],
  book: {},
});

const actions = {
  async getBookList({ commit }) {
    const res = await this.$axios.get('getBooks/');
    await commit('setBooks', res.data);
  },
  async getBook({ commit }, id) {
    const res = await this.$axios.get(`getBook/${id}/`);
    await commit('setBook', res.data);
  },
  async createBook({ commit }, formData) {
    const res = await this.$axios.post('createBook/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await commit('setBook', res.data);
  },
  async patchBook(context, params) {
    await this.$axios.patch(`patchBook/${params.id}/`, params);
  },
  async deleteBook({ dispatch }, id) {
    await this.$axios.delete(`deleteBook/${id}/`);
    await dispatch('getBooks');
  },
};

const mutations = {
  setBooks(state, books) {
    state.books = books;
  },
  setBook(state, book) {
    state.book = book;
  },
};

const getters = {
  getBooks: (state) => state.books,
  getBook: (state) => state.book,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
