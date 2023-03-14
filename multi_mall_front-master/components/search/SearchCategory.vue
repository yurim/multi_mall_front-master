<template>
  <div>
    <div class="category_select_wrap">
      <ul v-for="(key, i) in Object.keys(categoryList)" v-bind:key="key">
        <li v-on:click="reset" v-if="i === 0 && path.indexOf('product/new') === -1">
          <a :class="isTotalChecked ? 'on' : ''">전체</a>
        </li>
        <template v-if="categoryList[key].length > 0">
          <template v-for="(category, idx) in categoryList[key]">
            <li v-if="category.is_show && path.indexOf('product/new') > -1" v-bind:key="`${key}_${idx}`" v-on:click="selectCategory(i + 1, category._id, category.path)">
              <a :class="category.isChecked ? 'on' : ''">{{ category.name }}</a>
            </li>
            <li v-else v-bind:key="`${key}_${idx}`" v-on:click="selectCategory(i + 1, category._id, category.path)">
              <a :class="category.isChecked ? 'on' : ''">{{ category.name }}</a>
            </li>
          </template>
        </template>
      </ul>
    </div>
    <div class="category_list_wrap">
      <span>선택한 카테고리 : </span>
      <ul>
        <template v-for="name in categoryNames">
          <li v-if="name" v-bind:key="`category_${name}`">{{ name }}</li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    classify: {
      type: String,
      default: '',
    },
    categoryNamePath: {
      type: Array,
      default: () => [],
    },
    categoryIdPath: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    path: '',
    isTotalChecked: true,
    categoryList: {
      first: [],
      second: [],
      third: [],
      fourth: [],
    },
    categoryIds: '',
    isLastDepthChecked: false,
  }),
  async created() {
    this.path = this.$router.currentRoute.path;
    const { query } = this.$route;
    const res = await this.$axios.get('super_admin/category');
    this.categoryList.first = res.data.data.categories;
    if (Object.prototype.hasOwnProperty.call(query, this.classify)) this.init(query[this.classify].split(','));
    else if (this.categoryIdPath.length > 0) this.init(this.categoryIdPath);
    else this.reset();
  },
  computed: {
    categoryNames() {
      if (this.categoryNamePath.length > 0) return this.categoryNamePath;
      const nameList = [];
      Object.keys(this.categoryList).forEach((key) => {
        Array.prototype.reduce.call(this.categoryList[key], (list, data) => {
          if (data.isChecked) list.push(data.name);
          return list;
        }, nameList);
      });
      return nameList;
    },
  },
  methods: {
    async init(values) {
      this.isTotalChecked = false;
      if (typeof values[0] === 'string') {
        this.categoryList.first.forEach((data) => {
          if (values[0] === data._id) data.isChecked = true;
          else data.isChecked = false;
        });
        const res = await this.$axios.get('super_admin/category', { params: { _id: values[0] } });
        this.categoryList.second = res.data.data.categories;
      }
      if (typeof values[1] === 'string') {
        this.categoryList.second.forEach((data) => {
          if (values[1] === data._id) data.isChecked = true;
          else data.isChecked = false;
        });
        const res = await this.$axios.get('super_admin/category', { params: { _id: values[1] } });
        this.categoryList.third = res.data.data.categories;
      }
      if (typeof values[2] === 'string') {
        this.categoryList.third.forEach((data) => {
          if (values[2] === data._id) data.isChecked = true;
          else data.isChecked = false;
        });
        const res = await this.$axios.get('super_admin/category', { params: { _id: values[2] } });
        this.categoryList.fourth = res.data.data.categories;
      }
      if (typeof values[3] === 'string') {
        this.categoryList.fourth.forEach((data) => {
          if (values[3] === data._id) data.isChecked = true;
          else data.isChecked = false;
        });
      }
    },
    reset() {
      this.categoryIds = '';
      this.categoryList.first.forEach((category) => { category.isChecked = false; });
      this.categoryList.second.splice(0, this.categoryList.second.length);
      this.categoryList.third.splice(0, this.categoryList.third.length);
      this.categoryList.fourth.splice(0, this.categoryList.fourth.length);
      this.isTotalChecked = true;
    },
    async setCategoryList(part, categoryId) {
      const res = await this.$axios.get('super_admin/category', { params: { _id: categoryId } });
      if (res.data.data.categories.length > 0) {
        res.data.data.categories.forEach((category) => {
          category.isChecked = false;
        });
        if (part === 1) this.categoryList.second = res.data.data.categories;
        if (part === 2) this.categoryList.third = res.data.data.categories;
        if (part === 3) this.categoryList.fourth = res.data.data.categories;
        this.isLastDepthChecked = false;
      } else {
        this.isLastDepthChecked = true;
      }
    },
    async selectCategory(part, categoryId, categoryPath) {
      if (this.isTotalChecked) this.isTotalChecked = false;
      if (part === 1) {
        this.categoryList.second.splice(0, this.categoryList.second.length);
        this.categoryList.third.splice(0, this.categoryList.third.length);
        this.categoryList.fourth.splice(0, this.categoryList.fourth.length);
        this.categoryList.first.forEach((category) => { category.isChecked = category._id === categoryId; });
      } else if (part === 2) {
        this.categoryList.third.splice(0, this.categoryList.third.length);
        this.categoryList.fourth.splice(0, this.categoryList.fourth.length);
        this.categoryList.second.forEach((category) => { category.isChecked = category._id === categoryId; });
      } else if (part === 3) {
        this.categoryList.fourth.splice(0, this.categoryList.fourth.length);
        this.categoryList.third.forEach((category) => { category.isChecked = category._id === categoryId; });
      } else if (part === 4) {
        this.categoryList.fourth.forEach((category) => { category.isChecked = category._id === categoryId; });
      }
      await this.setCategoryList(part, categoryId);
      this.categoryIds = categoryPath.replace(/^,|,$/g, '');
      this.$emit('setCategory', this.categoryIds, this.isLastDepthChecked);
    },
    getSelectedQuery() {
      const query = {};
      query[this.classify] = this.categoryIds;
      if (query[this.classify].length > 0) return query;
    },
  },
};
</script>
