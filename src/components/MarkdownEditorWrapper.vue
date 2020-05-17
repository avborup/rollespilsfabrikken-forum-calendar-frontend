<template>
  <div class="markdown-editor-container">
    <!-- eslint-disable -->
    <markdown-editor
      toolbar="redo undo | bold italic heading strikethrough | numlist bullist quote code | preview"
      height="auto"
      class="markdown-editor"
    ></markdown-editor>
    <!-- eslint-enable -->
  </div>
</template>

<script>
import 'v-markdown-editor/dist/v-markdown-editor.css';

export default {
  name: 'MarkdownEditorWrapper',
};
</script>

<style lang="scss">
@import '@/assets/scss/theme.scss';

.markdown-editor-container {
  border: 1px solid #e8e8e8;
  border-radius: 5px;

  .markdown-editor.v-md-container {
    border: none;

    .v-md-toolbar {
      display: flex;
      flex-wrap: wrap;
      row-gap: 0.5rem;

      .btn-group {
        &:not(:last-child) {
          margin-right: 0.5rem;
        }

        button {
          padding: 0.4rem 0.75rem;
          color: #fff;
          background-color: $primary-accent;
          border: 1px solid #fff;
          cursor: pointer;

          $br-size: 0.4rem;

          &:first-child {
            border-top-left-radius: $br-size;
            border-bottom-left-radius: $br-size;
          }

          &:last-child {
            border-top-right-radius: $br-size;
            border-bottom-right-radius: $br-size;
          }

          &:not(:first-child) {
            margin-left: -0.1rem;
          }
        }
      }
    }
  }
}
</style>
