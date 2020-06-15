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
import CalendarForumAdministrator from './views/CalendarForumAdministrator.vue';
import SignUpPage from './views/SignUpPage.vue';
import CalendarEventCreatorView from './views/CalendarEventCreatorView.vue';
import ForumCommentViewer from './views/ForumCommentViewer.vue';
import UserProfileView from './views/UserProfileView.vue';

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
      path: '/kalender/:calendarId/begivenhed/:eventId',
      name: 'event-viewer',
      component: CalendarEventViewer,
    },
    {
      path: '/kalender/ny-begivenhed',
      name: 'create-event',
      component: CalendarEventCreatorView,
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
      path: '/forum/:forum/opslag/:postId/kommentar/:commentId',
      name: 'comment',
      component: ForumCommentViewer,
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
      path: '/admin/forum-kalender',
      name: 'admin-forum-calendar',
      component: CalendarForumAdministrator,
    },
    {
      path: '/profil',
      name: 'profile',
      component: UserProfileView,
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
      return;
    }
  }

  next();
});

export default router;
