<template>
  <div class="dg-view-wrapper">
    <div class="form-field" :class="{ 'is-error': nameHasError }">
      <label>Navn</label>
      <input type="text" v-model="roleName" id="form-name">
      <span v-if="nameHasError" class="field-error-msg">{{ nameErrMsg }}</span>
    </div>
    <div class="form-field">
      <label>Farve</label>
      <Chrome v-model="colour" class="color-picker" />
    </div>
    <div class="dg-content-footer">
      <button @click="cancel" class="dg-btn dg-btn--cancel">Fortryd</button>
      <button @click="handleCreateRole" class="dg-btn dg-btn--ok">
        {{ loading ? 'Vent venligst...' : 'Fortsæt' }}
      </button>
    </div>
  </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import { Chrome } from 'vue-color';
import store from '@/store/store';

export default {
  name: 'RoleEditorDialog',

  components: {
    Chrome,
  },

  mixins: [
    // This mixin includes the methods `proceed` and `cancel` to interface with
    // the dialog window. Also provides the `loading` property. For a full reference,
    // see the mixin source code at: https://github.com/Godofbrowser/vuejs-dialog/blob/master/src/plugin/js/mixins/dialog-mixin.js
    DialogMixin,
  ],

  data() {
    let roleName = '';
    let colour = {
      hex: '#8C14C1',
    };

    const init = store.state.editRoleDetails;

    if (init) {
      roleName = init.name;
      //  eslint-disable-next-line
      colour = init.colour;

      if (typeof colour === 'string') {
        colour = { hex: colour };
      }
    }

    store.dispatch('setEditRoleDetails', null);

    return {
      roleName,
      colour,
      nameHasError: false,
      nameErrMsg: '',
    };
  },

  methods: {
    handleCreateRole() {
      this.nameHasError = false;

      if (this.roleName.length === 0) {
        this.nameHasError = true;
        this.nameErrMsg = 'Rollens navn må ikke være tomt';
        return;
      }

      this.proceed({
        roleName: this.roleName,
        colour: this.colour,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.form-field {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;

  label {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  input[type='text'] {
    padding: 0.5rem 0.75rem;
    border-radius: 0.2rem;
    border: 2px solid #f0efef;
    background-color: #f7f7f7;
    font-size: 1rem;
    font-family: $fonts;

    &:focus {
      border-color: $primary-accent;
      outline: none;
    }
  }

  &.is-error > input[type='text'] {
    border-color: $err-colour;
  }

  .field-error-msg {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: $err-colour;
  }
}

.color-picker {
  display: block;
  margin: 0 auto;
}
</style>
