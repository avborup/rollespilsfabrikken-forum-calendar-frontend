import Vue from 'vue';
import Router from 'vue-router';
import Calendar from '@/views/Calendar.vue';
import CalendarEventViewer from '@/views/CalendarEventViewer.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Calendar,
    },
    {
      path: '/begivenhed',
      component: CalendarEventViewer,
    },
  ],
});
