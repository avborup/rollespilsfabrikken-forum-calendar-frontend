<template>
  <div class="post-creator-wrapper">
    <h1>Nyt opslag</h1>
    <form @submit="handleSubmit">
      <div class="form-field" :class="{ 'is-error': forumHasError }">
        <label for="forum-selection">Vælg et forum</label>
        <multiselect
          v-model="selectedForum"
          :options="forums"
          label="name"
          track-by="id"
          selectLabel="Tryk på 'enter' for at vælge"
          selectedLabel="Valgt"
          deselectLabel="Tryk på 'enter' for at fravælge"
          name="forum-selection"
          :placeholder="'Vælg forum'"
        />
        <span v-if="forumHasError" class="field-error-msg">{{ forumErrorMsg }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': titleHasError }">
        <label for="post-title">Titel</label>
        <input v-model="postTitle" type="text" name="post-title">
        <span v-if="titleHasError" class="field-error-msg">{{ titleErrorMsg }}</span>
      </div>
      <div class="form-field">
        <label>Indhold</label>
        <MarkdownEditorWrapper ref="markdownEditor" />
      </div>
      <input class="form-submit" type="submit" value="Opret opslag!">
    </form>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapGetters } from 'vuex';
import MarkdownEditorWrapper from '@/components/MarkdownEditorWrapper.vue';

export default {
  name: 'ForumPostCreator',
  components: {
    Multiselect,
    MarkdownEditorWrapper,
  },

  data() {
    return {
      selectedForum: null,
      postTitle: '',
      titleHasError: false,
      titleErrorMsg: '',
      forumHasError: false,
      forumErrorMsg: '',
    };
  },

  computed: {
    ...mapGetters('forum', {
      forums: 'getAllForums',
    }),
  },

  methods: {
    async handleSubmit(event) {
      event.preventDefault();

      this.titleHasError = false;
      this.forumHasError = false;

      const { postTitle, selectedForum } = this;
      const postContent = this.$refs.markdownEditor.getValue();

      if (selectedForum === null) {
        this.forumHasError = true;
        this.forumErrorMsg = 'Vælg venligst et forum';
      }

      if (postTitle.length === 0) {
        this.titleHasError = true;
        this.titleErrorMsg = 'Skriv venligst en titel til dit opslag';
      }

      if (postTitle.length > 255) {
        this.titleHasError = true;
        this.titleErrorMsg = `Titlen må ikke være længere end 255 tegn (${postTitle.length} tegn)`;
      }

      if (this.forumHasError || this.titleHasError) {
        return;
      }

      const forumId = selectedForum.id;
      const post = {
        title: postTitle,
        body: postContent,
      };

      try {
        const createdPost = await this.$store.dispatch('forum/createPost', { forumId, post });
        this.$router.push({
          name: 'post',
          params: {
            forum: selectedForum.pathName,
            postId: createdPost.id,
          },
        });
      } catch (error) {
        alert('Der opstod en fejl!');
      }
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
@import '@/assets/scss/theme.scss';

.multiselect__option--highlight, .multiselect__option--highlight:after {
  background-color: $primary-accent;
}
</style>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.post-creator-wrapper {
  padding: 1rem;

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .form-field {
    margin-bottom: 1rem;

    label {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      display: block;
    }

    // Style is made to match that of Multiselect.
    input[type='text'] {
      border-radius: 5px;
      border: 1px solid #e8e8e8;
      font-size: 1rem;
      padding: 13px;
      font-family: $fonts;
      height: 40px;
      color: #35495e;
      width: 100%;
    }

    &.is-error > input[type='text'] {
      border-color: $err-colour;
    }

    &.is-error > .multiselect {
      border: 1px solid $err-colour;
      border-radius: 5px;
    }

    .field-error-msg {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: $err-colour;
    }
  }

  .form-submit {
    width: 7rem;
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.2rem;
    border: none;
    background-color: $primary-accent;
    color: #fff;
    cursor: pointer;
    font-family: $fonts;
    font-size: 0.9rem;
    margin: 0 auto;
    display: block;
  }
}

@media (min-width: 700px) {
  .post-creator-wrapper {
    width: 700px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
