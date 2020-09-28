<template>
  <div class="markdown-editor-container">
    <markdown-editor
      :toolbar="toolbar"
      :extend="customButtons"
      @command:help="help"
      @command:upload="upload"
      height="auto"
      :shouldBreakOnNewline="true"
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
    <ul v-if="!hideFileUpload && files.length > 0" class="files-list">
      <li v-for="file in files" :key="file.name" :title="file.name">
        <span class="fas fa-file file-icon"></span>
        <span class="file-name">{{ file.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import 'v-markdown-editor/dist/v-markdown-editor.css';
import { mapState } from 'vuex';

export default {
  name: 'MarkdownEditorWrapper',

  props: {
    id: {
      type: String,
      required: true,
    },
    hideFileUpload: {
      type: Boolean,
      default: false,
    },
    initialFiles: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    const uploadToolbar = this.hideFileUpload ? '' : ' upload |';
    const toolbar = `redo undo | bold italic heading strikethrough | numlist bullist quote code |${uploadToolbar} preview | help`;

    return {
      toolbar,
      customButtons: {
        help: {
          cmd: 'help',
          ico: 'fas fa-question',
          title: 'Få hjælp til Markdown',
        },
        upload: {
          cmd: 'upload',
          ico: 'fas fa-file-upload',
          title: 'Upload filer',
        },
      },
    };
  },

  computed: {
    ...mapState('forum', {
      fileLists: 'editorFileLists',
    }),

    files() {
      return this.fileLists[this.id] !== undefined
        ? this.fileLists[this.id]
        : [];
    },
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

    upload() {
      this.$store.dispatch('forum/setCurrentEditorFileListId', this.id);
      this.$dialog.confirm(null, {
        view: 'file-upload-dialog',
      })
        .then((data) => {
          this.$store.dispatch('forum/setEditorFileList', {
            id: this.id,
            files: data.data,
          });
        })
        .catch(() => {});
    },

    getValue() {
      return this.$refs.markdownEditor.editor.getValue();
    },

    setValue(val) {
      return this.$refs.markdownEditor.editor.setValue(val);
    },

    getFiles() {
      return this.files;
    },
  },

  created() {
    this.$store.dispatch('forum/setEditorFileList', {
      id: this.id,
      files: this.initialFiles,
    });
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

  .files-list {
    padding: 0.5rem 0.5rem 0 0.5rem;
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
