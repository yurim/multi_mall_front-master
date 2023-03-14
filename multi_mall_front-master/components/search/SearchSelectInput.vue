<template>
  <div class="select_input_wrap">
    <template>
      <select name="" id="" v-model="query.keywordType">
        <option v-for="item in items" :value="item.value">{{item.text}}</option>
      </select>
      <input type="text" v-model="query[classify]" :placeholder="placeholder" v-on:keypress.enter="search">
    </template>
  </div>
</template>

<script>
export default {
  props: {
    classify: {
      type: String,
      default: null,
    },
    items: {
      type: Array,
      default() { return []; },
    },
    placeholder: {
      type: String,
      default: null,
    },
  },
  data(vm) {
    return {
      query: {
        [vm.classify]: '',
        keywordType: vm.items.length > 0 ? vm.items[0].value : '',
      },
      selected: '',
      keyword: '',
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route) {
        const { query } = this.$route;
        if (query.keyword_type) this.query.keywordType = query.keyword_type;
        if (query[this.classify]) this.query[this.classify] = query[this.classify];
      }
    },
    reset() {
      this.query[this.classify] = '';
      this.query.keywordType = '';
    },
    async getSelectedQuery() {
      const query = {};
      const keyword = this.query[this.classify].trim();
      if (keyword) {
        if (this.query.keywordType) query.keyword_type = this.query.keywordType;
        if (this.query.keyword) query[this.classify] = keyword;
      }
      return query;
    },
    search() {
      const parent = this.$parent;
      if (parent._name.toLowerCase().includes('searchform')) {
        parent.search();
      }
    },
  },
};
</script>
