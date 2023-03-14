<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">{{type === 'ASSCTN' ? '조합형' : '단독형'}} 이미지 적용 옵션명 선택</div>
            <div class="popup_text_wrap" v-if="params.imageInfo.length === 0">
              <ul class="explain_wrap color_main_01">
                <li> - 이미지를 적용할 옵션명을 선택해주세요. (복수선택 {{type === 'ASSCTN' ? '불가' : '가능'}})</li>
                <li> - 이미지가 등록된 후에는 값을 변경할 수 없습니다.</li>
                <li> - 이미지 등록이후 변경을 원하시면 옵션을 새로 등록해주셔야 합니다.</li>
              </ul>
              <ul class="list_wrap w_100">
                <li>
                  <table>
                    <colgroup>
                      <col width="40">
                      <col width="100">
                      <col width="300">
                    </colgroup>
                    <thead>
                      <tr>
                        <th v-if="type === 'ASSCTN'">선택</th>
                        <th v-else>
                          <div class="only_checkbox_wrap">
                            <input type="checkbox" id="options_all" v-model="allCheck">
                            <label for="options_all"></label>
                          </div>
                        </th>
                        <th>옵션명</th>
                        <th>옵션값</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(option, i) in options" :key="i">
                        <td>
                          <div>
                            <template v-if="type === 'ASSCTN'">
                              <div class="radio_wrap only">
                                <input type="radio" name="selectOption" :id="`pop_option_${option.id}`" :value="option" v-model="params.selectedOptions[0]">
                                <label :for="`pop_option_${option.id}`"></label>
                              </div>
                            </template>
                            <template v-else>
                              <div class="only_checkbox_wrap">
                                <input type="checkbox" :id="`pop_option_${option.id}`" :value="option" v-model="params.selectedOptions">
                                <label :for="`pop_option_${option.id}`"></label>
                              </div>
                            </template>
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
              <ul class="explain_wrap color_main_01">
                <li> - 옵션 이미지를 올리면, 상품상세 페이지에 함께 노출됩니다.</li>
                <li> - 권장 크기 : 1000 x 1000 (최소 300 x 300)</li>
                <li> - 파일 형식 : jpg, jpeg, gif, bmp (움직이는 이미지의 경우 첫 번째 컷이 등록됩니다.)</li>
              </ul>
              <ul class="list_wrap w_100">
                <li v-for="(imageInfo, i) in params.imageInfo" :key="`pop_image_option_${imageInfo.optionId}`">
                  <div class="title w_100 m_b_10">옵션명 : {{ imageInfo.optionName }}</div>
                  <div class="body w_100">
                    <div v-for="(image, j) in imageInfo.images" :key="`pop_image_option_image_${j}`" class="i_b">
                      <label :for="`option_image_${i}_${j}`" v-bind:class="j < imageInfo.images.length - 1 ? 'img_wrap m_r_10' : 'img_wrap'">
                        <img
                          :id="`pop_image_${i}_${j}`"
                          :src="image.image"
                          v-if="image.image.length > 0"
                        >
                        <a class="del_icon" :id="`delete_${imageInfo.optionId}_${j}`" v-if="image.image.length > 0" v-on:click="deleteImage(imageInfo.optionId, i, j)">X</a>
                        <a class="edit_icon" :id="`update_${i}_${j}`" v-if="image.image.length > 0" v-on:click="updateImage(image, i, j)">수정</a>
                        <span :class="image.image.length > 0 ? 'image_label_wrap display_none' : 'image_label_wrap'">&#10010;</span>
                      </label>
                      <div class="img_text_wrap text-center">{{ image.optionValue.name }}</div>
                      <input
                        type="file"
                        class="display_none"
                        accept="image/*"
                        :id="`option_image_${i}_${j}`"
                        :ref="`option_image_${i}_${j}`"
                        v-on:change="OptionImageUpload($event, image, i, j)"
                      >
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button class="line_btn" @click="cancel">취소</button>
              <button @click="imageApply" v-if="params.imageInfo.length === 0">이미지 등록</button>
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
import _ from 'lodash';
import PopupMixin from './popupMixin';
import Alert from './PopAlert';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    type: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: [],
    },
    images: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    params: {
      selectedOptions: [],
      imageDeletedOptions: [],
      imageInfo: [],
    },
    recommendFileSize: (10 * 1024 * 1024),
  }),
  computed: {
    allCheck: {
      get() {
        return this.options ? this.params.selectedOptions.length === this.options.length : false;
      },
      set(value) {
        let checkedOptionIds = [];
        if (value) {
          checkedOptionIds = this.options;
        }
        this.params.selectedOptions = checkedOptionIds;
      },
    },
  },
  methods: {
    imageApply() {
      if (this.params.selectedOptions.length > 0) {
        this.params.selectedOptions.forEach((selectedOption) => {
          const images = [];
          const option = _.find(this.options, (o) => o.id === selectedOption.id);
          if (option) {
            option.values.forEach((value) => {
              let image = '';
              let imageFile = {};
              const currentImage = this.images[`${option.id}_${value.id}`];
              if (currentImage) {
                image = currentImage.image;
                if (currentImage.imageFile instanceof File) {
                  // 이 팝업을 통해 수정된 이미지가 이미 있는 경우
                  imageFile = currentImage.imageFile;
                }
              }
              images.push({
                optionValue: value,
                image,
                imageFile,
              });
            });
          }

          this.params.imageInfo.push({
            optionId: option.id,
            optionName: option.name,
            images,
          });
        });
      } else {
        this.popAlert('이미지를 적용할 옵션명을 선택해주세요.');
      }
    },
    OptionImageUpload(e, image, parentIdx, childIdx) {
      let imageFile = null;
      try {
        imageFile = e.target.files[0];
      } catch {
        imageFile = this.$refs[`option_image_${parentIdx}_${childIdx}`][0].files[0];
      }

      if (imageFile) {
        if (this.recommendFileSize < imageFile.size) {
          this.popAlert('이미지 용량이 10MB를 초과합니다.');
        } else {
          image.image = window.URL.createObjectURL(imageFile);
          image.imageFile = imageFile;
        }
      }
    },
    deleteImage(optionId, parentIdx, childIdx) {
      const imageInfo = _.find(this.params.imageInfo, (info) => info.optionId === optionId);
      if (imageInfo) {
        const image = imageInfo.images[childIdx];
        if (image) {
          image.image = '';
          image.imageFile = {};
          document.getElementById(`pop_image_${parentIdx}_${childIdx}`).setAttribute('src', '');
          document.getElementById(`option_image_${parentIdx}_${childIdx}`).value = '';
          this.params.imageDeletedOptions.push(`${imageInfo.optionId}_${image.optionValue.id}`);
        }
      }
    },
    updateImage(image, parentIdx, childIdx) {
      this.OptionImageUpload('', image, parentIdx, childIdx);
    },
    ok() {
      if (this.okCallback) {
        let message = null;
        this.params.imageInfo.forEach((info) => {
          info.images.forEach((image) => {
            if (!image) {
              message = '이미지를 등록해주세요.';
              return false;
            }
          });
        });

        if (message) this.popAlert(message);
        else this.okCallback(this.params);
      }
    },
    popAlert(message) {
      new Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
});
</script>
