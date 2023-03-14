import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import _ from 'lodash';

const prefix = 'store_admin/product/edit/_id';

export default {
  data: () => ({
    categoryNamePath: [],
    categoryIdPath: [],
    targets: [],
    option_type: [],
    deliveryMethod: [],
    deliveryFeeType: [],
    feePayMethod: [],
    deliveryCompany: [],
    product: {},
    selectedAreaNum: 2,
    discountValue: null,
    isUrlValidate: false,
    optionValueImageMap: {},
    options: [{ id: '', name: '', values: [] }],
    optionCheckUpdate: {
      additionalPrice: null,
      inventoryAmount: null,
      isAvailable: '',
    },
    maxFileSize: (10 * 1024 * 1024),
    additionalImageMaxCount: 4,
    isUpdateDeliveryTemplate: false,
    isDeliveryGroup: false,
    isCountryMountainDelivery: false,
    isDisabledCountryMountainDelivery: false,
    isCheckedProductName: false,
    countryMountainAddressList: [],
    deleteCompositionOptions: [],
    deleteOptionValues: [],
    deleteAdditionalImages: [],
    deleteOptionImages: [], // 옵션이미지 삭제된 '옵션명ID_옵션값ID' 스트링
    abroadPriceInWon: null,
    defaultCurrencyUnit: {
      iso: 'KRW',
      unit: '₩',
      name: '대한민국 원',
      exchange_rate: 1,
    },
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getProduct`, params.id);
    await store.dispatch(`${prefix}/getDeliveryInfos`);
    await store.dispatch(`${prefix}/getDeliveryGroups`);
    await store.dispatch(`${prefix}/getTemplates`);
  },
  computed: {
    ...mapGetters({
      productData: `${prefix}/productData`,
      deliveryInfos: `${prefix}/deliveryInfos`,
      deliveryGroups: `${prefix}/deliveryGroups`,
      templates: `${prefix}/templates`,
      commonCodes: `${prefix}/commonCodes`,
      result: `${prefix}/result`,
      delivery_info_for_delivery_group: `${prefix}/deliveryInfoForDeliveryGroup`,
    }),
    isSmaller() {
      if (this.product.delivery_info.delivery_group_id) {
        let isSetSmaller = false;
        const deliveryGroup = _.find(this.deliveryGroups, (group) => group.id === this.product.delivery_info.delivery_group_id);
        if (deliveryGroup) {
          isSetSmaller = deliveryGroup.is_smaller;
        }
        return isSetSmaller ? '묶음 그룹에서 가장 작은 배송비로 부과' : '묶음 그룹에서 가장 큰 배송비로 부과';
      }
      return '설정안함';
    },
    isCountryMountain() {
      if (this.product.delivery_info.delivery_group_id) {
        let isSetCountryMountain = false;
        const deliveryGroup = _.find(this.deliveryGroups, (group) => group.id === this.product.delivery_info.delivery_group_id);
        if (deliveryGroup) {
          isSetCountryMountain = deliveryGroup.is_country_mountain;
        }

        return isSetCountryMountain ? '설정' : '설정안함';
      }
      return '설정안함';
    },
  },
  async created() {
    await this.productInit();
    const category = this.productData.product.category;
    if (category) {
      this.categoryNamePath = category.path.slice(1, category.path.length);
      this.categoryIdPath = category.id_path.slice(1, category.id_path.length);
    }
    this.targets = _.map(this.commonCodes.target, (name, code) => ({ key: code, value: name }));
    this.option_type = _.map(this.commonCodes.option_type, (name, code) => ({ key: code, value: name }));
    this.deliveryMethod = _.map(this.commonCodes.delivery_method, (name, code) => ({ key: code, value: name }));
    this.deliveryFeeType = _.map(this.commonCodes.delivery_fee_type, (name, code) => ({ key: code, value: name }));
    this.feePayMethod = _.map(this.commonCodes.fee_pay_method, (name, code) => ({ key: code, value: name }));
    this.deliveryCompany = _.map(this.commonCodes.delivery_company, (name, code) => ({ key: code, value: name }));

    if (this.product.delivery_info.delivery_group_id) {
      await this.$store.dispatch(`${prefix}/getDeliveryInfoForDeliveryGroup`, this.product.delivery_info.delivery_group_id);
    }
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
        abroad_price: pData.abroad_price,
        discount_type: pData.discount_type,
        target: pData.target,
        is_abroad: pData.is_abroad,
        detail_url: pData.detail_url,
        affiliate_url: pData.affiliate_url,
        display_only: pData.display_only,
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
        can_price_group: pData.can_price_group,
      };

      if (this.productData.deliveryInfo) {
        this.product.delivery_info = this.productData.deliveryInfo;
        if (!this.product.delivery_info.id) {
          this.product.delivery_info.id = this.product.delivery_info.delivery_info_id;
        }
        if (!this.product.delivery_info.name) {
          this.product.delivery_info.name = this.product.delivery_info.delivery_info_name;
        }
        this.product.country_mountain_deliveries = {};
        if (this.product.delivery_info.country_mountain_deliveries) {
          this.product.delivery_info.country_mountain_deliveries.forEach((cmd) => {
            this.product.country_mountain_deliveries[cmd.area_type] = cmd;
          });
        }
        if (this.product.delivery_info.delivery_group_id) {
          this.isDeliveryGroup = true;
          this.isDisabledCountryMountainDelivery = true;
        } else if (this.product.country_mountain_deliveries) {
          this.isCountryMountainDelivery = true;
          this.selectedAreaNum = (this.product.country_mountain_deliveries.TOTAL) ? 2 : 3;
        }
      }

      if (pData.discount_type && pData.discount_type !== 'NONE') {
        if (pData.discount_type === 'PRICE') this.discountValue = pData.price - pData.discount_price;
        if (pData.discount_type === 'PRCNT') this.discountValue = ((pData.price - pData.discount_price) / pData.price) * 100;
        this.product.discount_price = pData.discount_price;
      } else {
        this.product.discount_price = null;
      }

      if (pData.is_abroad) {
        this.validateUrl();
      }

      if (pData.abroad_price) {
        const abroadPrice = this.product.abroad_price.price;
        this.abroadPriceInWon = (abroadPrice * this.product.abroad_price.exchange_rate).toFixed(0);
      } else {
        this.product.abroad_price = {
          price: null,
          exchange_rate: this.defaultCurrencyUnit.exchange_rate,
          currency_unit: this.defaultCurrencyUnit,
        };
      }

      // 옵션 셋팅
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
    resetIsCheckedProductName() {
      this.isCheckedProductName = false;
    },
    async checkProductName() {
      const res = await this.$axios.post('store_admin/product/check_name', { name: this.product.name });
      if (res.data.result === 'success') {
        if (res.data.data.count > 0) {
          this.isCheckedProductName = false;
          this.$popup.showAlertPopup('중복상품명입니다.');
        } else {
          this.isCheckedProductName = true;
        }
      } else {
        this.$popup.showAlertPopup(res.data.message);
      }
    },
    getCategory(categoryIds, isLastDepthChecked) {
      if (isLastDepthChecked) {
        const categoryIdArray = categoryIds.split(',');
        this.product.category_id = categoryIdArray[categoryIdArray.length - 1];
      }
    },
    resetDiscount() {
      this.product.discount_price = '';
      this.discountValue = null;
    },
    applyDiscount() {
      if (this.product.discount_type === 'NONE') {
        this.$popup.showAlertPopup('할인 설정이 없을 경우 할인금액을 적용시킬 수 없습니다.');
      } if (this.product.price && this.discountValue) {
        if (this.product.discount_type === 'PRICE') {
          if (this.product.price - this.discountValue <= 0) {
            this.$popup.showAlertPopup('판매가 보다 작은 수를 입력해주세요.');
          } else {
            this.discountValue = Math.floor(this.discountValue / 10) * 10;
            this.product.discount_price = this.product.price - this.discountValue;
            this.$forceUpdate();
          }
        } else if (this.product.discount_type === 'PRCNT') {
          if (this.discountValue < 100) {
            const calc = this.product.price * (1 - (this.discountValue / 100.0));
            this.product.discount_price = Math.ceil(calc / 10) * 10;
            this.$forceUpdate();
          } else {
            this.$popup.showAlertPopup('100보다 작은 값을 입력해주세요.');
          }
        }
      } else {
        this.$popup.showAlertPopup('판매가와 할인설정 금액 을 모두 입력해주세요.');
      }
    },
    validateUrl(url) {
      const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
      return urlRegex.test(url);
    },
    // 조합 형 옵션 배열 생성
    makeAssociationOptionArr(optionValues) {
      let assctnArr = null;
      if (optionValues && optionValues.length > 0) {
        if (optionValues.length === 1) {
          assctnArr = [];
          _.each(optionValues, (values) => {
            _.each(values, (value) => {
              assctnArr.push([value]);
            });
          });
        } else {
          assctnArr = _.reduce(optionValues, (origins, values) => {
            let zipArr = [];
            if (origins && origins.length > 0) {
              _.each(origins, (origin) => {
                _.each(values, (value) => {
                  zipArr.push([origin, value]);
                });
              });
            } else {
              zipArr = values;
            }
            return zipArr;
          }, []);
          assctnArr = _.map(assctnArr, (values) => _.flattenDeep(values));
        }
      }
      return assctnArr;
    },
    setOptionCompositions(optionType, productOptions) {
      this.product.option_compositions = [];
      if (optionType === 'ASSCTN') {
        const assctnArr = this.makeAssociationOptionArr(_.map(productOptions, (option) => option.values));
        assctnArr.forEach((assctn) => {
          const optionValues = {};
          assctn.forEach((v, i) => {
            optionValues[productOptions[i].id] = { id: v.id, name: v.name, option: { id: productOptions[i].id, name: productOptions[i].name } };
          });
          this.product.option_compositions.push({
            id: '-', // 디폴트 아이디, 서버로 수정 요청할 때 '-' 인지 확인하여 제거
            option_values: optionValues,
            additional_price: 0,
            is_inventory_managed: false,
            inventory_amount: 0,
            is_available: true,
            is_deleted: false,
          });
        });
      } else {
        productOptions.forEach((productOption) => {
          productOption.values.forEach((value) => {
            const optionValues = {};
            optionValues[productOption.id] = { id: value.id, name: value.name, option: { id: productOption.id, name: productOption.name } };
            this.product.option_compositions.push({
              option_values: optionValues,
              additional_price: 0,
              is_inventory_managed: false,
              inventory_amount: 0,
              is_available: true,
              is_deleted: false,
            });
          });
        });
      }
    },
    resetOptionType(optionType) {
      this.optionCheckUpdate = {
        additionalPrice: null,
        inventoryAmount: null,
        isAvailable: '',
      };
      this.product.option_compositions = [];
      const productOptions = [];
      this.options.forEach((option) => {
        productOptions.push({
          id: option.id,
          name: option.name,
          values: option.values.map((v) => ({
            id: v.id,
            name: v.label.trim(),
          })),
        });
      });

      this.setOptionCompositions(optionType, productOptions);
      // if (this.product.options.length > 0) this.setOptionList(type);
    },
    addOptions() {
      this.options.push({ id: '', name: '', values: [] });
    },
    deleteOptions(i) {
      this.options.splice(i, 1);
    },
    applyOptionList() {
      const errorMessages = [];

      const seen = new Set();
      const hasDuplicates = this.options.some((o) => seen.size === seen.add(o.name).size);
      if (hasDuplicates) errorMessages.push('옵션명이 중복되었습니다.');

      this.options.forEach((option) => {
        if (option.name.length === 0) errorMessages.push('옵션명을 입력해주세요.');
        else if (option.name.length > 25) errorMessages.push('옵션명을 25자 내로 입력해주세요.');
        if (errorMessages.length === 0) {
          if (option.values.length === 0) {
            errorMessages.push('옵션값을 입력해주세요.');
          } else {
            option.values.forEach((value) => {
              const v = value.label.trim();
              if (v.length === 0) errorMessages.push('옵션값을 입력해주세요.');
              // TODO 임시로 글자수 제한 해제
              // else if (v.length > 25) errorMessages.push('옵션값을 25자 내로 입력해주세요.');
              else if (v.length > 100) errorMessages.push('옵션값을 100자 내로 입력해주세요.');
              if (errorMessages.length > 0) {
                return false;
              }
            });
          }
        }

        if (errorMessages.length > 0) {
          return false;
        }
        if (option.id.length === 0) option.id = option.name; // 새롭게 추가된 옵션인 경우 id 에 name 을 넣어줌
      });

      if (errorMessages.length > 0) {
        this.$popup.showAlertPopup(`${errorMessages.join(',')}`);
      } else {
        // TODO
        this.resetOptionValueImageMap();
        this.setOptionList(this.product.option_type);
      }
    },
    resetOptionValueImageMap() {
      this.optionValueImageMap = {};
    },
    setOptionList(optionType) {
      const productOptions = [];
      this.product.options = [];
      this.options.forEach((option) => {
        productOptions.push({
          id: option.id,
          name: option.name.trim(),
          values: option.values.map((v) => ({
            id: v.id,
            name: v.label.trim(),
          })),
        });
        this.product.options.push({
          id: option.id,
          name: option.name.trim(),
          option_values: option.values.map((v) => ({
            id: v.id,
            name: v.label.trim(),
          })),
        });
      });
      this.setOptionCompositions(optionType, productOptions);
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
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('옵션을 입력하신 후에 설정하실 수 있습니다.');
      }
    },
    updateOptionValue() {
      if (this.product.options.length > 0 && this.product.option_compositions.length > 0) {
        const that = this;
        this.options.forEach((option) => {
          option.valueNameArray = option.values.map((v) => v.label.trim());
        });
        new Popup.OptionValue({
          propsData: {
            options: that.options,
            okCallback: (params) => {
              const option = _.find(that.options, (o) => o.id === params.optionId);

              if (option) {
                option.values = _.map(option.values, (ov) => {
                  const vp = _.find(params.values, (valueParam) => valueParam.valueId === ov.id);
                  if (vp) ov.label = vp.newValue;
                  return ov;
                });

                // 해당 option과 동기화
                let productOption = null;
                if (option.id) {
                  productOption = _.find(that.product.options, (o) => o.id === option.id);
                } else {
                  productOption = _.find(that.product.options, (o) => !o.id && o.name === option.name);
                }

                if (productOption) {
                  productOption.option_values.forEach((ov) => {
                    const vp = _.find(params.values, (valueParam) => valueParam.valueId === ov.id);
                    if (vp) {
                      ov.name = vp.newValue;
                    }
                  });
                }

                // option compositions 동기화
                that.product.option_compositions.forEach((optionComposition) => {
                  const optionValue = optionComposition.option_values[option.id];
                  if (optionValue) {
                    const vp = _.find(params.values, (valueParam) => valueParam.valueId === optionValue.id);
                    if (vp) {
                      optionValue.name = vp.newValue;
                    }
                  }
                });
              }

              params.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('옵션을 입력하신 후에 설정하실 수 있습니다.');
      }
    },
    checkOption(e) {
      const isChecked = e.target.checked;
      if (e.target.id.split('_')[1] === 'all') {
        document.querySelectorAll('.oc_checkbox').forEach((checkbox) => {
          checkbox.checked = isChecked;
        });
      } else {
        let allCheckFlag = true;
        document.querySelectorAll('.oc_checkbox').forEach((checkbox) => {
          if (!checkbox.checked) {
            allCheckFlag = false;
            return false;
          }
        });
        document.querySelector('#option_all').checked = allCheckFlag;
      }
    },
    checkDeleteOptionValues(targetOptionComposition, optionCompositions) {
      if (targetOptionComposition.option_values && _.size(targetOptionComposition.option_values) > 0) {
        const targetOptionValues = Object.values(targetOptionComposition.option_values);
        targetOptionValues.forEach((targetOptionValue) => {
          if (targetOptionValue.id) {
            let isContain = false;
            optionCompositions.forEach((oc) => {
              const optionValues = Object.values(oc.option_values);
              const optionValue = _.find(optionValues, (ov) => ov.id === targetOptionValue.id);
              if (optionValue) {
                isContain = true;
                return false;
              }
            });

            if (!isContain) {
              this.deleteOptionValues.push(targetOptionValue.id);
            }
          }
        });
      }
    },
    deleteOption(index) {
      new Popup.Confirm({
        propsData: {
          title: '이 옵션을 삭제하시겠습니까?',
          okCallback: async (params) => {
            const oc = this.product.option_compositions[index];
            if (oc && oc.id) {
              this.deleteCompositionOptions.push(oc.id);
              this.product.option_compositions.splice(index, 1);
              this.checkDeleteOptionValues(oc, this.product.option_compositions);
            }
            document.querySelector('#option_all').checked = false;
            document.querySelector('.oc_checkbox').checked = false;
            params.$destroy();
          },
        },
      }).$mount();
    },
    changeSelectedOption() {
      if (this.product.options.length > 0 && this.product.option_compositions.length > 0) {
        if (this.optionCheckUpdate.additionalPrice && this.optionCheckUpdate.additionalPrice < 0) {
          this.$popup.showAlertPopup('옵션 추가금액을 0보다 크게 입력해주세요.');
          return false;
        }
        if (this.optionCheckUpdate.inventoryAmount && this.optionCheckUpdate.inventoryAmount < 0) {
          this.$popup.showAlertPopup('재고수량을 0보다 크게 입력해주세요.');
          return false;
        }

        const indexes = [];
        document.querySelectorAll('.oc_checkbox').forEach((checkbox) => {
          if (checkbox.checked) {
            indexes.push(checkbox.value);
          }
        });

        if (indexes.length > 0) {
          indexes.forEach((index) => {
            const optionComposition = this.product.option_compositions[index];
            if (this.optionCheckUpdate.additionalPrice) {
              this.optionCheckUpdate.additionalPrice = Math.ceil(this.optionCheckUpdate.additionalPrice / 10) * 10;
              optionComposition.additional_price = this.optionCheckUpdate.additionalPrice;
            }
            if (this.optionCheckUpdate.inventoryAmount) {
              optionComposition.is_inventory_managed = this.optionCheckUpdate.inventoryAmount > 0;
              optionComposition.inventory_amount = this.optionCheckUpdate.inventoryAmount;
            }
            if (this.optionCheckUpdate.isAvailable.toString()) {
              optionComposition.is_available = this.optionCheckUpdate.isAvailable;
            }
          });
        } else {
          this.$popup.showAlertPopup('일괄 수정할 옵션을 선택해주세요.');
        }
      } else {
        this.$popup.showAlertPopup('옵션을 입력하신 후에 설정하실 수 있습니다.');
      }
    },
    deleteSelectedOption() {
      if (this.product.options.length > 0 && this.product.option_compositions.length > 0) {
        const indexes = [];
        const deleteIndexes = [];
        document.querySelectorAll('.oc_checkbox').forEach((checkbox) => {
          if (checkbox.checked) {
            deleteIndexes.push(checkbox.value);
          } else {
            indexes.push(checkbox.value);
          }
        });

        if (this.product.option_compositions.length !== indexes.length) {
          new Popup.Confirm({
            propsData: {
              title: '선택한 옵션들을 삭제하시겠습니까?',
              okCallback: async (params) => {
                const noDeleteOptionCompositions = []; // 안지울 옵션 구성
                indexes.forEach((index) => {
                  const optionComposition = this.product.option_compositions[index];
                  if (optionComposition) {
                    noDeleteOptionCompositions.push(optionComposition);
                  }
                });
                deleteIndexes.forEach((index) => {
                  const optionComposition = this.product.option_compositions[index];
                  if (optionComposition && optionComposition.id) {
                    this.deleteCompositionOptions.push(optionComposition.id);
                    this.checkDeleteOptionValues(optionComposition, noDeleteOptionCompositions);
                  }
                });
                this.product.option_compositions = noDeleteOptionCompositions;
                document.querySelector('#option_all').checked = false;
                document.querySelector('.oc_checkbox').checked = false;
                params.$destroy();
              },
            },
          }).$mount();
        } else {
          this.$popup.showAlertPopup('삭제할 옵션들을 선택해주세요.');
        }
      } else {
        this.$popup.showAlertPopup('옵션을 입력하신 후에 설정하실 수 있습니다.');
      }
    },
    uploadMainImage(e) {
      if (e.target.files.length > 0) {
        const imageFile = e.target.files[0];
        if (this.maxFileSize > imageFile.size) {
          this.product.main_image.image = imageFile;
          this.product.main_image.dataUrl = window.URL.createObjectURL(imageFile);
        } else {
          this.$popup.showAlertPopup('이미지 용량이 10MB를 초과합니다.\n이미지를 다시 등록해주세요.');
        }
      }
    },
    deleteMainImage() {
      this.product.main_image = { image: {}, dataUrl: '' };
      document.querySelector('#main_image_file').value = '';
    },
    updateMainImage() {
      document.querySelector('#main_image_file').click();
    },
    updateImage(e, targetIndex) {
      if (e.target.files.length > 0) {
        const imageFile = e.target.files[0];
        if (this.maxFileSize > imageFile.size) {
          const imageBlob = window.URL.createObjectURL(imageFile);
          this.product.additional_images.splice(targetIndex, 1, {
            image: imageFile,
            dataUrl: imageBlob,
            order: targetIndex,
          });
        } else {
          this.$popup.showAlertPopup('이미지 용량이 10MB를 초과합니다.');
        }
        e.target.value = '';
      }
    },
    additionalImages(e) {
      const imageFiles = Array.from(e.target.files);
      if ((imageFiles.length + this.product.additional_images.length) <= this.additionalImageMaxCount) {
        const imageFileNames = [];
        imageFiles.forEach((imageFile) => {
          if (this.maxFileSize < imageFile.size) imageFileNames.push(imageFile.name);
        });

        if (imageFileNames.length === 0) {
          imageFiles.forEach((imageFile, index) => {
            const imageblob = window.URL.createObjectURL(imageFile);
            this.product.additional_images.push({
              image: imageFile,
              dataUrl: imageblob,
              order: this.product.additional_images.length + index,
            });
          });
        } else {
          this.$popup.showAlertPopup(`다음 이미지가 업로드 제한용량(${(this.maxFileSize / 1024) / 1024}MB)을 초과합니다.\n${imageFileNames.join('\n')}`);
        }
        e.target.value = '';
      } else {
        this.$popup.showAlertPopup(`현재 이미지는 ${this.additionalImageMaxCount - this.product.additional_images.length}개만 업로드 가능합니다.`);
      }
    },
    deleteAdditionalImage(index) {
      if (this.product.additional_images[index] && this.product.additional_images[index].original_order) {
        this.deleteAdditionalImages.push(this.product.additional_images[index].original_order);
      }
      this.product.additional_images.splice(index, 1);
      this.product.additional_images.forEach((image) => {
        image.order = index;
      });
      document.querySelector('#additional_images').value = '';
    },
    onEditor(data) {
      this.product.content = data.content;
      this.product.detail_images = data.detail_images;
    },
    async selectedDeliveryInfo(e) {
      const infoId = e.target.value;
      if (infoId) {
        const info = _.find(this.deliveryInfos, (i) => i.id.toString() === infoId);
        if (info) {
          this.product.delivery_info = info;
          if (this.product.delivery_info.delivery_group_id) {
            this.isDeliveryGroup = true;
            const deliveryGroup = _.find(this.deliveryGroups, (group) => group.id === this.product.delivery_info.delivery_group_id);
            if (deliveryGroup) {
              this.isDisabledCountryMountainDelivery = true;
              this.isCountryMountainDelivery = false;
              this.product.country_mountain_deliveries = {};
            }
          } else if (info.country_mountain_deliveries && info.country_mountain_deliveries.length > 0) {
            this.isDeliveryGroup = false;
            this.selectedAreaNum = info.country_mountain_deliveries.length === 1 ? 2 : 3;
            this.isDisabledCountryMountainDelivery = false;
            this.isCountryMountainDelivery = true;
            info.country_mountain_deliveries.forEach((cmd) => {
              this.product.country_mountain_deliveries[cmd.area_type] = cmd;
            });
          } else {
            this.isDeliveryGroup = false;
            this.isDisabledCountryMountainDelivery = false;
            this.isCountryMountainDelivery = false;
            this.product.country_mountain_deliveries = {};
          }

          if (this.product.delivery_info.delivery_group_id) {
            await this.$store.dispatch(`${prefix}/getDeliveryInfoForDeliveryGroup`, this.product.delivery_info.delivery_group_id);
          }
        }
      } else {
        this.product.delivery_info = {};
        await this.resetSelectDeliveryGroup();
      }
    },
    updateDelivery() {
      if (this.product.delivery_info.id) {
        this.isUpdateDeliveryTemplate = !this.isUpdateDeliveryTemplate;
      } else {
        this.$popup.showAlertPopup('배송비 템플릿을 선택해주세요.');
      }
    },
    async resetDeliveryGroupId() {
      if (this.isDeliveryGroup) {
        this.isDisabledCountryMountainDelivery = true;
      } else {
        this.isDisabledCountryMountainDelivery = false;
        this.product.delivery_info.delivery_group_id = '';
        await this.resetSelectDeliveryGroup();
      }
      this.isCountryMountainDelivery = false;
      this.product.country_mountain_deliveries = {};
    },
    async resetSelectDeliveryGroup() {
      await this.$store.dispatch(`${prefix}/resetDeliveryInfoForDeliveryGroup`);
      this.product.delivery_info.delivery_method = '';
      this.product.delivery_info.fee_pay_method = 'PRPYMNT';
    },
    async setSelectedDeliveryGroup() {
      if (this.product.delivery_info.delivery_group_id) {
        await this.$store.dispatch(`${prefix}/getDeliveryInfoForDeliveryGroup`, this.product.delivery_info.delivery_group_id);
        if (this.delivery_info_for_delivery_group) {
          this.product.delivery_info.delivery_method = this.delivery_info_for_delivery_group.delivery_method;
          this.product.delivery_info.fee_pay_method = this.delivery_info_for_delivery_group.fee_pay_method;
        } else {
          await this.resetSelectDeliveryGroup();
        }
      } else {
        await this.resetSelectDeliveryGroup();
      }
    },
    resetDeliveryFeeType() {
      this.product.delivery_info.default_fee = '';
      this.product.delivery_info.condition_value = '';
      this.product.delivery_info.additional_fee = '';
    },
    async popMountainousArea() {
      if (this.countryMountainAddressList.length === 0) {
        await this.$createLoading(async () => {
          const res = await this.$axios.get('store_admin/cma/');
          this.countryMountainAddressList = res.data.data.country_mountain_address;
        });
      }
      new Popup.MountainousArea({
        propsData: {
          cmaList: this.countryMountainAddressList,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    setIsCountryMountainDelivery() {
      if (this.isCountryMountainDelivery) {
        this.selectedAreaNum = 2;
        this.product.country_mountain_deliveries = {};
        this.product.country_mountain_deliveries.TOTAL = {
          area_type: 'TOTAL',
          additional_price: 0,
        };
      } else {
        this.product.country_mountain_deliveries = {};
      }
    },
    setCountryMountainDelivery() {
      this.product.country_mountain_deliveries = {};
      if (this.selectedAreaNum === 3) {
        this.product.country_mountain_deliveries.JEJU = {
          area_type: 'JEJU',
          additional_price: 0,
        };
        this.product.country_mountain_deliveries.CNTRY_MNTN = {
          area_type: 'CNTRY_MNTN',
          additional_price: 0,
        };
      } else {
        this.product.country_mountain_deliveries.TOTAL = {
          area_type: 'TOTAL',
          additional_price: 0,
        };
      }
      this.$forceUpdate();
    },
    popAddress(type) {
      new Popup.Address({
        propsData: {
          okCallback: (params) => {
            this.product.delivery_info[`${type}_zipcode`] = params.zipcode;
            this.product.delivery_info[`${type}_address`] = params.address;
            this.product.delivery_info[`${type}_detail_address`] = params.detailAddress;
            params.$destroy();
          },
        },
      }).$mount();
    },
    async updateProduct() {
      const errorMessages = [];
      if (!this.product.category_id) errorMessages.push('카테고리를 선택해주세요.');
      if (!this.product.name) errorMessages.push('상품명을 입력해주세요.');
      if (!this.isCheckedProductName) errorMessages.push('상품명 중복 체크를 해주세요.');
      //   is_sale: false,
      //   is_listed: false,

      if (!this.product.display_only) {
        if (!this.product.price || this.product.price <= 0) errorMessages.push('판매가를 0보다 크게 입력해주세요.');
        if (this.product.discount_type !== 'NONE') {
          if (!this.product.discount_price) {
            errorMessages.push('할인 설정을 적용하여 할인 판매가를 입력해주세요.');
          }
        }
      }

      if (this.product.is_abroad) {
        if (!this.product.detail_url) {
          errorMessages.push('상품링크를 입력해주세요.');
        } else if (!this.validateUrl(this.product.detail_url)) {
          errorMessages.push('상품링크 주소를 올바르게 입력해주세요.');
        }
      }

      if (this.product.affiliate_url && !this.validateUrl(this.product.affiliate_url)) {
        errorMessages.push('어필리에이트 링크 주소를 올바르게 입력해주세요.');
      }

      if (this.product.is_sale && this.product.display_only && this.product.abroad_price && !this.product.abroad_price.price) {
        errorMessages.push('직접구매가를 입력해주세요.');
      }

      if (!this.product.option_type) {
        errorMessages.push('옵션 정보를 입력해주세요.');
      }

      if (!this.product.options && this.product.options.length === 0) errorMessages.push('옵션 사용 여부를 입력해주세요.');
      if (this.product.option_compositions.length === 0) errorMessages.push('옵션을 적용해주세요.');
      if (!this.product.main_image.image || !this.product.main_image.dataUrl) errorMessages.push('메인 이미지를 업로드해주세요.');
      //   additional_images: [],
      //   detail_images: [],
      if (!this.product.content) errorMessages.push('상세 이미지/설명을 입력해주세요.');

      if (!this.product.delivery_notice_template_id) errorMessages.push('배송정보고시를 선택해주세요.');
      if (!this.product.product_notice_template_id) errorMessages.push('상품정보고시를 선택해주세요.');
      if (!this.product.exchange_refund_template_id) errorMessages.push('교환/반품 정보고시를 선택해주세요.');
      if (!this.product.delivery_info) errorMessages.push('배송비 템플릿을 선택해주세요.');

      if (!this.product.delivery_info.delivery_method) errorMessages.push('배송 방법을 선택해주세요.');
      if (!this.product.delivery_info.fee_pay_method) errorMessages.push('배송비 지불 방법을 선택해주세요.');
      if (!this.product.delivery_info.delivery_fee_type) errorMessages.push('배송비 유형을 선택해주세요.');
      if (this.product.delivery_info.delivery_fee_type !== 'FREE' && !this.product.delivery_info.default_fee) {
        errorMessages.push('기본 배송비를 입력해주세요.');
      }
      if (['CNDTN', 'AMOUNT', 'AREA'].includes(this.product.delivery_info.delivery_fee_type) && !this.product.delivery_info.condition_value) {
        errorMessages.push('배송비 조건 값을 입력해주세요.');
      }
      if (this.product.delivery_info.delivery_fee_type === 'AREA' && !this.product.delivery_info.additional_fee) {
        errorMessages.push('초과 구매시 추가 배송비를 입력해주세요.');
      }
      if (this.isCountryMountainDelivery) {
        let errorFlag = false;
        Object.values(this.product.country_mountain_deliveries).forEach((cmd) => {
          if (!cmd.additional_price) {
            errorFlag = true;
            return false;
          }
        });
        if (errorFlag) {
          errorMessages.push('제주/도서산간 추가배송비를 입력해주세요.');
        }
      }
      if (!this.product.delivery_info.departure_zipcode || !this.product.delivery_info.departure_address) {
        errorMessages.push('출고지 주소를 입력해주세요.');
      }
      if (!this.product.delivery_info.delivery_company) errorMessages.push('택배사를 선택해주세요.');
      if (!this.product.delivery_info.return_fee) errorMessages.push('반품 배송비(편도)를 입력해주세요.');
      if (!this.product.delivery_info.exchange_fee) errorMessages.push('반품 배송비(왕복)를 입력해주세요.');
      if (!this.product.delivery_info.arrival_zipcode || !this.product.delivery_info.arrival_address) {
        errorMessages.push('반품/교환지 주소를 입력해주세요.');
      }

      if (errorMessages.length > 0) {
        this.$popup.showAlertPopup(errorMessages.join('\n'));
      } else {
        const formData = new FormData();
        const product = {
          id: this.product.id,
          category_id: this.product.category_id,
          name: this.product.name,
          target: this.product.target,
          is_abroad: this.product.is_abroad,
          detail_url: this.product.detail_url ? this.product.detail_url : null,
          is_sale: this.product.is_sale,
          is_listed: this.product.is_listed,
          price: this.product.price,
          discount_type: this.product.discount_type,
          discount_price: this.product.discount_price,
          option_type: this.product.option_type,
          content: this.product.content,
          detail_images: _.map(this.product.detail_images, (di) => ({ order: di.order, original_order: di.original_order ? di.original_order : null })),
          saving_type: 'DFLT',
          use_option_image: this.product.use_option_image,
          delivery_notice_template_id: this.product.delivery_notice_template_id,
          product_notice_template_id: this.product.product_notice_template_id,
          exchange_refund_template_id: this.product.exchange_refund_template_id,
          is_show_abroad_template: this.product.is_show_abroad_template,
          is_show_option_image: this.product.is_show_option_image,
          delivery_info: this.product.delivery_info,
          country_mountain_deliveries: null,
          delete_additional_images: this.deleteAdditionalImages,
          can_price_group: this.product.can_price_group,
          product_price_group_id: this.product.product_price_group_id ? this.product.product_price_group_id : null,
          additional_images: [],
          affiliate_url: this.product.affiliate_url,
          display_only: this.product.display_only,
          abroad_price: this.product.abroad_price ? this.product.abroad_price.price : null,
          // delete_option_images: this.deleteOptionImages,
        };

        if (this.product.country_mountain_deliveries) {
          product.country_mountain_deliveries = Object.values(this.product.country_mountain_deliveries);
        }

        if (this.product.main_image.image) {
          formData.append('main_image', this.product.main_image.image);
        }

        this.product.additional_images.forEach((image) => {
          if (image.image && image.image.name) {
            formData.append(`additional_image_${image.order}`, image.image);
          }
          product.additional_images.push({
            data_url: image.dataUrl,
            image: !!(image.image && image.image.name),
            order: image.order,
          });
        });

        this.product.detail_images.forEach((image) => {
          if (image.image) {
            formData.append(`detail_image_${image.order}`, image.image);
          }
        });

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
        product.delete_option_images = this.deleteOptionImages;
        formData.append('product', JSON.stringify(product));

        const productOptionCompositions = this.product.option_compositions.map((optionComposition) => {
          let newId = optionComposition.id;
          if (newId === '-') {
            newId = null;
          }
          // eslint-disable-next-line camelcase
          const { id, option_values, ...oc } = optionComposition;
          oc.id = newId;
          oc.option_values = Object.values(optionComposition.option_values);
          return oc;
        });

        formData.append('product_option', JSON.stringify({
          options,
          option_compositions: productOptionCompositions,
          delete_option_compositions: this.deleteCompositionOptions,
          delete_option_values: this.deleteOptionValues,
        }));

        optionImages.forEach((optionImage) => {
          if (optionImage.image) {
            formData.append(`option_value_image_${optionImage.optionId}_${optionImage.id}`, optionImage.image);
          }
        });

        let res = null;
        await this.$createLoading(async () => {
          res = await this.$axios.post(`store_admin/product/${product.id}`, formData, {
            headers: {
              'content-type': 'multipart/form-data',
            },
          });
        });

        if (res) {
          if (res.data.result === 'success') {
            this.$popup.showAlertPopup('상품이 수정되었습니다.', () => {
              this.$router.push({ name: 'store_admin-product-id', params: { id: product.id } });
            });
          } else {
            this.$popup.showAlertPopup(res.data.message);
          }
        }
      }
    },
    /**
     * 옵션값 입력 select handler
     * @param map
     * @param vm
     */
    optionHandlers(map, vm) {
      const createTag = (e) => {
        e.preventDefault();
        vm.typeAheadSelect();
        vm.searchEl.focus();
      };

      return {
        ...map, // defaults
        13: createTag, // enter
        188: createTag, // comma
      };
    },

    /**
     * 판매가 10단위 올림
     */
    blurPrice() {
      if (this.product.price && this.product.price > 0) {
        this.product.price = Math.ceil(this.product.price / 10) * 10;
      }
    },
    /**
     * 옵션가 10단위 올림
     * @param compositionIndex
     */
    blurOptionPrice(compositionIndex) {
      const price = this.product.option_compositions[compositionIndex].additional_price;
      if (price && price > 0) {
        this.product.option_compositions[compositionIndex].additional_price = Math.ceil(price / 10) * 10;
      }
    },
    calcAbroadPrice() {
      const abroadPrice = this.product.abroad_price.price;
      this.abroadPriceInWon = (abroadPrice * this.product.abroad_price.exchange_rate).toFixed(0);
    },
  },
};
