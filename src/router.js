import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import Calendar from '@/views/Calendar.vue';
import CalendarEventViewer from '@/views/CalendarEventViewer.vue';
import Forum from '@/views/Forum.vue';
import ForumPostViewer from '@/views/ForumPostViewer.vue';
import MarkdownGuideView from '@/views/MarkdownGuideView.vue';
// FIXME: Why does this break when using @?
import LoginPage from './views/LoginPage.vue';
import HomePage from './views/HomePage.vue';
import PageNotFound from './views/PageNotFound.vue';
import ForumPostCreator from './views/ForumPostCreator.vue';
import UserAdministration from './views/UserAdministration.vue';
import RolesAdministrator from './views/RolesAdministrator.vue';
import SignUpPage from './views/SignUpPage.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        isPublic: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        isPublic: true,
      },
    },
    {
      path: '/kalender',
      name: 'calendar',
      component: Calendar,
    },
    {
      path: '/kalender/begivenhed',
      component: CalendarEventViewer,
    },
    {
      path: '/forum/:forum?',
      name: 'forum',
      component: Forum,
    },
    {
      path: '/forum/:forum/opslag/:postId',
      name: 'post',
      component: ForumPostViewer,
    },
    {
      path: '/nyt-opslag',
      name: 'create-post',
      component: ForumPostCreator,
    },
    {
      path: '/opret-bruger',
      name: 'signup',
      component: SignUpPage,
      meta: {
        isPublic: true,
      },
    },
    {
      path: '/admin/brugere',
      name: 'admin-users',
      component: UserAdministration,
    },
    {
      path: '/admin/roller',
      name: 'admin-roles',
      component: RolesAdministrator,
    },
    {
      path: '/markdown-guide',
      name: 'markdown-guide',
      component: MarkdownGuideView,
    },
    {
      path: '*',
      name: 'not-found',
      component: PageNotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.isPublic)) {
    const { isAuthenticated } = store.state.auth;

    if (!isAuthenticated) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      });
    }
  }

  next();
});

export default router;
