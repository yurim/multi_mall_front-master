<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">옵션값 변경</div>
            <div class="popup_text_wrap" v-if="params.values.length === 0">
              <ul class="explain_wrap color_main_01">
                <li> - 옵션값을 변경할 옵션을 선택하여 옵션값을 변경합니다.</li>
                <li> - 한번에 하나의 옵션명을 선택하여 옵션값을 변경할 수 있습니다.</li>
              </ul>
              <ul class="list_wrap w_100">
                <li>
                  <table>
                    <colgroup>
                      <col width="50">
                      <col width="100">
                      <col width="300">
                    </colgroup>
                    <thead>
                      <tr>
                        <th>선택</th>
                        <th>옵션명</th>
                        <th>옵션값</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(option, i) in options" :key="i">
                        <td>
                          <div class="radio_wrap only">
                            <input type="radio" name="selectOption" :id="option.name" :value="`${i}`" @click="checkOption">
                            <label :for="option.name"></label>
                          </div>
                        </td>
                        <td>{{ option.name }}</td>
                        <td>{{ option.valueNameArray.toString() }}</td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
            <div class="popup_text_wrap" v-else>
              <ul class="option_change_list">
                <li>
                  <div class="option_title">기존 옵션값</div>
                  <div class="option_title">변경할 옵션값</div>
                </li>
                <li v-for="(values, i) in params.values" :key="i">
                  <div>
                    <span class="option_info_txt">{{ values.currentValue }}</span>
                  </div>
                  <i class="right_arrow_icon"></i>
                  <div>
                    <span><input type="text" v-model="values.newValue" placeholder="변경할 옵션값을 입력해주세요." class="w_100"></span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button class="line_btn" @click="cancel">취소</button>
              <button @click="updateOptionValue" v-if="params.values.length === 0">옵션값 변경</button>
              <button @click="ok" v-else>적용</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    options: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    params: { idx: [], values: [], optionId: null },
  }),
  methods: {
    checkOption(e) {
      this.params.idx = e.target.value;
    },
    updateOptionValue() {
      if (this.params.idx) {
        const optionValues = this.options[this.params.idx].values;
        this.params.optionId = this.options[this.params.idx].id;
        optionValues.forEach((optionValue) => {
          this.params.values.push({
            valueId: optionValue.id,
            currentValue: optionValue.label.trim(),
            newValue: '',
          });
        });
      } else {
        this.$popup.showAlertPopup('옵션값을 변경할 옵션을 선택해주세요.');
      }
    },
    ok() {
      this.params.values.forEach((valueParam) => {
        if (valueParam.newValue.length < 1) { // 새로운 옵션값 입력하지 않았을 경우(공백) 기존 옵션값을 넣어줌
          valueParam.newValue = valueParam.currentValue;
        }
      });
      if (this.okCallback) this.okCallback(this.params);
    },
  },
});
</script>
