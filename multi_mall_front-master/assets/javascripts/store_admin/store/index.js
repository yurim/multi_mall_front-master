import Utils from '@/plugins/utils';

export default {
  async fetch({ req, redirect }) {
    let cookie;
    if (process.server) cookie = req.headers.cookie;
    else cookie = document.cookie;

    const storeId = Utils.getStoreId(cookie);
    if (storeId) {
      redirect(`/store_admin/store/${storeId}`);
    } else {
      this.$popup.showAlertPopup('잘못된 접근입니다.');
      redirect('/admin/user/login');
    }
  },
};
