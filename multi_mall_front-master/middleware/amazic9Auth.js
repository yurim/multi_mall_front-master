// eslint-disable-next-line func-names
export default async function ({ route, $axios, redirect }) {
  let target = 'default';
  if (route.name === 'store_admin-sales-st11') { // todo: 11번가 route name 입력
    target = 'st11';
  }

  const res = await $axios.get(`/store_admin/amazic9/check_login/${target}`);
  if (res.data.result === 'error') {
    return redirect(`/store_admin/sales/amazic9/login?target=${target}`);
  }
  if (target === 'default' && res.data.data.select_pd_agency) { // 구매/배송 대행 업체 선택 가능
    return redirect('/store_admin/sales/amazic9/agency');
  }
  // 기존 경로로 이동
}
