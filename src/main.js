import Vue from 'vue';
import Editor from 'v-markdown-editor';
import App from './App.vue';
import router from './router';
import store from '@/store/store';

Vue.config.productionTip = false;

Vue.use(Editor);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
