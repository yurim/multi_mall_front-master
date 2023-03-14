const prefix = 'store_admin/amazic9/login';

export default {
  data: () => ({
    email: '',
    password: '',
  }),
  methods: {
    async login() {
      if (!this.email) return this.popupAlert('이메일을 입력해주세요.');
      if (!this.password) return this.popupAlert('비밀번호를 입력해주세요.');

      await this.$createLoading(async () => {
        const res = await this.$store.dispatch(`${prefix}/login`, { email: this.email, password: this.password });
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

        if (res.data && res.data.lack_of_balance) {
          this.$popup.showAlertPopup('예치금 부족\n*예치금이 10만원 이하입니다. 충전해주세요.\n예치금이 부족할 경우 배송이 늦어질 수 있습니다.');
        }
        await this.$router.push('/store_admin/amazic9');
      });
    },
  },
};
