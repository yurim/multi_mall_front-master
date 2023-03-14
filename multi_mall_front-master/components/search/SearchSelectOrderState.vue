<template>
  <div class="select_input_wrap">
    <template>
      <select v-model="query.orderState">
        <option v-for="item in orderStates" :value="item.value">{{item.text}}</option>
      </select>
      <select v-model="query.orderSubState" :disabled="query.orderState !== deliveryWait">
        <option v-for="item in orderSubStates" :value="item.value">{{item.text}}</option>
      </select>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    orderStates: {
      type: Array,
      default() { return []; },
    },
    orderSubStates: {
      type: Array,
      default() { return []; },
    },
  },
  data(vm) {
    return {
      deliveryWait: 'DLVRY_WAIT',
      query: {
        orderState: vm.orderStates.length > 0 ? vm.orderStates[0].value : '',
        orderSubState: vm.orderSubState.length > 0 ? vm.orderSubState[0].value : '',
      },
    };
  },
  watch: {
    'query.orderState': function orderState(newVal) {
      if (newVal !== this.deliveryWait) this.query.orderSubState = '';
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      if (query.orderState) this.query.orderState = query.orderState;
      if (query.orderSubState) this.query.orderSubState = query.orderSubState;
    },
    reset() {
      this.query.orderState = '';
      this.query.orderSubState = '';
    },
    getSelectedQuery() {
      const query = {};
      if (this.query.orderState) query.orderState = this.query.orderState;
      if (this.query.orderSubState) query.orderSubState = this.query.orderSubState;
      return query;
    },
  },
};
</script>
