import Vue from 'vue';
import MultiSelect from 'vue-multiselect';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueScrollactive from 'vue-scrollactive';
import vueSelect from 'vue-select';
import JsonViewer from 'vue-json-viewer';
import Sticky from 'vue-sticky-directive';

import VueLoading from '@/components/Loading';
import Popup from '~/components/popups/popup';

Vue.prototype.$popup = Popup;
Vue.prototype.$createLoading = (taskFunction) => new Promise((resolve) => {
  new VueLoading({
    propsData: {
      taskFunction,
    },
    created() {
      this.$on('finishTasks', () => {
        resolve();
      });
    },
  }).$mount();
});

Vue.use(VueAwesomeSwiper);
Vue.use(VueScrollactive);
Vue.use(JsonViewer);
Vue.use(Sticky);

Vue.component('MultiSelect', MultiSelect);
Vue.component('vueSelect', vueSelect);
