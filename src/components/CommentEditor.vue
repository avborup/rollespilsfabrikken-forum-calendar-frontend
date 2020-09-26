<template>
  <form @submit="handleSubmit" :class="{ waiting: isWaiting }">
    <MarkdownEditorWrapper
      ref="markdownEditor"
      :disabled="isWaiting"
      :id="id"
      :initialFiles="initialFiles"
    />
    <input v-if="!isWaiting" class="form-submit" type="submit" value="Opdatér kommentar!">
    <span v-else class="waiting-text">Vent venligst..</span>
    <div v-if="isWaiting" class="overlay"></div>
  </form>
</template>

<script>
import MarkdownEditorWrapper from '@/components/MarkdownEditorWrapper.vue';

export default {
  name: 'CommentCreator',
  components: {
    MarkdownEditorWrapper,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    initialFiles: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isWaiting: false,
    };
  },

  methods: {
    setValue(val) {
      this.$refs.markdownEditor.setValue(val);
    },

    async handleSubmit(event) {
      event.preventDefault();

      const commentContent = this.$refs.markdownEditor.getValue();
      const files = this.$refs.markdownEditor.getFiles();

      if (commentContent.trim().length === 0) {
        this.$dialog.alert('Indholdet må ikke være tomt!');
        return;
      }

      const { forum, postId } = this.$route.params;

      const addedOrUpdatedFiles = files.filter(file => file instanceof File);
      const deletedFiles = this.initialFiles
        .filter(file => files.find(({ name }) => name === file.name) === undefined);

      const promises = [
        this.$store.dispatch('forum/updateComment', {
          postId,
          forumPathName: forum,
          commentId: this.id,
          newBody: commentContent,
        }),
      ];

      if (addedOrUpdatedFiles.length > 0 || deletedFiles.length > 0) {
        const promise = this.$store.dispatch('forum/updateFiles', {
          forumPathName: forum,
          postId,
          commentId: this.id,
          addedOrUpdatedFiles,
          deletedFiles,
        });

        promises.push(promise);
      }

      this.isWaiting = true;

      try {
        await Promise.all(promises);

        this.$emit('comment-updated');
      } catch (error) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }

      this.isWaiting = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

form {
  position: relative;
}

.waiting {
  opacity: 0.75;
}

.form-submit {
  width: 9.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.2rem;
  border: none;
  background-color: $primary-accent;
  color: #fff;
  cursor: pointer;
  font-family: $fonts;
  font-size: 0.9rem;
}

.waiting-text {
  display: block;
  margin: 0.5rem auto 0 auto;
  width: 9rem;
  text-align: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
