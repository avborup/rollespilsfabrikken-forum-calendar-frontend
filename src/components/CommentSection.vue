<template>
    <ul v-if="!isLoading" class="comment-section">
      <p v-if="comments.length === 0" class="no-comments-msg">
        Dette opslag har ingen kommentarer.
      </p>
      <SingleComment
        v-for="comment in comments"
        :key="comment.id"
        v-bind="comment"
        :depth="0"
        :maxDepth="maxDepth"
        :isRootComment="!disableRoot"
      />
    </ul>
    <ul v-else>
      <li v-for="i in 4" :key="i" class="skeleton-comment">
        <div class="avatar">
        </div>
        <p class="author-date skeleton-line"></p>
        <div class="comment-body">
          <div class="skeleton-section">
            <span class="skeleton-line" style="width: 95%"></span>
            <span class="skeleton-line" style="width: 100%"></span>
            <span class="skeleton-line" style="width: 10rem"></span>
          </div>
        </div>
      </li>
    </ul>
</template>

<script>
import SingleComment from '@/components/SingleComment.vue';

export default {
  name: 'CommentSection',
  components: {
    SingleComment,
  },

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    comments: {
      type: Array,
      required: true,
    },

    disableRoot: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      maxDepth: 7,
    };
  },

  mounted() {
    const width = this.$el.offsetWidth;
    const spaceLeftOfEachComment = 24;
    const minimumCommentWidth = 200;
    const maxDepth = Math.floor((width - minimumCommentWidth) / spaceLeftOfEachComment);

    this.maxDepth = maxDepth;
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.comment-section {
  .no-comments-msg {
    margin: 1rem 0;
  }
}

.skeleton-comment {
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-template-rows: 2rem 1fr auto;
  grid-template-areas:
    "avatar info"
    "body body"
    "children children";
  column-gap: 0.5rem;
  row-gap: 0.5rem;
  align-items: center;
  border-left: 0.15rem solid $skeleton-colour;
  padding: 0.25rem 0 0.25rem 0.75rem;

  &:first-child {
    margin-top: 1rem;
  }

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .skeleton-line {
    background-color: $skeleton-colour;
    border-radius: 10rem;
    display: block;
    height: 0.9rem;

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }

  .avatar {
    width: 2rem;
    height: 2rem;
    background-color: $skeleton-colour;
    grid-area: avatar;
    border-radius: 100%;
  }

  .comment-body {
    grid-area: body;
  }

  .author-date {
    grid-area: info;
    width: 20rem;
  }

  .skeleton-line {
    background: linear-gradient(to right,#f3f3f3 1rem,#eee 4rem,#f3f3f3 7rem);
    animation: skeleton-shimmer 2s linear 0s infinite normal forwards;
  }

  @keyframes skeleton-shimmer {
    from {
      background-position: 0 0;
    }

    to {
      background-position: 100vw 0;
    }
  }
}

@media (min-width: 700px) {
  .skeleton-comment {
    @keyframes skeleton-shimmer {
      from {
        background-position: 0 0;
      }

      to {
        background-position: 700px 0;
      }
    }
  }
}
</style>
