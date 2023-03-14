export default {
  data: () => ({
    sticky: {
    //   targetId: null,
    //   startHeight: 0,
      minusMaxHeight: 400, // 전체 height에서 footer 처럼 제외할 픽셀
    },
    targetElAbsoluteTop: 999999,
  }),
  mounted() {
    window.addEventListener('scroll', this.updateScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateScroll);
  },
  methods: {
    /**
     * 스크롤 시 Side Bar Fixed 적용 방식 수정
     */
    updateScroll() {
      const targetEl = document.getElementById(this.sticky.targetId);
      if (!targetEl) return;

      if (targetEl.getBoundingClientRect()) {
        const targetElAbsoluteTop = window.pageYOffset + targetEl.getBoundingClientRect().top + this.sticky.startHeight;
        if (this.targetElAbsoluteTop >= targetElAbsoluteTop) {
          this.targetElAbsoluteTop = targetElAbsoluteTop;
        }

        const dde = document.documentElement;
        if (dde.scrollTop >= this.targetElAbsoluteTop
          && dde.scrollTop <= (document.documentElement.scrollHeight - targetEl.offsetHeight - this.sticky.minusMaxHeight)) {
          targetEl.style.top = `${dde.scrollTop - this.targetElAbsoluteTop}px`;
          // targetEl.style.position = 'fixed';
          // targetEl.style.right = 'fixed';
        // } else {
        //   targetEl.style.position = 'absolute';
        }
      }
    },
  },
};
