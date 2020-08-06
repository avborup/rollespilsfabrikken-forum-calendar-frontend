<template>
  <form @submit="handleSubmit" :class="{ waiting: isWaiting }">
    <input v-model="newTitle" type="text">
    <MarkdownEditorWrapper
      ref="markdownEditor"
      :disabled="isWaiting"
      :initialFiles="originalFiles"
    />
    <input v-if="!isWaiting" class="form-submit" type="submit" value="Opdatér opslag!">
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
    postId: {
      type: String,
      required: true,
    },
    originalBody: {
      type: String,
      required: true,
    },
    originalTitle: {
      type: String,
      required: true,
    },
    originalFiles: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isWaiting: false,
      newTitle: this.originalTitle,
    };
  },

  mounted() {
    this.setValue(this.originalBody);
  },

  methods: {
    setValue(val) {
      this.$refs.markdownEditor.setValue(val);
    },

    getValue() {
      return this.$refs.markdownEditor.getValue();
    },

    hasChanged() {
      return this.getValue() !== this.originalBody || this.newTitle !== this.originalTitle;
    },

    async handleSubmit(event) {
      event.preventDefault();

      if (this.newTitle.trim().length === 0) {
        this.$dialog.alert('Titlen må ikke være tom!');
        return;
      }

      const postContent = this.getValue();

      if (postContent.trim().length === 0) {
        this.$dialog.alert('Indholdet må ikke være tomt!');
        return;
      }

      const { forum, postId } = this.$route.params;

      this.isWaiting = true;

      try {
        await this.$store.dispatch('forum/updatePost', {
          forumPathName: forum,
          postId,
          newTitle: this.newTitle,
          newBody: postContent,
        });

        this.$emit('post-updated');
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

  input[type='text'] {
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    font-size: 1rem;
    font-weight: 700;
    padding: 13px;
    font-family: $fonts;
    height: 40px;
    color: #35495e;
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

.waiting {
  opacity: 0.75;
}

.form-submit {
  width: 8rem;
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
