<template>
  <select v-model="selectedItem" @change="change">
    <option v-for="item in items" :value="item.value">{{item.text}}</option>
  </select>
</template>

<script>
export default {
  props: {
    classify: String,
    items: Array,
    onChange: {
      type: Function,
      default() {
        return null;
      },
    },
  },
  data(vm) {
    return {
      selectedItem: vm.items.length > 0 ? vm.items[0].value : '',
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      if (query[this.classify]) {
        if (this.items.map((v) => v.value).includes(query[this.classify])) {
          this.selectedItem = query[this.classify];
        }
      }
    },
    reset() {
      if (this.items.length > 0) this.selectedItem = this.items[0].value;
    },
    getSelectedQuery() {
      const query = {};
      if (this.selectedItem) query[this.classify] = this.selectedItem;
      return query;
    },
    async change(e) {
      if (this.onChange) await this.onChange(e);
    },
  },
};
</script>
