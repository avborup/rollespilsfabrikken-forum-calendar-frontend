<template>
  <ul v-if="!isLoading && posts.length > 0" class="posts">
    <PostsListItem
      v-for="post in posts"
      :key="post.id"
      v-bind="post"
      :forum="getForumFromId(post.forumId)"
    />
  </ul>
  <p v-else-if="!isLoading && posts.length === 0" class="no-posts">Dette forum har ingen opslag.</p>
  <ul v-else class="posts">
    <li v-for="i in 6" :key="i" class="post-list-item skeleton-post-item">
      <div class="avatar"></div>
      <h4></h4>
      <p class="author-date">
        <span class="author shimmer"></span>
        <span class="date shimmer"></span>
      </p>
      <div class="post-info">
        <div class="post-comment-info shimmer"></div>
      </div>
      <div class="post-forum shimmer"></div>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import PostsListItem from '@/components/PostsListItem.vue';

export default {
  name: 'PostsList',
  components: {
    PostsListItem,
  },

  props: {
    page: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
    };
  },

  computed: {
    ...mapGetters('forum', {
      posts: 'getPosts',
      getForumFromId: 'getForumFromId',
      forums: 'getAllForums',
    }),
  },

  methods: {
    async fetchPosts() {
      this.isLoading = true;

      if (this.forums.length === 0) {
        return;
      }

      this.$emit('scroll-to-top');

      const forumPathName = this.$router.history.current.params.forum;
      const { page } = this;

      try {
        await this.$store.dispatch('forum/fetchPosts', { forumPathName, page });
        this.isLoading = false;
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }
    },
  },

  watch: {
    // This should only happen once (on page load).
    forums() {
      this.fetchPosts();
    },

    page() {
      this.$store.dispatch('forum/clearPosts');
      this.fetchPosts();
    },
  },

  created() {
    // If the user goes to a specific post and goes back again, this component is
    // recreated. Don't add duplicate posts when this happens.
    if (this.posts.length === 0) {
      this.fetchPosts();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.posts {
  list-style-type: none;
}

.skeleton-post-item {
  .author, .date, h4, .post-comment-info, .avatar {
    background-color: $skeleton-colour;
    border-radius: 10rem;
  }

  .author {
    display: inline-block;
    width: 8rem;
    height: 0.8rem;
    margin-bottom: 0.45rem;
  }

  .date {
    display: inline-block;
    height: 0.8rem;
    width: 7rem;
  }

  h4 {
    height: 1rem;
    margin-top: 0.25rem;
  }

  .post-forum {
    background-color: $skeleton-colour;
    border-color: $skeleton-colour;
    height: 1.85rem;
  }

  .post-comment-info {
    width: 2.5rem;
    height: 1.15rem;
  }

  &:hover {
    background-color: #fff;
  }

  .shimmer {
    background: linear-gradient(to right,#f3f3f3 1rem,#eee 4rem,#f3f3f3 7rem);
    animation: skeleton-shimmer 4s linear 0s infinite normal forwards;
  }
}

.no-posts {
  margin-bottom: 1rem;
}

@keyframes skeleton-shimmer {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 100vw 0;
  }
}

@media (min-width: 600px) {
  .skeleton-post-item {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    .author {
      height: 0.9rem;
      margin-top: 0.3rem;
      margin-bottom: none;
      width: 10rem;
    }

    .date {
      display: none;
    }
  }
}
</style>
