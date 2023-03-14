<template>
  <div :class="checkboxFixed ? 'checkbox_fixed' : ''">
      <v-data-table
        v-model="selected"
        :item-key="itemKey"
        :headers="tableHeaders"
        :items="items"
        :page="page"
        :items-per-page="pageSize"
        :show-select="selectType === 'multi'"
        hide-default-footer
        class="elevation-1"
        :loading="loading"
        :options.sync="options"
        :height="height"
        fixed-header
        :server-items-length="total"
        @page-count="pageCount = $event"
        :headers-length="headersLength"
      >
        <template v-slot:header="{ props, on }">
          <thead>
            <slot name="header" :props="props" :on="on" />
          </thead>
        </template>
        <template v-slot:body="{ items, isSelected, select }">
          <draggable
            class="list-group"
            tag="tbody"
            :list="items"
            handle=".handle"
            v-bind="dragOptions"
            @start="isDragging = true"
            @end="isDragging = false"
          >

            <slot name="groupBody" :items="items" :isSelected="isSelected" :select="select"/>

            <tr
              v-for="(item, itemIndex) in items"
              class="list-group-item"
            >
              <td v-if="selectType === 'multi'" :class="checkboxFixed ? 'fixed': ''">
                <v-checkbox
                  :input-value="isSelected(item)"
                  @change="select(item, !isSelected(item))"
                />
              </td>
              <td v-if="selectType === 'single'">
                <v-radio-group v-model="selectedItem">
                  <v-radio
                    :value="item"
                  ></v-radio>
                </v-radio-group>
              </td>
              <slot name="body" :item="item" :itemIndex="itemIndex" />
              <td v-if="draggable">
                <img src="../assets/handle.png" class="handle" alt="asd">
              </td>
            </tr>
          </draggable>
        </template>
      </v-data-table>

      <div class="paginationWrap pagenation_wrap">
        <button type="button" @click="onClickFirstPage" class="page_item"><div class="item_left"></div></button>
        <v-pagination v-model="page" :length="pageCount" :total-visible="7" />
        <button type="button" @click="onClickLastPage" class="page_item"><div class="item_right"></div></button>
        <v-text-field
          v-model="targetPage"
          label="페이지번호"
          solo
          class="shrink"
        />
        <v-btn @click="movePage">이동</v-btn>
        <select
          v-model.number="pageSize"
          v-if="showPageSize"
        >
          <option v-for="size in pageSizeList" :value="size">{{size}}</option>
        </select>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      default() {
        return [];
      },
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    onTableOption: {
      type: Function,
      default() {
        return null;
      },
    },
    checkboxFixed: {
      type: Boolean,
      default() {
        return false;
      },
    },
    loading: Boolean,
    height: { type: Number, default: undefined },
    selectType: { type: String, default: '' },
    draggable: { type: Boolean, default: false },
    defaultPage: { type: Number, default: 1 },
    defaultPageSize: { type: Number, default: 3 },
    itemKey: { type: String, default: 'id' },
    showPageSize: { type: Boolean, default: true },
    headersLength: { type: Number, default: null },
  },
  data() {
    return {
      isInit: false,
      selected: [],
      pageCount: 0,
      targetPage: null,
      options: {},
      page: this.defaultPage,
      pageSize: this.defaultPageSize,
      pageSizeList: [50, 100, 200],
      selectedItem: null,
      scrollEle: null,
    };
  },
  mounted() {
    console.log(this.checkboxFixed);
  },
  computed: {
    tableHeaders() {
      const copyHeaders = JSON.parse(JSON.stringify(this.headers));
      if (copyHeaders && copyHeaders.length > 0) {
        if (this.draggable) copyHeaders.push({ text: '이동', value: 'move', sortable: false });
        if (this.selectType === 'single') copyHeaders.unshift({ text: '선택', sortable: false });
      }
      return copyHeaders;
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
  watch: {
    options: {
      async handler() {
        if (!this.scrollEle) {
          this.scrollEle = document.getElementsByClassName('v-data-table__wrapper')[0];
        }
        this.page = this.options.page;
        const query = { ...this.$route.query };

        query.page = this.options.page;
        query.page_size = this.options.itemsPerPage;

        if (this.options.sortBy && this.options.sortBy.length > 0) {
          const sortName = this.options.sortBy[0];
          const sortType = this.options.sortDesc[0] ? 'desc' : 'asc';
          query.sort_name = sortName;
          query.sort_type = sortType;
        } else {
          delete query.sort_name;
          delete query.sort_type;
        }

        await this.$router.replace({ query }, () => {});
        if (this.onTableOption) {
          if (!this.isInit) this.isInit = true;
          else await this.onTableOption(query);
        }

        this.$nextTick(() => {
          this.scrollEle.scrollTop = 0;
        });
      },
    },
    items() {
      this.resetSelected();
    },
    pageSize() {
      this.options.itemsPerPage = parseInt(this.pageSize, 10);
    },
  },
  created() {
    if (this.items.length > 0) this.selectedItem = this.items[0];
    this.initUrlQuery();
  },
  methods: {
    initUrlQuery() {
      const initOptions = { ...this.$route.query };
      if (this.$route.query.page) {
        initOptions.page = parseInt(this.$route.query.page, 10);
      }
      if (this.$route.query.page_size) {
        initOptions.itemsPerPage = parseInt(this.$route.query.page_size, 10);
      }
      if (this.$route.query.sort_name && this.$route.query.sort_type) {
        initOptions.sortBy = [this.$route.query.sort_name];
        initOptions.sortDesc = [this.$route.query.sort_type === 'desc'];
      }
      this.options = initOptions;
    },
    movePage() {
      if (this.targetPage) this.targetPage = this.targetPage.trim();
      const pageInteger = parseInt(this.targetPage, 10);
      if (Number.isInteger(pageInteger)) {
        this.targetPage = pageInteger;
        this.page = parseInt(this.targetPage, 10);
      }
      this.targetPage = '';
    },
    reset() {
      this.options.sortBy.shift();
      this.options.sortDesc.shift();
      this.page = this.defaultPage;
      this.pageSize = this.defaultPageSize;
    },
    getDefaultQuery() {
      return {
        page: this.defaultPage,
        page_size: this.defaultPageSize,
      };
    },
    getSelectedItems() {
      return this.selected;
    },
    getSelectedItem() {
      return this.selectedItem;
    },
    resetSelected() {
      this.selected = [];
      this.selectedItem = null;
    },
    onClickFirstPage() {
      this.page = 1;
      this.targetPage = '';
    },
    onClickLastPage() {
      this.page = this.pageCount;
      this.targetPage = '';
    },
  },
};
</script>

<style lang="scss">
  .v-application { font-family: 'Roboto', 'Noto Sans KR', Dotum, 돋움, sans-serif !important; }
  .v-application .title{ font-family: 'Roboto', 'Noto Sans KR', Dotum, 돋움, sans-serif !important;  }
  .v-application { box-shadow: none !important;
    .elevation-1 { box-shadow: none !important; }
  }
  .v-data-table { border: 1px solid #d9d9d9; }

  .v-application {
    .primary--text { color: #4E4E4E !important; caret-color: #4E4E4E !important; }
  }
  .v-application--wrap { min-height: auto; }
  .flip-list-move { transition: transform 0.5s; }
  .no-move { transition: transform 0s; }
  .ghost { opacity: 0.5; background: #c8ebfb; }

  .handle {
    float: left;
    width: 20px;
    margin-right: 15px;
    cursor: move;
  }

  .list-group { min-height: 20px; }
  .list-group-item {
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.125);
  }
  .list-group-item i { cursor: pointer; }

  table img { width: 100px; margin: 5px 0; }

  .paginationWrap {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    .v-input {
      margin-left: 15px !important;
      width: 110px;
      height: 30px;
      min-height: 30px;
      .v-input__control {
        min-height: 30px !important;
      .v-input__slot {
        box-shadow: none !important;
        .v-text-field__slot {
          border-bottom: 1px solid #ccc;
          text-indent: 10px;
          input { width: 150px;
            border: 0 !important;
            padding-right: 31px;
          }
        }
      }
      }
    }
    label { top: 6px !important; }
    button {
      border: 0;
      margin-left: 15px;box-shadow: none !important; border-radius: 0;
      background: transparent !important; padding: 0 !important;
    span {
      display: inline-block;
      width: 25px;
      height: 30px;
      background: url('../assets/img/user/icon/m_search.png') no-repeat center;
      background-size: 18px;
      text-indent: -9999px;
      cursor: pointer;
      margin-left: 10px;
    }
      .v-ripple__container { display: none !important; }
    }
    .v-btn:not(.v-btn--round).v-size--default {
      width: 25px !important;
      min-width: 25px !important;
      height: 30px !important;
      padding-left: 5px !important;
    }
    .v-btn:before { display: none !important; }
    select {
      width: 100px;margin-left: 50px;
    }
  }
  // 어드민 카테고리
  .admin_ztree_wrap{
    button { border: 0 !important;}
    .v-treeview-node__content { cursor: pointer !important; }
    .v-ripple__container { display: none !important; }
    .v-icon.v-icon::after { display: none !important; }
  }

  .twoTableWrap {
    display: flex;
    margin: 0 50px;
    > div {
      margin: 0 15px;
    }
  }

  .dataTable {
    > div { overflow-y: scroll; }
    a { color: black !important; text-decoration: underline !important; }
  }

  .multiselect {
    width: 70px;
  }

</style>
