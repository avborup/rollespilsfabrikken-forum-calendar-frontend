<template>
  <div class="markdown-editor-container">
    <!-- eslint-disable -->
    <markdown-editor
      toolbar="redo undo | bold italic heading strikethrough | numlist bullist quote code | preview | help"
      :extend="customButtons"
      @command:help="help"
      height="auto"
      :shouldBreakOnNewline="false"
      :titles="{
        undo: 'Fortryd',
        redo: 'Gentag',
        bullist: 'Unummeret liste',
        numlist: 'Nummeret liste',
        bold: 'Fed',
        italic: 'Kursiv',
        strikethrough: 'Gennemstreget',
        heading: 'Overskrift',
        code: 'Monospace-blok',
        quote: 'Citat',
        preview: 'Forhåndsvisning',
      }"
      class="markdown-editor"
      ref="markdownEditor"
    ></markdown-editor>
    <!-- eslint-enable -->
  </div>
</template>

<script>
import 'v-markdown-editor/dist/v-markdown-editor.css';

export default {
  name: 'MarkdownEditorWrapper',

  data() {
    return {
      customButtons: {
        help: {
          cmd: 'help',
          ico: 'fas fa-question',
          title: 'Få hjælp til Markdown',
        },
      },
    };
  },

  methods: {
    help() {
      if (this.getValue().length > 0) {
        const base = window.location.href.split('://')[1].split('/')[0];
        const href = `${base}/markdown-guide`;
        this.$dialog.confirm(`Er du sikker på, at du vil forlade siden? Dine ændringer gemmes ikke.<br><br>Du kan alternativt indsætte dette URL i en ny fane for at se guiden: <span style="font-family: monospace">${href}</span>`, {
          html: true,
        })
          .then(() => this.$router.push({
            name: 'markdown-guide',
          }))
          .catch(() => {});
      } else {
        this.$router.push({
          name: 'markdown-guide',
        });
      }
    },

    getValue() {
      return this.$refs.markdownEditor.editor.getValue();
    },

    setValue(val) {
      return this.$refs.markdownEditor.editor.setValue(val);
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/theme.scss';

.markdown-editor-container {
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  overflow-y: auto;

  .is-error & {
    border-color: $err-colour;
  }

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
