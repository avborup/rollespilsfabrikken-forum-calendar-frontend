import Vue from 'vue';
import Editor from 'v-markdown-editor';
import VuejsDialog from 'vuejs-dialog';
import App from './App.vue';
import router from './router';
import store from '@/store/store';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import RolesPickerDialog from '@/components/RolesPickerDialog.vue';
import RoleEditorDialog from '@/components/RoleEditorDialog.vue';
import ForumCalendarEditorDialog from '@/components/ForumCalendarEditorDialog.vue';
import CalendarEventEditorDialog from '@/components/CalendarEventEditorDialog.vue';
import CalendarEventDeleteDialog from '@/components/CalendarEventDeleteDialog.vue';

Vue.config.productionTip = false;

Vue.use(Editor);
Vue.use(VuejsDialog, {
  okText: 'Fortsæt',
  cancelText: 'Fortryd',
});

Vue.dialog.registerComponent('role-picker-dialog', RolesPickerDialog);
Vue.dialog.registerComponent('role-editor-dialog', RoleEditorDialog);
Vue.dialog.registerComponent('forum-calendar-editor-dialog', ForumCalendarEditorDialog);
Vue.dialog.registerComponent('calendar-event-editor-dialog', CalendarEventEditorDialog);
Vue.dialog.registerComponent('calendar-event-delete-dialog', CalendarEventDeleteDialog);

// This provides a $bubble method that emits an event on ALL parent components.
Vue.use((vue) => {
  // eslint-disable-next-line no-param-reassign
  vue.prototype.$bubble = function $bubble(eventName, ...args) {
    let component = this;
    do {
      component.$emit(eventName, ...args);
      component = component.$parent;
    } while (component);
  };
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
