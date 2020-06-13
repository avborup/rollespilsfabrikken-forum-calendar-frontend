<template>
  <div>
    <div class="comments-container">
      <div v-if="commentExists && !errorOccurred">
        <router-link
          :to="{
            name: 'post',
            params: {
              forum: $route.params.forum,
              postId: $route.params.postId,
            },
          }"
          class="post-link"
        >
          <span class="fas fa-arrow-left icon"></span>
          Til opslag
        </router-link>
        <CommentSection
          :isLoading="isLoading"
          @reload-post-view="fetchComment"
          :comments="[comment]"
        />
      </div>
      <div v-else-if="!commentExists" class="comment-not-found">
        <h1>Kommentar findes ikke</h1>
        <p>Kommentaren, du leder efter, er ikke tilgængelig.</p>
        <p class="attempted-comment">{{ $route.params.commentId }}</p>
      </div>
      <div v-else class="error-occurred">
        <h1>Der opstod en fejl</h1>
        <p>Kommentaren kunne ikke indlæses.</p>
        <p class="attempted-comment">{{ $route.params.commentId }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ResourceNotFoundError } from '@/api/errors';
import CommentSection from '@/components/CommentSection.vue';

export default {
  name: 'ForumCommentViewer',

  components: {
    CommentSection,
  },

  data() {
    return {
      isLoading: true,
      commentExists: true,
      errorOccurred: false,
    };
  },

  computed: {
    ...mapGetters('forum', {
      allForums: 'getAllForums',
    }),
    ...mapState('forum', {
      comment: 'currentComment',
    }),
  },

  methods: {
    async fetchComment() {
      this.isLoading = true;
      this.commentExists = true;
      this.errorOccurred = false;

      if (this.allForums.length === 0) {
        return;
      }

      const { forum, postId, commentId } = this.$route.params;
      const forumId = this.$store.getters['forum/getForumFromPathName'](forum).id;

      try {
        await this.$store.dispatch('forum/fetchComment', { forumId, postId, commentId });
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          this.commentExists = false;
        }

        this.errorOccurred = true;
      }
      this.isLoading = false;
    },
  },

  created() {
    this.fetchComment();
  },

  watch: {
    $route() {
      this.fetchComment();
    },

    allForums() {
      this.fetchComment();
    },
  },
};
</script>

<style lang="scss" scoped>
.comments-container {
  .post-link {
    display: flex;
    align-items: center;
    font-size: 1rem;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;

    .icon {
      margin-right: 0.5rem;
    }
  }
}

.comment-not-found, .error-occurred {
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

    &.attempted-comment {
      font-family: monospace;
    }
  }
}
</style>
