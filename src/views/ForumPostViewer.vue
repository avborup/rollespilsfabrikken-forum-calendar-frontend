<template>
  <div class="view-container">
    <div class="post-container">
      <div v-if="!isLoadingPost" class="post-wrapper">
        <div class="post-header">
          <div class="avatar">
            <img src="/assets/icons/person.svg" alt="Avatar icon">
          </div>
          <span class="author">{{ post.user.username }}</span>
          <span class="date">Slået op for {{ toElapsedTimeStr(post.createdAt) }} siden</span>
          <h1 class="title">{{ post.title }}</h1>
        </div>
        <vue-markdown
          class="md-content post-content"
          :html="false"
        >{{ post.body }}</vue-markdown>
      </div>
      <div v-if="!isLoadingPost" class="post-info-and-buttons">
        <div class="icon-and-label">
          <img src="/assets/icons/comment.svg" alt="Comment icon">
          {{ post.commentCount }} kommentarer
        </div>
        <button class="icon-and-label">
          <img src="/assets/icons/send.svg" alt="Comment icon">
          Del
        </button>
      </div>
      <div v-if="!isLoadingComments" class="comments-wrapper">
        <h2 class="comments-header">Kommentarer</h2>
        <CommentSection />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueMarkdown from 'vue-markdown';
import CommentSection from '@/components/CommentSection.vue';
import { toElapsedTimeStr } from '@/dateUtils';

export default {
  name: 'ForumPostViewer',
  components: {
    VueMarkdown,
    CommentSection,
  },

  data() {
    return {
      isLoadingPost: true,
      isLoadingComments: true,
    };
  },

  computed: {
    ...mapGetters('forum', {
      forums: 'getAllForums',
      post: 'getCurrentPost',
    }),
  },

  methods: {
    toElapsedTimeStr,

    fetchPost() {
      this.isLoadingPost = true;
      this.isLoadingComments = true;

      if (this.forums.length === 0) {
        return;
      }

      const { postId, forum } = this.$route.params;

      this.$store.dispatch('forum/fetchPost', { postId, forumPathName: forum })
        .then(() => {
          this.isLoadingPost = false;
        })
        // TODO: Will be handled.
        .catch(err => console.log(err));

      this.$store.dispatch('forum/fetchComments', { postId, forumPathName: forum })
        .then(() => {
          this.isLoadingComments = false;
        })
        // TODO: Will be handled.
        .catch(err => console.log(err));
    },
  },

  watch: {
    // This should only happen once (on page load).
    forums() {
      this.fetchPost();
    },
  },

  created() {
    this.fetchPost();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.post-container {
  margin: 0.8rem;
  padding: 1rem 0;

  .post-header {
    display: grid;
    grid-template-columns: 3rem 1fr;
    grid-template-rows: 1.25rem 1.25rem auto;
    grid-template-areas:
      "avatar author"
      "avatar date  "
      "title  title ";
    align-items: center;
    column-gap: 1rem;
    margin-bottom: 0.6rem;
    padding: 0 0.8rem 0.6rem 0.8rem;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.1);

    .avatar {
      width: 3rem;
      height: 3rem;
      grid-area: avatar;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $primary-accent;
      border-radius: 100%;

      img {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .author {
      text-transform: uppercase;
      color: $primary-accent;
      font-weight: bold;
      font-size: 1rem;
    }

    .date {
      color: rgba(0, 0, 0, 0.6);
    }

    .title {
      grid-area: title;
      font-size: 1.7rem;
      margin-top: 1rem;
    }
  }

  .post-info-and-buttons {
    display: flex;

    .icon-and-label {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);

      img {
        height: 1rem;
        width: 1rem;
        margin-right: 0.3rem;
      }
    }

    button {
      cursor: pointer;
      border: none;
      background-color: #fff;
      font-family: inherit;
    }
  }

  .post-content {
    padding: 0 0.8rem;
    margin-bottom: 0.5rem;
  }
}

.comments-header {
  margin-top: 1.5rem;
}

@media (min-width: 700px) {
  .post-container {
    width: 700px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
