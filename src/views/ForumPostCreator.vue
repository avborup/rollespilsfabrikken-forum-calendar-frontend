<template>
  <div class="post-creator-wrapper">
    <h1>Nyt opslag</h1>
    <div class="form-field">
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
    </div>
    <div class="form-field">
      <label for="post-title">Titel</label>
      <input v-model="postTitle" type="text" name="post-title">
    </div>
    <div class="form-field">
      <label>Indhold</label>
      <MarkdownEditorWrapper />
    </div>
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
    };
  },

  computed: {
    ...mapGetters('forum', {
      forums: 'getAllForums',
    }),
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
