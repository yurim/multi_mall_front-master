import { mapGetters } from 'vuex';

const prefix = 'super_admin/category';

export default {
  data: () => ({
    active: [],
    selectedCategory: {
      name: '',
      is_show: false,
      naver_category_id: '',
    },
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getRootCategory`);
    await store.dispatch(`${prefix}/getCategories`);
  },
  computed: {
    ...mapGetters({
      categories: `${prefix}/categories`,
    }),
    categoryNameLength() {
      if (!this.selectedCategory.name) return 0;
      return this.selectedCategory.name.length;
    },
  },
  watch: {
    active() {
      if (this.active.length > 0) {
        this.selectedCategory._id = this.active[0]._id;
        this.selectedCategory.name = this.active[0].name;
        this.selectedCategory.naver_category_id = this.active[0].naver_category_id;
        this.selectedCategory.is_show = this.active[0].is_show;
      }
    },
  },
  methods: {
    async fetchItems(item) {
      const query = {};
      if (item) query._id = item._id;
      const res = await this.$store.dispatch(`${prefix}/getCategories`, query);
      if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

      if (item) item.children = this.setChildren(res.data.categories);
      else await this.$store.commit(`${prefix}/setCategories`, res.data);
    },
    setChildren(categories) {
      categories.forEach((category) => {
        if (category.hasChild) category.children = [];
      });
      return categories;
    },
    getSiblingCategoriesById(list, categoryId) {
      const category = list.find((item) => item._id === categoryId);
      if (!category) {
        let findList = null;
        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          if (item.children) {
            findList = this.getSiblingCategoriesById(item.children, categoryId);
            if (findList) break;
          }
        }
        return findList;
      }
      return list;
    },
    getParentCategory(list, categoryId) {
      let parent = null;
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        if (item.children) {
          const category = item.children.find((v) => v._id === categoryId);
          if (category) {
            parent = item;
            break;
          } else {
            const newParent = this.getParentCategory(item.children, categoryId);
            if (newParent) {
              parent = newParent;
              break;
            }
          }
        }
      }
      return parent;
    },
    updateCategories(updateList) {
      updateList.forEach((category) => {
        if (!category.naver_category_id) delete category.naver_category_id;
      });
      this.$createLoading(async () => {
        const res = await this.$axios.$put(`${prefix}/update`, { categories: updateList });
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
      });
    },
    initChangeOrder(offset) {
      this.categoryId = this.active[0]._id;
      this.siblingCategories = this.getSiblingCategoriesById(this.categories, this.categoryId);
      this.currentIndex = this.siblingCategories.findIndex((v) => v._id === this.categoryId);
      this.category = this.siblingCategories[this.currentIndex];

      // 이미 최상단 또는 최하단 이라면, changeTarget = undefined
      if (!offset) return true;
      this.changeTarget = this.siblingCategories[this.currentIndex + offset];
      return !!this.changeTarget;
    },
    changeOrder(offset) {
      if (!this.initChangeOrder(offset)) return;

      // order 스왑
      const order = this.category.order;
      this.category.order = this.changeTarget.order;
      this.changeTarget.order = order;

      // categories 에서 스왑
      this.siblingCategories.splice(this.currentIndex, 1);
      this.siblingCategories.splice(this.currentIndex + offset, 0, this.category);

      this.updateCategories([this.category, this.changeTarget]);
    },
    changeOrderTopBottom(offset) {
      if (!(this.initChangeOrder(offset))) return;

      // categories 에서 스왑 && order 다시 셋팅
      this.siblingCategories.splice(this.currentIndex, 1);
      if (offset < 0) this.siblingCategories.unshift(this.category);
      else this.siblingCategories.push(this.category);
      this.siblingCategories.forEach((v, i) => { v.order = i; });

      this.updateCategories(this.siblingCategories);
    },
    hasActiveCategory() {
      if (this.active.length <= 0) {
        this.$popup.showAlertPopup('카테고리를 선택해주세요.');
        return false;
      }
      return true;
    },
    up() {
      if (!this.hasActiveCategory()) return;
      this.changeOrder(-1);
    },
    down() {
      if (!this.hasActiveCategory()) return;
      this.changeOrder(+1);
    },
    top() {
      if (!this.hasActiveCategory()) return;
      this.changeOrderTopBottom(-1);
    },
    bottom() {
      if (!this.hasActiveCategory()) return;
      this.changeOrderTopBottom(+1);
    },
    createCategory() {
      if (!this.hasActiveCategory()) return;
      this.$createLoading(async () => {
        const res = await this.$axios.$post(`${prefix}/create`, { _id: this.active[0]._id });
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

        if (typeof this.active[0].children === 'undefined') this.$set(this.active[0], 'children', [res.data.category]);
        else if (this.active[0].children.length > 0) this.active[0].children.push(res.data.category);
      });
    },
    async deleteCategory() {
      if (!this.hasActiveCategory()) return;
      // 등록된 상품 존재 여부 확인
      const hasProducts = await this.$store.dispatch(`${prefix}/hasProducts`, { category_id: this.active[0]._id });
      if (hasProducts.data.has_products) {
        new this.$popup.Alert({
          propsData: {
            title: '등록된 상품이 존재하여 삭제할 수 없습니다.',
            okCallback: async (params) => params.$destroy(),
          },
        }).$mount();
        return;
      }
      if (this.active[0].children) return this.$popup.showAlertPopup('하위 카테고리가 없는 카테고리만 삭제할 수 있습니다.');

      this.initChangeOrder();
      this.siblingCategories.splice(this.currentIndex, 1);
      this.category.is_deleted = true;
      this.updateCategories([this.category]);
    },
    async updateCategory() {
      if (!this.hasActiveCategory()) return;

      const category = this.active[0];
      category.name = this.selectedCategory.name;
      category.naver_category_id = this.selectedCategory.naver_category_id;
      category.is_show = this.selectedCategory.is_show;

      // 노출함으로 변경
      if (this.selectedCategory.is_show) {
        return this.updateCategories([category]);
      }

      // 노출안함으로 변경
      // 등록된 상품 존재 여부 확인
      const hasProducts = await this.$store.dispatch(`${prefix}/hasProducts`, { category_id: category._id });
      if (hasProducts.data.has_products) {
        // 상품 존재
        new this.$popup.Confirm({
          propsData: {
            title: '등록된 상품이 존재합니다. 노출안함 상태로 변경하시겠습니까?',
            okCallback: async (params) => {
              this.updateCategories([category]);
              params.$destroy();
            },
            cancelCallback: () => {
              this.selectedCategory.is_show = true;
              category.is_show = true;
            },
          },
        }).$mount();
      } else {
        // 상품 존재하지 않음
        this.updateCategories([category]);
      }
    },
  },
};
