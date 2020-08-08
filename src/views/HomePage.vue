<template>
  <div v-if="isAuthenticated" class="home-page-wrapper">
    <h1>Velkommen <span v-if="user !== null">{{ user.username }}</span></h1>
    <p>Se sidebjælken for de sider, du kan besøge.</p>
    <div class="link-btns">
      <router-link :to="{ name: 'forum' }" class="link-btn">
        Se forum
        <span class="fas fa-arrow-right link-btn-icon"></span>
      </router-link>
      <router-link :to="{ name: 'calendar' }" class="link-btn">
        Se kalender
        <span class="fas fa-arrow-right link-btn-icon"></span>
      </router-link>
    </div>
    <div class="events-posts-viewer">
      <div class="posts-col">
        <h2>Relevante opslag</h2>
        <PostsList :page="1" :numPostsPerPage="3" sortBy="relevance" ref="postsList" />
      </div>
      <div class="events-col">
        <h2>Kommende begivenheder</h2>
        <div v-if="!eventFetchFailed && upcomingEvents" class="events">
          <CalendarEvent
            v-for="event in previewEvents"
            :key="`${event.id}-${event.start.toISOString()}`"
            :event="event"
          />
        </div>
        <p v-else-if="!upcomingEvents">Du har ingen kommende begivenheder.</p>
        <p v-else>Der opstod en fejl.</p>
      </div>
    </div>
  </div>
  <div v-else class="home-page-wrapper-unauth">
    <h1 class="title">Velkommen til Rollespilsfabrikken!</h1>
    <p class="subtitle">Forum og kalender</p>
    <p>Kom og bliv en del af fællesskabet!</p>
    <div class="link-btns">
      <router-link :to="{ name: 'signup' }" class="link-btn">
        Bliv medlem
      </router-link>
      <router-link :to="{ name: 'login' }" class="link-btn">
        Log ind
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import CalendarEvent from '@/components/CalendarEvent.vue';
import PostsList from '@/components/PostsList.vue';

export default {
  name: 'HomePage',

  components: {
    CalendarEvent,
    PostsList,
  },

  data() {
    return {
      eventFetchFailed: false,
    };
  },

  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
    ]),
    ...mapState([
      'user',
    ]),
    ...mapState('calendar', [
      'previewEvents',
    ]),

    upcomingEvents() {
      if (!this.previewEvents) {
        return false;
      }

      return this.previewEvents.length > 0;
    },
  },

  mounted() {
    if (!this.isAuthenticated) {
      return;
    }

    this.$store.dispatch('forum/clearPosts');
    this.$refs.postsList.fetchPosts();

    this.$store.dispatch('calendar/fetchPreviewEvents')
      .then(() => {})
      .catch(() => {
        this.eventFetchFailed = true;
      });
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

main > .home-page-wrapper {
  padding-left: 2rem;
  padding-top: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  &::after {
    content: "";
    background-image: url('/assets/icons/rollespilsfabrikken-black.svg');
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: -10rem 0;
    z-index: -1;
    opacity: 0.03;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
  }

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  .events-posts-viewer {
    margin-top: 2rem;
    display: flex;
    column-gap: 2rem;
    flex-wrap: wrap;
    row-gap: 1rem;

    h2 {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .events-col, .posts-col {
      min-width: 15rem;
      max-width: 23rem;
    }
  }
}

.link-btns {
  display: flex;

  .link-btn {
    margin-right: 1rem;
    padding: 0.4rem 0.75rem;
    background-color: $primary-accent;
    font-size: 0.9rem;
    border-radius: 0.2rem;
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;

    .link-btn-icon {
      font-size: 0.8rem;
      margin-left: 0.4rem;
    }
  }
}

.home-page-wrapper-unauth {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  position: relative;
  color: $primary-text;

  &::after {
    content: "";
    background-size: cover;
    background-position: 50% 0;
    background-image: url('/assets/icons/rollespilsfabrikken-black.svg');
    z-index: -1;
    opacity: 0.05;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
  }

  .title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
  }

  .subtitle {
    font-size: 1.25rem;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    opacity: 0.75;
  }

  p {
    margin-bottom: 1rem;
  }
}
</style>

<style lang="scss">
@media (min-width: 600px) {
  .posts-col .posts .post-list-item {
    grid-template-columns: 1fr 2rem 4rem;
    grid-template-areas:
      "title       info forum"
      "author-date info forum";

    .avatar {
      display: none;
    }

    .author-date {
      overflow: hidden;
      white-space: normal;
      text-overflow: ellipsis;
    }
  }
}
</style>
