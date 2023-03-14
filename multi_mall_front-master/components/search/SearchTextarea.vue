<template>
  <textarea class="search_textarea" v-model="inputValue"/>
</template>

<script>
export default {
  props: {
    classify: String,
    onChange: {
      type: Function,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      inputValue: '',
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      if (query[this.classify]) this.inputValue = query[this.classify];
      // if (query[this.classify]) {
      //   if (this.items.map((v) => v.value).includes(query[this.classify])) {
      //     this.inputValue = query[this.classify];
      //   }
      // }
    },
    reset() {
      this.inputValue = '';
    },
    getSelectedQuery() {
      const query = {};
      if (this.inputValue) query[this.classify] = this.inputValue;
      return query;
    },
    async change(e) {
      if (this.onChange) await this.onChange(e);
    },
  },
};
</script>

<style>
.search_textarea {
  resize: none !important;
  background-color: white;
  border: 1px solid #b7b7b7;
}
</style>
