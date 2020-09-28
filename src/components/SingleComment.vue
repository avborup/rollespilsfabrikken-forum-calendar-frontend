<template>
    <li class="comment" :class="{ pinned }" :style="{
      borderLeftColor: pinned ? undefined : colourCycle[depth % colourCycle.length],
    }">
      <UserAvatar :url="user.avatarUrl" class="avatar" />
      <p class="author-date">
        <span v-if="pinned" class="fas fa-thumbtack pin-icon"></span>
        <span class="author">{{ user.username }}</span>
        <span class="date">
          <span class="sep"> &ndash;</span>
          For {{ toElapsedTimeStr(createdAt) }} siden
        </span>
      </p>
      <div class="comment-body">
        <vue-markdown
          class="md-content "
          :breaks="true"
          :html="false"
          :emoji="false"
        >{{ body }}</vue-markdown>
        <p v-if="createdAt < updatedAt" class="comment-edited">
          Kommentar redigeret for {{ toElapsedTimeStr(updatedAt) }} siden
        </p>
        <ul v-if="files.length > 0" class="files-list">
          <li
            v-for="file in files"
            :key="file.name"
            :title="file.name"
            @click="downloadFile(file.id, file.name)"
          >
            <span v-if="!waitingFiles[file.id]" class="fas fa-file file-icon"></span>
            <span v-else class="fas fa-circle-notch fa-spin file-icon"></span>
            <span class="file-name">{{ file.name }}</span>
          </li>
        </ul>
      </div>
      <div class="comment-buttons">
        <button v-if="permissions.canAddComments" @click="toggleCreating" class="icon-and-label">
          <span class="fas fa-reply icon"></span>
          Skriv svar
        </button>
        <button v-if="permissions.canUpdate" @click="toggleEditing" class="icon-and-label">
          <span class="fas fa-pen icon"></span>
          Redigér
        </button>
        <button v-if="permissions.canDelete" @click="deleteComment" class="icon-and-label">
          <span class="fas fa-trash icon"></span>
          Slet
        </button>
        <button
          v-if="isRootComment && permissions.canPin"
          @click="togglePinnedComment"
          class="icon-and-label"
        >
          <span class="fas fa-thumbtack icon"></span>
          {{ pinned ? 'Frigør' : 'Fastgør' }}
        </button>
        <button @click="shareComment" class="icon-and-label">
          <span class="fas fa-share-square icon"></span>
          Del
        </button>
      </div>
      <CommentCreator
        v-if="isWritingComment"
        :parentId="id"
        @comment-created="reload"
        class="comment-creator"
      />
      <CommentEditor
        v-if="isEditingComment"
        :id="id"
        :initialFiles="files"
        @comment-updated="reload"
        ref="commentEditor"
        class="comment-creator"
      />
      <ul class="child-comments" v-if="childComments.length > 0 && depth < maxDepth">
        <SingleComment
          v-for="childComment in childComments"
          :key="childComment.id"
          v-bind="childComment"
          :depth="depth + 1"
          :maxDepth="maxDepth"
        />
      </ul>
      <router-link
        v-else-if="childComments.length > 0"
        :to="{
          name: 'comment',
          params: {
            forum: $route.params.forum,
            postId: $route.params.postId,
            commentId: id,
          },
        }"
        class="comment-link"
      >
        Se {{ numChildren }} kommentarer
        <span class="fas fa-arrow-right icon"></span>
      </router-link>
    </li>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import CommentCreator from '@/components/CommentCreator.vue';
import CommentEditor from '@/components/CommentEditor.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { toElapsedTimeStr } from '@/dateUtils';
import { colourCycle } from '@/constants';

const userObjKeys = ['id', 'username', 'avatarUrl'];

