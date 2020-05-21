<template>
  <div v-if="postExists && !otherErrorOccurred" class="view-container">
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
          :breaks="false"
          :html="false"
        >{{ post.body }}</vue-markdown>
      </div>
      <div v-else class="skeleton-post-wrapper">
        <div class="post-header">
          <div class="avatar"></div>
          <span class="author skeleton-line"></span>
          <span class="date skeleton-line"></span>
          <h1 class="title">
            <span class="skeleton-line"></span>
            <span class="skeleton-line"></span>
          </h1>
        </div>
        <div class="md-content post-content">
          <div class="skeleton-section">
            <span class="skeleton-line" style="width: 95%"></span>
            <span class="skeleton-line" style="width: 100%"></span>
            <span class="skeleton-line" style="width: 10rem"></span>
          </div>
          <div class="skeleton-section">
            <span class="skeleton-line" style="width: 100%"></span>
            <span class="skeleton-line" style="width: 93%"></span>
            <span class="skeleton-line" style="width: 97%"></span>
            <span class="skeleton-line" style="width: 95%"></span>
            <span class="skeleton-line" style="width: 15%"></span>
          </div>
          <div class="skeleton-section">
            <span class="skeleton-line" style="width: 100%"></span>
            <span class="skeleton-line" style="width: 60%"></span>
          </div>
        </div>
      </div>
      <div v-if="!isLoadingPost" class="post-info-and-buttons">
        <div class="icon-and-label">
          <img src="/assets/icons/comment.svg" alt="Comment icon">
          {{ post.commentCount }} kommentarer
        </div>
        <button
          v-if="post.permissions.canAddComments"
          @click="openCommentEditor"
          class="icon-and-label"
        >
          <span class="fas fa-reply icon"></span>
          Skriv kommentar
        </button>
        <button
          v-if="post.permissions.canUpdate"
          @click="togglePostUpdater"
          class="icon-and-label"
        >
          <span class="fas fa-pen icon"></span>
          Redigér opslag
        </button>
        <button v-if="post.permissions.canDelete" @click="deletePost" class="icon-and-label">
          <span class="fas fa-trash icon"></span>
          Slet opslag
        </button>
        <button class="icon-and-label">
          <img src="/assets/icons/send.svg" alt="Comment icon">
          Del
        </button>
      </div>
      <div v-else class="skeleton-post-info-and-buttons post-info-and-buttons">
        <div class="icon-and-label">
          <span class="skeleton-icon"></span>
          <span class="skeleton-label skeleton-line"></span>
        </div>
        <div class="icon-and-label">
          <span class="skeleton-icon"></span>
          <span class="skeleton-label skeleton-line"></span>
        </div>
        <div class="icon-and-label">
          <span class="skeleton-icon"></span>
          <span class="skeleton-label skeleton-line"></span>
        </div>
      </div>
      <PostUpdater
        v-if="isEditingPost"
        :postId="post.id"
        :originalBody="post.body"
        :originalTitle="post.title"
        ref="postUpdater"
        @post-updated="reload"
        class="post-updater"
      />
      <div class="comments-wrapper">
        <h2 class="comments-header">Kommentarer</h2>
        <CommentCreator v-if="isWritingComment" @comment-created="reload" class="comment-creator" />
        <CommentSection :isLoading="isLoadingComments" @reload-post-view="reload" />
      </div>
    </div>
  </div>
  <div v-else-if="!postExists" class="post-not-found">
    <h1>Opslag findes ikke</h1>
    <p>Opslaget, du leder efter, er ikke tilgængeligt.</p>
    <p class="attempted-post">{{ $route.params.postId }}</p>
  </div>
  <div v-else class="error-occurred">
    <h1>Der opstod en fejl</h1>
    <p>Opslaget kunne ikke indlæses.</p>
    <p class="attempted-post">{{ $route.params.postId }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueMarkdown from 'vue-markdown';
import CommentSection from '@/components/CommentSection.vue';
import CommentCreator from '@/components/CommentCreator.vue';
import PostUpdater from '@/components/PostUpdater.vue';
import { ResourceNotFoundError } from '@/api/errors';
import { toElapsedTimeStr } from '@/dateUtils';

export default {
  name: 'ForumPostViewer',
  components: {
    VueMarkdown,
    CommentSection,
    CommentCreator,
    PostUpdater,
  },

  data() {
    return {
      isLoadingPost: true,
      isLoadingComments: true,
      postExists: true,
      otherErrorOccurred: false,
      isWritingComment: false,
      isEditingPost: false,
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
      this.postExists = true;
      this.otherErrorOccurred = false;

      if (this.forums.length === 0) {
        return;
      }

      const { postId, forum } = this.$route.params;

      this.$store.dispatch('forum/fetchPost', { postId, forumPathName: forum })
        .then(() => {
          this.isLoadingPost = false;
        })
        .catch((err) => {
          if (err instanceof ResourceNotFoundError) {
            this.postExists = false;
            return;
          }

          this.otherErrorOccurred = true;
        });

      this.$store.dispatch('forum/fetchComments', { postId, forumPathName: forum })
        .then(() => {
          this.isLoadingComments = false;
        })
        .catch(() => {
          this.otherErrorOccurred = true;
        });
    },

    reload() {
      this.isWritingComment = false;
      this.isEditingPost = false;
      this.fetchPost();
    },

    openCommentEditor() {
      this.isWritingComment = true;
    },

    togglePostUpdater() {
      if (this.isEditingPost && this.$refs.postUpdater.hasChanged()) {
        this.$dialog.confirm('Dine ændringer vil gå tabt. Vil du fortsætte?')
          .then(() => {
            this.isEditingPost = !this.isEditingPost;
          })
          .catch(() => {});
      } else {
        this.isEditingPost = !this.isEditingPost;
      }
    },

    deletePost() {
      const msg = 'Er du sikker på, at du vil slette dette opslag?';
      const options = {
        loader: true,
      };

      this.$dialog.confirm(msg, options)
        .then(async (dialog) => {
          const { forum, postId } = this.$route.params;

          try {
            await this.$store.dispatch('forum/deletePost', {
              forumPathName: forum,
              postId,
            });

            dialog.close();
            this.fetchPost();
          } catch (error) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        })
        .catch(() => {});
    },
  },

  watch: {
    // This should only happen once (on page load).
    forums() {
      this.fetchPost();
    },

    $route() {
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
    flex-wrap: wrap;
    row-gap: 0.5rem;

    .icon-and-label {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);

      img, .icon {
        height: 1rem;
        width: 1rem;
        margin-right: 0.3rem;
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.25);
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

.skeleton-post-wrapper {
  .post-header {
    .author, .date, .avatar, .title .skeleton-line {
      background-color: $skeleton-colour;
      border-radius: 10rem;
    }

    .author, .date {
      height: 0.9rem;
    }

    .author {
      width: 15rem;
    }

    .date {
      width: 12rem;
    }

    .title .skeleton-line {
      display: block;
      height: 1.7rem;

      &:not(:last-child) {
        width: 100%;
        margin-bottom: 0.75rem;
      }

      &:last-child {
        width: 20rem;
      }
    }
  }

  .post-content .skeleton-section {
    margin-bottom: 1rem;

    .skeleton-line {
      background-color: $skeleton-colour;
      border-radius: 10rem;
      display: block;
      height: 0.9rem;

      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }
    }
  }

  .skeleton-line {
    background: linear-gradient(to right,#f3f3f3 1rem,#eee 4rem,#f3f3f3 7rem);
    animation: skeleton-shimmer 2s linear 0s infinite normal forwards;
  }
}

.skeleton-post-info-and-buttons {
  .icon-and-label {
    margin-right: 1rem;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.6);

    .skeleton-label, .skeleton-icon {
      display: block;
      background-color: $skeleton-colour;
      border-radius: 10rem;
      height: 0.9rem;
    }

    .skeleton-label {
      width: 4rem;
    }

    .skeleton-icon {
      width: 0.9rem;
      margin-right: 0.3rem;
    }

    .skeleton-line {
      background: linear-gradient(to right,#f3f3f3 1rem,#eee 4rem,#f3f3f3 7rem);
      animation: skeleton-shimmer 6s linear 0s infinite normal forwards;
    }
  }
}

@keyframes skeleton-shimmer {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 100vw 0;
  }
}

.comments-header {
  margin-top: 1.5rem;
}

.comment-creator {
  margin-top: 1rem;
}

.post-updater {
  margin-top: 1rem;
}

.post-not-found, .error-occurred {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  p {
    color: rgba(0, 0, 0, 0.75);
    margin-bottom: 1rem;

    &.attempted-post {
      font-family: monospace;
    }
  }
}

@media (min-width: 700px) {
  .post-container {
    width: 700px;
    margin-right: auto;
    margin-left: auto;
  }

  @keyframes skeleton-shimmer {
    from {
      background-position: 0 0;
    }

    to {
      background-position: 700px 0;
    }
  }
}
</style>
