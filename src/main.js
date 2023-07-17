import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import specific icons */
import {
  faTrainSubway,
  faBus,
  faCircleQuestion,
  faTrainTram,
  faArrowRight,
  faRetweet,
} from '@fortawesome/free-solid-svg-icons';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import './registerServiceWorker';

/* add icons to the library */
library.add(
  faTrainSubway,
  faBus,
  faCircleQuestion,
  faTrainTram,
  faArrowRight,
  faRetweet
);

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: function (h) {
    return h(App);
  },
}).$mount('#app');
