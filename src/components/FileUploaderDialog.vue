<template>
  <form @submit.prevent="handleSubmit" class="dg-view-wrapper">
    <label
      @drop.prevent="handleDroppedFiles"
      @dragover.prevent
      class="drop-file-area"
      for="file-uploader-dialog-input"
    >
      <input type="file" multiple @change="handleFileInput" id="file-uploader-dialog-input">
      <p v-if="files.length === 0" class="drag-drop-message">
        <span class="fas fa-file-upload icon"></span>
        Træk og slip dine filer her!
      </p>
      <ul>
        <li v-for="file in files" :key="file.name" :title="file.name">
          <span class="file-size">{{ (file.size / 1048576).toFixed(1) }} MB</span>
          <span class="file-name">{{ file.name }}</span>
          <button type="button" title="Fjern fil" @click="removeFile(file.name)">&times;</button>
        </li>
      </ul>
    </label>
    <span v-if="hasErr" class="err-msg">{{ errMsg }}</span>
    <div class="dg-content-footer">
      <button type="button" @click="cancel" class="dg-btn dg-btn--cancel">Fortryd</button>
      <input class="dg-btn dg-btn--ok" type="submit" value="Tilføj filer">
    </div>
  </form>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import { MAX_FILE_SIZE } from '@/api/constants';

export default {
  name: 'FileUploaderDialog',

  mixins: [
    // This mixin includes the methods `proceed` and `cancel` to interface with
    // the dialog window. Also provides the `loading` property. For a full reference,
    // see the mixin source code at: https://github.com/Godofbrowser/vuejs-dialog/blob/master/src/plugin/js/mixins/dialog-mixin.js
    DialogMixin,
  ],

  data() {
    return {
      files: [],
      hasErr: false,
      errMsg: '',
    };
  },

  methods: {
    handleDroppedFiles(event) {
      this.addFiles(event.dataTransfer.files);
    },

    handleFileInput(event) {
      this.addFiles(event.target.files);
    },

    addFiles(fileList) {
      // No duplicate file names allowed.
      const files = [...fileList]
        .filter(file => this.files.find(({ name }) => file.name === name) === undefined);

      this.files.push(...files);
    },

    removeFile(filename) {
      this.files = this.files.filter(file => file.name !== filename);
    },

    handleSubmit() {
      this.hasErr = false;

      const hasTooLargeFile = this.files
        .find(file => (file.size / 1048576) > MAX_FILE_SIZE) !== undefined;

      if (hasTooLargeFile) {
        this.hasErr = true;
        this.errMsg = 'Filer må ikke være større end 250 MB!';
        return;
      }

      this.proceed(this.files);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

form {
  max-height: 80vh;
  overflow-y: auto;
}

.drop-file-area {
  width: 100%;
  min-height: 10rem;
  border-radius: 0.3rem;
  border: 0.2rem dashed rgba(0, 0, 0, 0.5);
  position: relative;
  font-family: $fonts;
  padding: 0.75rem;
  display: block;

  #file-uploader-dialog-input {
    visibility: hidden;
    width: 1px;
    height: 1px;
    position: absolute;
  }

  .drag-drop-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 600;
    color:rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    text-align: center;

    .icon {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }

  ul {
    list-style-type: none;

    li {
      display: grid;
      grid-template-columns: auto 1fr 1.5rem;
      grid-template-rows: 1.2rem;

      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }

      .file-size {
        font-weight: 600;
        font-size: 0.9rem;
        margin-right: 0.5rem;
      }

      .file-name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      button {
        height: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
        font-size: 1.5rem;
        font-family: $fonts;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        overflow: hidden;
      }
    }
  }
}

span.err-msg {
  font-size: 0.9rem;
  color: $err-colour;
  margin-top: 0.25rem;
  display: block;
}
</style>
