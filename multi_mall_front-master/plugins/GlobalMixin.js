import Vue from 'vue';
import { isMobileOnly } from 'mobile-device-detect';

if (!Vue.__global_mixin) {
  if (process.env.NODE_ENV === 'production' && isMobileOnly) {
    const location = window.location;
    window.location.href = `${process.env.MOBILE_URL}${location.pathname}${location.search}`;
  }
  Vue.__global_mixin = true;
  Vue.mixin({
    beforeMount() {
      if (process.client) {
        if (!window.wcs_add) window.wcs_add = {};
        if (!window.wcs_add.wa) window.wcs_add.wa = process.env.NAVER_COMMON_AUTH_KEY;
        if (window.wcs) {
          if (window.wcs_do) window.wcs_do();
          if (window.wcs.inflow) window.wcs.inflow();
        }
      }
    },
  });
}
