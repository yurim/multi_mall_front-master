<template>
  <div class="select_date_wrap__content_wrap">
    <select name="" id="" v-model="query.date_type" v-if="dateTypes.length > 0">
      <option v-for="item in dateTypes" :value="item.value">{{item.text}}</option>
    </select>

    <div class="day_wrap">
      <a href="javascript:;" @click="setPeriod(period.type)" v-for="period in periods"
         v-bind:class="{on: periodTypeData===period.type}">{{period.name}}</a>
    </div>

    <div class="date_input_wrap">
      <client-only>
        <div>
          <v-menu
            v-model="menu"
            transition="scale-transition"
            :close-on-content-click="false"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dates"
              range
              no-title
              @input="inputChange"
              :allowed-dates="allowedDates"
            ></v-date-picker>
          </v-menu>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    periodType: {
      type: String,
      default: 'all',
    },
    dateTypes: {
      type: Array,
      default() {
        return [];
      },
    },
    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    startClassify: {
      type: String,
      default: 'start_date',
    },
    endClassify: {
      type: String,
      default: 'end_date',
    },
  },
  data: (vm) => ({
    menu: false,
    dates: [],
    query: {
      [vm.startClassify]: null,
      [vm.endClassify]: null,
      date_type: vm.dateTypes.length > 0 ? vm.dateTypes[0].value : '',
    },
    periods: [
      { type: 'all', name: '전체' },
      { type: 'ystrdy', name: '어제' },
      { type: 'today', name: '오늘' },
      { type: 'week', name: '1주일' },
      { type: 'month', name: '1개월' },
      { type: '3month', name: '3개월' },
      { type: '6month', name: '6개월' },
    ],
    periodTypeData: vm.periodType,
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(' ~ ');
    },
    isDateValid() {
      return this.query[this.startClassify] && this.query[this.endClassify];
    },
  },
  created() {
    this.init();
  },
  methods: {
    allowedDates(val) {
      return val <= this.$moment().format(this.dateFormat);
    },
    inputChange() {
      if (this.dates.length === 1) {
        this.periodTypeData = null;
        this.query[this.startClassify] = this.dates[0];
        this.query[this.endClassify] = null;
      }
      if (this.dates.length >= 2) {
        this.menu = false;
        this.dates.sort();
        this.query[this.startClassify] = this.dates[0];
        this.query[this.endClassify] = this.dates[1];
      }
    },
    init() {
      if (this.$route) {
        const { query } = this.$route;
        Object.keys(query).forEach((key) => {
          if (Object.keys(this.query).includes(key)) this.query[key] = query[key];
        });
      }
      if (!this.isDateValid) {
        this.reset();
      } else {
        this.setRange();
        this.periodTypeData = null;
      }
    },
    setRange() {
      if (this.isDateValid) {
        this.dates = [this.query[this.startClassify], this.query[this.endClassify]];
      } else {
        this.dates = [];
      }
    },
    reset() {
      this.periodTypeData = this.periodType;
      this.query.date_type = this.dateTypes.length > 0 ? this.dateTypes[0].value : '';
      this.setPeriod(this.periodTypeData);
    },
    getSelectedQuery() {
      const query = { ...this.query };
      if (this.periodTypeData === 'all') {
        return {};
      }
      if (!this.isDateValid) this.reset();
      return query;
    },
    setPeriod(periodType) {
      this.periodTypeData = periodType;
      switch (this.periodTypeData) {
        case 'ystrdy':
          this.query[this.startClassify] = this.$moment().subtract(1, 'days').format(this.dateFormat);
          this.query[this.endClassify] = this.$moment().subtract(1, 'days').format(this.dateFormat);
          break;
        case 'today':
          this.query[this.startClassify] = this.$moment().format(this.dateFormat);
          this.query[this.endClassify] = this.$moment().format(this.dateFormat);
          break;
        case 'week':
          this.query[this.startClassify] = this.$moment().subtract(1, 'weeks').add(1, 'days').format(this.dateFormat);
          this.query[this.endClassify] = this.$moment().format(this.dateFormat);
          break;
        case 'month':
          this.query[this.startClassify] = this.$moment().subtract(1, 'months').add(1, 'days').format(this.dateFormat);
          this.query[this.endClassify] = this.$moment().format(this.dateFormat);
          break;
        case '3month':
          this.query[this.startClassify] = this.$moment().subtract(3, 'months').add(1, 'days').format(this.dateFormat);
          this.query[this.endClassify] = this.$moment().format(this.dateFormat);
          break;
        case '6month':
          this.query[this.startClassify] = this.$moment().subtract(6, 'months').add(1, 'days').format(this.dateFormat);
          this.query[this.endClassify] = this.$moment().format(this.dateFormat);
          break;
        case 'all':
        default:
          this.query[this.startClassify] = '';
          this.query[this.endClassify] = '';
      }
      const abbr = this.$moment().zoneAbbr(); // 'KST'
      this.query[this.startClassify] = this.query[this.startClassify].replace(abbr, '');
      this.query[this.endClassify] = this.query[this.endClassify].replace(abbr, '');

      this.setRange();
    },
  },
};
</script>

<style lang="scss">
.v-date-picker-table {
   height: 320px;
 }
.select_date_wrap__content_wrap {
  input { height: 32px !important; }
}
</style>
