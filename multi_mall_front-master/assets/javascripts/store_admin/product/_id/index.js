import { mapGetters } from 'vuex';
import _ from 'lodash';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/product/_id';

export default {
  data: () => ({
    showDeliveryInfo: false,
    isMinusOptionPrice: false,
    optionValueImageMap: {},
    deleteOptionImages: [], // 옵션이미지 삭제된 '옵션명_옵션값' 스트링
    additionalImageMaxCount: 4,
    abroadPriceInWon: null,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getProduct`, params.id);
  },
  created() {
    this.productInit();
    const maxOption = _.maxBy(this.productData.optionCompositions, 'additional_price');
    if (maxOption) {
      this.isMinusOptionPrice = (maxOption.additional_price <= 0);
    }
  },
  computed: {
    ...mapGetters({
      commonCodes: `${prefix}/commonCodes`,
      productData: `${prefix}/productData`,
      optionMap: `${prefix}/optionMap`,
      optionValueMap: `${prefix}/optionValueMap`,
      countryMountainDeliveriesMap: `${prefix}/countryMountainDeliveriesMap`,
      templates: `${prefix}/templates`,
      result: `${prefix}/result`,
    }),
    additionalImagesCount() {
      if (this.productData.product.additional_images) return this.productData.product.additional_images.length;
      return 0;
    },
    additionaImages() {
      if (this.productData.product.additional_images) return this.productData.product.additional_images;
      return [];
    },
  },
  methods: {
    productInit() {
      const pData = this.productData.product;
      this.isCheckedProductName = true;
      this.product = {
        id: pData.id,
        category_id: pData.category.id,
        name: pData.name,
        is_sale: pData.is_sale,
        is_listed: pData.is_listed,
        price: pData.price,
        discount_type: pData.discount_type,
        target: pData.target,
        is_abroad: pData.is_abroad,
        detail_url: pData.detail_url,
        option_type: pData.option_type,
        use_option_image: pData.use_option_image,
        options: [],
        option_compositions: [],
        main_image: { image: {}, dataUrl: pData.main_image },
        additional_images: [],
        is_show_option_image: pData.is_show_option_image,
        content: pData.content,
        detail_images: _.map(pData.detail_images, (di) => ({ image: di.image, order: di.order, original_order: di.order ? di.order : null })),
        delivery_info: {},
        delivery_notice_template_id: pData.delivery_notice_template_id,
        exchange_refund_template_id: pData.exchange_refund_template_id,
        product_notice_template_id: pData.product_notice_template_id,
        is_show_abroad_template: pData.is_show_abroad_template,
      };
      //

      if (pData.abroad_price) {
        const abroadPrice = pData.abroad_price.price;
        this.abroadPriceInWon = (abroadPrice * pData.abroad_price.exchange_rate).toFixed(0);
      }
      // // 옵션 셋팅
      const pOptions = pData.options;
      if (pOptions && pOptions.length > 0) {
        const pOptionValues = this.productData.optionValues;
        const optionMap = {};
        const optionValueMap = {};
        pOptions.forEach((pOption) => {
          optionMap[pOption.id] = {
            id: pOption.id,
            name: pOption.name,
            values: [],
          };
        });

        pOptionValues.forEach((optionValue) => {
          const option = optionMap[optionValue.product_option_id];
          if (option) {
            optionValueMap[optionValue.id] = {
              id: optionValue.id,
              name: optionValue.value,
              option: {
                id: option.id,
                name: option.name,
              },
            };

            if (option.values) {
              const valueArr = option.values;
              valueArr.push({
                id: optionValue.id,
                label: optionValue.value, // vue-select 에 valueArr 를 바인딩하고 화면에 옵션값은 label 이 표시됨
              });
              option.values = valueArr;
            } else {
              option.values.push({
                id: optionValue.id,
                label: optionValue.value,
              });
            }
            optionMap[optionValue.product_option_id] = option;

            const productOption = _.find(this.product.options, (o) => o.id === option.id);
            const hasImage = !!optionValue.image;

            if (productOption) {
              productOption.option_values.push({ id: optionValue.id, name: optionValue.value, image: optionValue.image });
            } else {
              this.product.options.push({
                id: option.id,
                name: option.name,
                has_image: hasImage,
                option_values: [{ id: optionValue.id, name: optionValue.value, image: optionValue.image }],
              });
            }

            if (hasImage) {
              this.optionValueImageMap[`${option.id}_${optionValue.id}`] = {
                image: optionValue.image,
              };
            }
          }
        });
        this.options = Object.values(optionMap);

        // option compositions (option_values 필드를 [] 가 아닌 { <option_id>: <option_value>, ... } 로 구성 - 프론트엔드에서 구분용, 서버에 넘길 때는 필요하지 않음)
        const pOptionCompositions = this.productData.optionCompositions;
        pOptionCompositions.forEach((oc) => {
          const optionComposition = {
            id: oc.id,
            option_values: {},
            additional_price: oc.additional_price,
            is_inventory_managed: oc.is_inventory_managed,
            inventory_amount: oc.inventory_amount,
            is_available: oc.is_available,
            is_deleted: oc.is_deleted,
          };

          oc.option_value_ids.forEach((optionValueId) => {
            const optionValue = optionValueMap[optionValueId];
            optionComposition.option_values[optionValue.option.id] = optionValue;
          });

          this.product.option_compositions.push(optionComposition);
        });
      }

      // additional images
      if (pData.additional_images != null && pData.additional_images.length > 0) {
        pData.additional_images.forEach((ai, index) => {
          this.product.additional_images.push({
            image: {},
            dataUrl: ai,
            order: index + 1,
            original_order: index + 1,
          });
        });
      }
    },
    popTerms(template) {
      if (template) {
        new this.$popup.SummernoteEditor({
          propsData: {
            template,
            okCallback: (params) => params.$destroy(),
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('정보고시가 존재하지않습니다.');
      }
    },
    updateOptionPrice() {
      this.$createLoading(async () => {
        const res = await this.$store.dispatch(`${prefix}/updateOptionPrice`,
          { product_ids: [this.$route.params.id], is_minus_option_price: this.isMinusOptionPrice });
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
        await this.$store.dispatch(`${prefix}/getProduct`, this.$route.params.id);
      });
    },
    setOptionImage() {
      if (this.product.options.length > 0 && this.product.option_compositions.length > 0) {
        const productOptions = [];
        let optionValueIdNamePairs = [];
        this.options.forEach((option) => {
          option.values.forEach((v) => {
            optionValueIdNamePairs.push(`${option.id}_${v.id}`);
          });
          productOptions.push({
            id: option.id,
            name: option.name,
            valueNameArray: option.values.map((v) => v.label.trim()),
            values: option.values.map((v) => ({
              id: v.id,
              name: v.label.trim(),
            })),
          });
        });

        const that = this;
        new Popup.OptionImage({
          propsData: {
            type: that.product.option_type,
            options: productOptions,
            images: this.optionValueImageMap,
            okCallback: (params) => {
              that.optionValueImageMap = {};
              params.imageInfo.forEach((info) => {
                info.images.forEach((data) => {
                  that.product.options.forEach((option) => {
                    const optionValue = _.find(option.option_values, (v) => v.id === data.optionValue.id);
                    if (optionValue) {
                      option.has_image = true;
                      optionValue.image = data.image;
                      optionValue.imageFile = data.imageFile;
                    } else {
                      option.has_image = false;
                    }
                  });
                  that.optionValueImageMap[`${info.optionId}_${data.optionValue.id}`] = {
                    image: data.image,
                    imageFile: data.imageFile,
                  };
                  optionValueIdNamePairs = optionValueIdNamePairs.filter((e) => e !== `${info.optionId}_${data.optionValue.id}`);
                });
              });
              that.deleteOptionImages = optionValueIdNamePairs; // 사용될 옵션 이미지 이외에는 모두 지워주도록
              this.$forceUpdate();
              params.$destroy();
              this.updateOptionImage();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('옵션을 입력하신 후에 설정하실 수 있습니다.');
      }
    },
    async updateOptionImage() {
      const formData = new FormData();

      const options = [];
      const optionImages = [];
      this.product.options.forEach((option) => {
        options.push({
          id: option.id,
          name: option.name,
          option_values: option.option_values.map((optionValue) => {
            if (optionValue.image) {
              optionImages.push({
                id: optionValue.id,
                optionId: option.id,
                optionName: option.name,
                optionValueName: optionValue.name,
                image: optionValue.imageFile,
              });
            }

            const currentImage = this.optionValueImageMap[`${option.id}_${optionValue.id}`];
            if (currentImage && currentImage.image === '') {
              // this.optionValueImageMap에 데이터는 있으나 이미지 필드가 비어있는 경우, 디비에 기존 이미지가 있다면 삭제해주어야 함
              this.deleteOptionImages.push(`${option.id}_${optionValue.id}`);
            }
            return { id: optionValue.id, name: optionValue.name };
          }),
        });
      });

      formData.append('product_option', JSON.stringify(options));

      optionImages.forEach((optionImage) => {
        if (optionImage.image) {
          formData.append(`option_value_image_${optionImage.optionId}_${optionImage.id}`, optionImage.image);
        }
      });

      const productData = {
        product_id: this.product.id,
        // option_type: this.product.option_type,
        // use_option_image: this.product.use_option_image,
        // is_show_option_image: this.product.is_show_option_image,
        delete_option_images: this.deleteOptionImages,
      };

      formData.append('product', JSON.stringify(productData));

      let res = null;
      await this.$createLoading(async () => {
        res = await this.$axios.post(`store_admin/product/${this.product.id}/option`, formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
        });
      });

      if (res) {
        if (res.data.result === 'success') {
          this.$popup.showAlertPopup('상품 옵션 이미지가 수정되었습니다.', () => {
            this.$router.go();
          });
        } else {
          this.$popup.showAlertPopup(res.data.message);
        }
      }
    },
    priceGroupConditionChange() {
      const product = this.productData.product;
      if (product) {
        new Popup.PriceGroupConditionEdit({
          propsData: {
            product,
            okCallback: async (params) => {
              if (product.can_price_group !== params.can_price_group) {
                const res = await this.$store.dispatch(`${prefix}/updateCanPriceGroup`, {
                  product_id: params.product_id,
                  can_price_group: params.can_price_group,
                });
                if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
                await this.$store.dispatch(`${prefix}/setCanPriceGroup`, params.can_price_group);
              }

              params.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('제품이 존재하지 않습니다.');
      }
    },
  },
};
