<template>
    <li class="comment" :class="{
      'editor-open': isWritingComment,
    }"
    :style="{
      borderLeftColor: colourCycle[depth % colourCycle.length],
    }">
      <div>
        <div class="avatar">
          <img src="/assets/icons/person.svg" alt="Avatar icon">
        </div>
      </div>
      <p class="author-date">
        <span class="author">{{ user.username }}</span>
        <span class="date">
          <span class="sep"> &ndash;</span>
          For {{ toElapsedTimeStr(createdAt) }} siden
        </span>
      </p>
      <vue-markdown
        class="md-content comment-body"
        :breaks="false"
        :html="false"
      >{{ body }}</vue-markdown>
      <div class="comment-buttons">
        <button v-if="permissions.canAddComments" @click="toggleEditor" class="icon-and-label">
          <span class="fas fa-pen icon"></span>
          Skriv svar
        </button>
        <button v-if="permissions.canDelete" @click="deleteComment" class="icon-and-label">
          <span class="fas fa-trash icon"></span>
          Slet
        </button>
      </div>
      <CommentCreator
        v-if="isWritingComment"
        :parentId="id"
        @comment-created="reload"
        class="comment-creator"
      />
      <ul class="child-comments" v-if="childComments.length > 0">
        <SingleComment
          v-for="childComment in childComments"
          :key="childComment.id"
          v-bind="childComment"
          :depth="depth + 1"
        />
      </ul>
    </li>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import CommentCreator from '@/components/CommentCreator.vue';
import { toElapsedTimeStr } from '@/dateUtils';
import { colourCycle } from '@/constants';

const userObjKeys = ['id', 'username', 'avatarUrl'];

export default {
  name: 'SingleComment',
  components: {
    CommentCreator,
    VueMarkdown,
  },

  props: {
    depth: {
      type: Number,
      required: true,
    },
    childComments: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true,
      validator: provided => userObjKeys.every(key => key in provided),
    },
    id: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
    permissions: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      colourCycle,
      isWritingComment: false,
    };
  },

  methods: {
    toElapsedTimeStr,

    toggleEditor() {
      this.isWritingComment = !this.isWritingComment;
    },

    reload() {
      this.$bubble('reload-post-view');
    },

    deleteComment() {
      const msg = 'Er du sikker på, at du vil slette denne kommentar?';
      const options = {
        loader: true,
      };

      this.$dialog.confirm(msg, options)
        .then(async (dialog) => {
          const { forum, postId } = this.$route.params;

          try {
            await this.$store.dispatch('forum/deleteComment', {
              forumPathName: forum,
              postId,
              commentId: this.id,
            });

            dialog.close();
            this.reload();
          } catch (error) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.comment {
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-template-rows: 2rem 1fr 1rem auto;
  grid-template-areas:
    "avatar info"
    "body body"
    "buttons buttons"
    "children children";
  column-gap: 0.5rem;
  row-gap: 0.5rem;
  align-items: center;
  border-left-width: 0.15rem;
  border-left-style: solid;
  padding: 0.25rem 0 0.25rem 0.75rem;

  &.editor-open {
    grid-template-areas:
      "avatar info"
      "body body"
      "buttons buttons"
      "editor editor"
      "children children";
  }

  .child-comments {
    grid-area: children;
  }

  &:first-child {
    margin-top: 1rem;
  }

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .avatar {
    width: 2rem;
    height: 2rem;
    grid-area: avatar;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $primary-accent;
    border-radius: 100%;

    img {
      width: 1rem;
      height: 1rem;
    }
  }

  .comment-body {
    grid-area: body;
  }

  .author-date {
    grid-area: info;

    .author {
      text-transform: uppercase;
      color: $primary-accent;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9rem;
    }
  }

  .comment-buttons {
    grid-area: buttons;
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.5rem;

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

  .comment-creator {
    grid-area: editor;
  }
}
</style>
