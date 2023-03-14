<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container width_l">

          <div class="popup_wrap">
            <div class="popup_title text-center">대표/옵션이미지 사이즈 수정</div>
            <div>
              <div class="option_list">
                <span v-for="target in target_list" :id="target.value" :class="{'active': target.value === params.target_image}"
                      @click="params.target_image = target.value">
                  {{target.name}}
                </span>
              </div>
              <div class="text_select_wrap m_b_10">
                <span class="title">기준 : </span>
                <div class="body">
                  <select v-model="params.gravity">
                    <option v-for="gravity in gravity_list" :value="gravity.value">
                      {{ gravity.name }}
                    </option>
                  </select>
                </div>
              </div>
              <ul class="input_txt_wrap m_b_10">
                <li>
                  <div class="input_txt">
                    <span>가로</span>
                    <input type="number" v-model="params.width" placeholder="가로는 중앙을 기준으로 변경">
                    <span>%</span>
                  </div>
                </li>
                <li>
                  <div class="input_txt">
                    <span>세로</span>
                    <input type="number" v-model="params.height" placeholder="세로는 하단을 기준으로 변경">
                    <span>%</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">확인</button>
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
  props: ['reason'],
  data: () => ({
    target_list: [
      { value: 'main', name: '메인이미지' },
      { value: 'additional', name: '추가이미지' },
      { value: 'detail', name: '상세이미지' },
      { value: 'option', name: '옵션이미지' },
    ],
    gravity_list: [
      { value: 'left-top', name: '왼쪽-위' },
      { value: 'left-center', name: '왼쪽-중간' },
      { value: 'left-bottom', name: '왼쪽-아래' },
      { value: 'center-top', name: '중간-위' },
      { value: 'center', name: '중간' },
      { value: 'center-bottom', name: '중간-아래' },
      { value: 'right-top', name: '오른쪽-위' },
      { value: 'right-center', name: '오른쪽-중간' },
      { value: 'right-bottom', name: '오른쪽-아래' },
    ],
    params: {
      target_image: 'main',
      gravity: 'center',
      width: null,
      height: null,
    },
  }),
  methods: {},
});
</script>
