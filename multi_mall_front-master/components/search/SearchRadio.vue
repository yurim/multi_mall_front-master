<template>
  <div class="radio_wrap">
    <template v-for="item in items" >
      <input v-model="selected" type="radio" :name="classify" :value="item.value" :id="`item_value_${item.value}`">
      <label :key="item.value" :for="`item_value_${item.value}`">{{ item.text }}</label>
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
  },
  data() {
    return {
      selected: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      if (Object.prototype.hasOwnProperty.call(query, this.classify)) {
        this.selected = query[this.classify];
      } else {
        this.reset();
      }
    },
    reset() {
      let targetItem;
      this.items.some((item) => {
        if (item.isChecked) targetItem = item;
        return (item.isChecked);
      });
      // eslint-disable-next-line prefer-destructuring
      if (!targetItem) targetItem = this.items[0];
      this.selected = targetItem.value;
    },
    getSelectedQuery() {
      const query = {};
      query[this.classify] = this.selected;
      return query;
    },
  },
};
</script>
