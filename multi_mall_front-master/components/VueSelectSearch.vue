<template>
  <vue-select
    v-model="selected"
    :options="items"
    :filterable="false"
    @open="onOpen"
    @close="onClose"
    :label="value"
    @search="query => search = query"
    @input="change"
    :placeholder="placeholder"
    :disabled="disabled">
    <template #list-header>
      <li ref="searching" class="loader" v-show="showSearching">
        검색 중···
      </li>
    </template>
    <template #list-footer>
      <li :ref="`${selectId}-load`" :class="`${selectId}-loader`" v-show="hasNextPage">
        불러오는 중···
      </li>
    </template>
    <template v-if="!showSearching" #no-options="{ search, searching, loading }">
      결과가 없습니다.
    </template>
    <template v-else #no-options="{ search, searching, loading }">
      &nbsp;
    </template>
  </vue-select>
</template>

<script>
export default {
  name: 'VueSelectSearch',
  props: {
    selectId: {
      type: String,
      default: 'default',
    },
    value: String,
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    currPage: {
      type: Number,
      default() {
        return 0;
      },
    },
    totalCount: {
      type: Number,
      default() {
        return 0;
      },
    },
    pageSize: {
      type: Number,
      default() {
        return 0;
      },
    },
    onChange: {
      type: Function,
      default() {
        return null;
      },
    },
    onSelect: {
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
    placeholder: {
      type: String,
      default() {
        return null;
      },
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    classify: {
      type: String,
      default() {
        return null;
      },
    },
    query: {
      type: String,
      default() {
        return 'value';
      },
    },
  },
  data() {
    return {
      selected: '',
      observer: null,
      search: '',
      temp: null,
      showSearching: false,
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(this.infiniteScroll);
  },
  watch: {
    async search(newValue) {
      const intervalCall1000 = this.intervalCall(1000, newValue);
      (await intervalCall1000)(async () => {
        if (this.onChange) {
          const query = {
            keyword: newValue,
            page: 1,
            page_size: this.pageSize,
          };
          await this.onChange('search', query);
          this.showSearching = false;
        }
      });
    },
  },
  computed: {
    hasNextPage() {
      if (this.currPage === 0 && this.pageSize === 0 && this.totalCount === 0) return true;
      return this.currPage * this.pageSize < this.totalCount;
    },
  },
  methods: {
    async intervalCall(interval, text) {
      this.temp = text;
      this.showSearching = true;
      return (fn) => {
        setTimeout(() => {
          if (this.temp === text) {
            fn();
          }
        }, interval);
      };
    },
    async onOpen() {
      if (this.onReset) {
        await this.onChange('search', null);
        this.observer.observe(this.$refs[`${this.selectId}-load`]);
      }
    },
    onClose() {
      this.observer.disconnect();
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent;
        const scrollTop = target.offsetParent.scrollTop;
        const query = {
          keyword: this.search,
          page: this.currPage + 1,
          page_size: this.pageSize,
        };
        await this.onChange('page', query);
        ul.scrollTop = scrollTop;
      }
    },
    async change(e) {
      if (this.onSelect) {
        if (e) e.selectId = this.selectId;
        else e = { selectId: this.selectId };
        await this.onSelect(e);
      }
    },
    reset() {
      this.selected = null;
    },
    getSelectedQuery() {
      const query = {};
      if (this.selected) query[this.classify] = this.selected[this.query];
      return query;
    },
  },
};
</script>

<style scoped>

</style>
