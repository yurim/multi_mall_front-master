<template>
  <div class="form_wrap m_b_20">
    <slot />
    <div class="but_wrap text-center">
      <button class="line_but" @click.prevent="reset">
        초기화
      </button>
      <button @click.prevent="search">
        검색
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    names: {
      type: Array,
      default() {
        return [];
      },
    },
    refList: {
      type: Array,
      default() {
        return [];
      },
    },
    onSearch: {
      type: Function,
      default() {
        return null;
      },
    },
    onReset: {
      type: Function,
      default() {
        return null;
      },
    },
  },
  data: () => ({
    dataTableQueryList: [
      'page', 'page_size', 'sort_type', 'sort_name',
    ],
  }),
  mounted() {
  },
  methods: {
    getChildList() {
      const searchRegExp = /^search/g;
      const parentRefs = this.$parent.$refs;
      const childList = [];
      Object.keys(parentRefs).forEach((key) => {
        if (key.match(searchRegExp)) childList.push(parentRefs[key]);
      });
      return childList;
    },
    async search() {
      const childList = this.getChildList();
      const query = { ...this.$route.query };
      Object.keys(query).forEach((key) => {
        if (!this.dataTableQueryList.includes(key)) delete query[key];
      });

      const promises = [];
      childList.forEach((child) => {
        const selectedQuery = child.getSelectedQuery();
        if (selectedQuery) promises.push(selectedQuery);
      });
      const queryList = await Promise.all(promises);
      Object.assign(query, ...queryList);

      await this.$router.replace({ query }, () => {});
      if (this.onSearch) await this.onSearch(query);
    },
    async reset() {
      const childList = this.getChildList();
      childList.forEach((child) => {
        if (child.reset) child.reset();
      });

      let query = {};
      if (this.$parent.$refs.dataTable) {
        const dataTable = this.$parent.$refs.dataTable;
        dataTable.reset();
        query = dataTable.getDefaultQuery();
      }
      await this.$router.replace({ query }, () => {});
      if (this.onReset) await this.onReset(query);
    },
  },
};
</script>

<style>
  button {
    margin-right: 10px;
    padding: 5px 10px;
    /*border: 2px solid #000;*/
    border-radius: 3px;
  }
</style>