export default {
  name: 'SingleComment',
  components: {
    CommentCreator,
    CommentEditor,
    VueMarkdown,
    UserAvatar,
  },

  props: {
    depth: {
      type: Number,
      required: true,
    },
    maxDepth: {
      type: Number,
      required: true,
    },
    childComments: {
      type: Array,
      required: true,
    },
    numChildren: {
      type: Number,
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
    pinned: {
      type: Boolean,
      required: true,
    },
    isRootComment: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      colourCycle,
      isWritingComment: false,
      isEditingComment: false,
      isTogglingPin: false,
      waitingFiles: {},
    };
  },

  methods: {
    toElapsedTimeStr,

    toggleCreating() {
      this.isEditingComment = false;
      this.isWritingComment = true;
    },

    toggleEditing() {
      this.isWritingComment = false;
      this.isEditingComment = true;
    },

    reload() {
      this.$bubble('reload-post-view');
    },

    deleteComment() {
      const msg = 'Er du sikker på, at du vil slette denne kommentar? Alle underkommentarer vil også blive slettet.';
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

    shareComment() {
      const postUrl = window.location.href.replace(/\/kommentar(.*)/, '');
      const commentUrl = `${postUrl}/kommentar/${this.id}`;

      this.$dialog.alert(`
        <p style="text-align: center">Du kan dele dette URL:</p>
        <a
          href="${commentUrl}"
          style="text-align: center; margin-top: 0.5rem; display: block; overflow-wrap: break-word;"
        >${commentUrl}</a>
      `, {
        html: true,
      });
    },

    async togglePinnedComment() {
      if (this.isTogglingPin) {
        return;
      }

      this.isTogglingPin = true;

      const { forum, postId } = this.$route.params;

      try {
        await this.$store.dispatch('forum/togglePinnedComment', {
          forumPathName: forum,
          postId,
          commentId: this.id,
        });

        this.reload();
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }

      this.isTogglingPin = false;
    },

    async downloadFile(fileId, fileName) {
      if (this.waitingFiles[fileId]) {
        return;
      }

      const { forum, postId } = this.$route.params;

      this.waitingFiles = { ...this.waitingFiles, [fileId]: true };

      try {
        await this.$store.dispatch('forum/downloadFile', {
          forumPathName: forum,
          postId,
          commentId: this.id,
          fileId,
          fileName,
        });
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }

      this.waitingFiles = { ...this.waitingFiles, [fileId]: false };
    },
  },

  updated() {
    if (this.isEditingComment) {
      this.$refs.commentEditor.setValue(this.body);
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.comment {
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-template-rows: 2rem 1fr 1.5rem auto;
  grid-template-areas:
    "avatar info"
    "body body"
    "buttons buttons"
    "editor editor"
    "children children";
  column-gap: 0.5rem;
  align-items: center;
  border-left-width: 0.15rem;
  border-left-style: solid;
  padding: 0.25rem 0 0.25rem 0.75rem;

  .child-comments {
    grid-area: children;
  }

  .comment-edited {
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.6);
    font-style: italic;
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
  }

  .comment-body {
    grid-area: body;
    margin-top: 0.5rem;
  }

  .author-date {
    grid-area: info;

    .author {
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
    align-self: center;

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
    margin-top: 0.5rem;
  }

  .comment-link {
    margin-top: 1rem;
    grid-area: children;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    flex-wrap: wrap;

    .icon {
      margin-left: 0.5rem;
      font-size: 0.7rem;
    }
  }

  &.pinned {
    border-left-color: $pin-colour;

    > .author-date > .author {
      background-color: $pin-colour;
      color: #fff;
      padding: 0.1rem 0.4rem;
      border-radius: 0.2rem;
    }

    .pin-icon {
      color: $pin-colour;
      font-size: 0.9rem;
      transform: rotate(35deg);
      margin-right: 0.5rem;
    }
  }

  .files-list {
    display: flex;
    list-style-type: none;
    flex-wrap: wrap;

    li {
      border: 1px solid #e8e8e8;
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      margin-bottom: 0.5rem;
      max-width: 7rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 0.8rem;
      color: #666;
      cursor: pointer;

      &:not(:last-child) {
        margin-right: 0.5rem;
      }

      .file-icon {
        margin-right: 0.3rem;
        font-size: 0.7rem;
      }
    }
  }
}
</style>
