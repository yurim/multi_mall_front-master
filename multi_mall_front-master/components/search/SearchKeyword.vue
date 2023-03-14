<template>
  <div style="display: flex; align-items: center">
    <client-only>
      <multi-select
        style="width: 140px;margin: 0 15px"
        v-model="selected"
        :placeholder="currentPlaceholder"
        :options="selectOptions"
        :allow-empty="false"
        :show-labels="false"
        :searchable="false"
      ></multi-select>
    </client-only>
    <input type="text" v-model="keyword" style="padding: 5px; border: 1px solid gray"/>
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
  data() {
    return {
      currentPlaceholder: '선택',
      selected: '',
      keyword: '',
      selectOptions: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.placeholder) this.currentPlaceholder = this.placeholder;
      this.selectOptions = this.items.map((v) => v.text);

      const { query } = this.$route;
      if (Object.prototype.hasOwnProperty.call(query, this.classify)) {
        this.selected = this.items.find((item) => item.value === query.keywordType).text;
        this.keyword = query[this.classify];
      } else {
        this.reset();
      }
    },
    reset() {
      this.selected = '';
      this.keyword = '';
    },
    getSelectedQuery() {
      const query = {};
      const keyword = this.keyword.trim();
      if (keyword && this.selected) {
        query.keywordType = this.items.find((item) => item.text === this.selected).value;
        query[this.classify] = keyword;
      }
      return query;
    },
  },
};
</script>
