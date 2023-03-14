<template>
  <div class="checkbox_wrap">
    <template v-for="item in copiedItems">
      <input v-model="item.isChecked" v-bind:key="item.text" :id="item.text" type="checkbox">
      <label :for="item.text">
        {{ item.text }}
      </label>
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
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      copiedItems: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      if (Object.prototype.hasOwnProperty.call(query, this.classify)) {
        const values = query[this.classify];
        const newItems = JSON.parse(JSON.stringify(this.items));
        newItems.forEach((item) => {
          if (values.includes(item.value)) item.isChecked = true;
        });
        this.copiedItems = newItems;
      } else {
        this.reset();
      }
    },
    reset() {
      this.items.forEach((item) => {
        if (typeof item.isChecked === 'undefined') item.isChecked = true;
      });
      this.copiedItems = JSON.parse(JSON.stringify(this.items));
    },
    getSelectedQuery() {
      const query = {};
      query[this.classify] = String(this.copiedItems
        .filter((item) => item.isChecked)
        .map((item) => item.value));
      if (query[this.classify].length > 0) return query;
    },
  },
};
</script>
