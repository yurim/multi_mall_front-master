import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import util from '@/assets/javascripts/util';

const prefix = 'super_admin/site/info';

export default {
  data: () => ({
    keywords: [],
    message: '* Enter 키를 통해 키워드 태그를 연속적으로 입력하세요.',
    fileTemplateDataList: [
      {
        title: 'OG이미지',
        fieldName: 'og_image',
        acceptExt: 'image/*',
        recommendSizeText: '800x400',
        constraintText: '최대 10MB 까지 가능',
      },
      {
        title: '파비콘이미지',
        fieldName: 'favicon',
        acceptExt: '.ico',
        recommendSizeText: '32x32',
        constraintText: 'ico 확장자만 사용가능',
      },
      {
        title: '쇼핑몰 로고',
        fieldName: 'logo',
        acceptExt: 'image/*',
        recommendSizeText: '200x65',
        constraintText: '최대 10MB 까지 가능',
      },
    ],
    textLength: '',
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/edit/getSiteInfo`);
  },
  computed: {
    ...mapGetters({
      siteInfo: `${prefix}/edit/siteInfo`,
      businessInfo: `${prefix}/edit/businessInfo`,
      snsInfo: `${prefix}/edit/snsInfo`,
      csInfo: `${prefix}/edit/csInfo`,
      result: `${prefix}/edit/result`,
    }),
  },
  created() {
    if (this.siteInfo.keywords) {
      this.keywords = this.siteInfo.keywords.split(',');
      Object.keys(this.snsInfo).forEach((key) => {
        if (this.snsInfo[key].url.length > 0 && this.snsInfo[key].script.length > 0) {
          this.snsInfo[key].is_used = true;
        } else {
          this.snsInfo[key].is_used = false;
        }
      });
    } else {
      this.keywords = [];
    }
    this.siteDescInit();
  },
  methods: {
    // 사이트 설명 초기화
    siteDescInit() {
      this.siteInfo.desc = 'testsetsts';
      if (this.siteInfo.desc) this.textLength = this.siteInfo.desc;
    },
    imageUpload(e, fieldName) {
      const that = this;
      const imageFile = e.target.files[0];
      const recommendSize = 10 * 1024 * 1024;
      if (recommendSize > imageFile.size) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event) => {
          that.siteInfo[fieldName] = event.target.result;
          that.siteInfo[`${fieldName}_new`] = event.target.result;
        };
      } else {
        new Popup.Alert({
          propsData: {
            title: '최대 사이즈 10MB를 초과했습니다.',
            okCallback: (params) => params.$destroy(),
          },
        }).$mount();
      }
    },
    deleteImage(id) {
      document.getElementById(`${id}_input`).value = '';
      this.siteInfo[id] = '';
    },
    updateImage(id) {
      document.getElementById(`${id}_input`).click();
    },
    addKeywords(e) {
      const that = this;
      const keyword = e.target.value;
      if (that.keywords.indexOf(keyword) === -1 && keyword.length > 0) {
        that.keywords.push(keyword);
        that.message = '* Enter 키를 통해 키워드 태그를 연속적으로 입력하세요.';
        e.target.value = '';
      } else if (keyword === '') {
        that.message = '* 내용을 입력해주세요.';
      } else {
        that.message = '* 중복되는 키워드 태그는 입력이 불가합니다.';
      }
      that.siteInfo.keywords = that.keywords.join();
      this.$forceUpdate();
    },
    deleteKeyword(e) {
      const that = this;
      const idx = e.target.id;
      that.keywords.splice(idx, 1);
      that.siteInfo.keywords = that.keywords.join();
    },
    postCode() {
      util.showSearchAddress((data) => {
        this.businessInfo.zipcode = data.zonecode;
        this.businessInfo.address = data.address;
      });
    },
    async patchSiteInfo() {
      const params = {};
      const that = this;
      // const count = [0, 0];
      // Object.keys(that.siteInfo).forEach((key) => {
      //   if (that.siteInfo[key] === '') {
      //     count[0] += 1;
      //   }
      // });
      // Object.keys(that.businessInfo).forEach((key) => {
      //   if (that.businessInfo[key] === '') {
      //     count[1] += 1;
      //   }
      // });
      // if (count[0] > 0) {
      //   that.popupAlert('쇼핑몰 정보');
      // } else if (count[1] > 0) {
      //   that.popupAlert('사업자 정보');
      // } else {
      // params.info = that.siteInfo;
      // params.businessInfo = that.businessInfo;
      // params.snsInfo = that.snsInfo;
      // params.csInfo = that.csInfo;
      Object.keys(that.siteInfo).forEach((key) => {
        params[`info_${key}`] = that.siteInfo[key];
      });
      Object.keys(that.businessInfo).forEach((key) => {
        params[`business_${key}`] = that.businessInfo[key];
      });
      Object.keys(that.snsInfo).forEach((key) => {
        const toKey = key.toLowerCase();
        params[`snsinfo_${toKey}_url`] = that.snsInfo[key].url;
        params[`snsinfo_${toKey}_script`] = that.snsInfo[key].script;
      });
      Object.keys(that.csInfo).forEach((key) => {
        params[`csinfo_${key}`] = that.csInfo[key];
      });
      await that.$store.dispatch(`${prefix}/edit/patchSiteInfo`, params);
      if (that.result.result === 'error') return this.popupAlert(`에러발생!\n${that.result.message}`);
      this.popupAlert('변경이 완료되었습니다.');
      await this.$router.replace('/super_admin/site/info');
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (inParams) => inParams.$destroy(),
        },
      }).$mount();
    },
  },
};
