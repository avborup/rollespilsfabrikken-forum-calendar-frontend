<template>
  <div class="forum-content-wrapper">
    <div class="forum">
      <h1>Opslag</h1>
      <PostsList
        ref="postsList"
        :page="page"
        @scroll-to-top="scrollToTop"
      />
      <div class="page-controls">
        <button v-if="page > 1" class="pg-item" title="Forrige side">
          <img
            @click="prevPage"
            src="assets/icons/less-than.svg"
            alt="Forrige side"
          >
        </button>
        <div class="pg-item cur-page" :title="`Side ${page}`">{{ page }}</div>
        <button v-if="hasMorePosts" class="pg-item" title="Næste side">
          <img
            @click="nextPage"
            src="assets/icons/less-than.svg"
            alt="Næste side"
            class="next-page-icon"
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PostsList from '@/components/PostsList.vue';

export default {
  name: 'Forum',
  components: {
    PostsList,
  },

  data() {
    return {
      page: 1,
    };
  },

  computed: {
    ...mapState('forum', [
      'hasMorePosts',
    ]),
  },

  beforeMount() {
    const { forum } = this.$route.params;
    this.$store.dispatch('forum/updateCurrentForumView', forum);
  },

  mounted() {
    this.$store.dispatch('forum/clearPosts');
    this.$refs.postsList.fetchPosts();
  },

  watch: {
    $route(to) {
      const newForumView = to.params.forum;
      this.$store.dispatch('forum/updateCurrentForumView', newForumView);

      this.$store.dispatch('forum/clearPosts');
      this.page = 1;
      this.$refs.postsList.fetchPosts();
    },
  },

  methods: {
    prevPage() {
      this.page -= 1;
    },

    nextPage() {
      this.page += 1;
    },

    scrollToTop() {
      this.$el.scrollTo(0, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.forum-content-wrapper {
  overflow: auto;
}

.forum {
  padding: 2rem 1rem;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.page-controls {
  display: flex;
  justify-content: center;
  align-items: center;

  .pg-item {
    border-radius: 100%;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  button.pg-item {
    background-color: 0.15rem solid rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
    font-family: $fonts;

    img {
      height: 1.5rem;

      &.next-page-icon {
        transform: rotate(180deg);
      }
    }
  }

  .cur-page {
    background-color: $primary-accent;
    color: #fff;
  }
}

@media (min-width: 900px) {
  .forum {
    max-width: 900px;
  }
}

@media (min-width: 1000px) {
  .forum {
    margin-left: 2rem;
  }
}
</style>
