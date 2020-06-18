<template>
  <div class="dg-view-wrapper">
    <p class="instruction">Vælg en rolle fra listen forneden.</p>
    <multiselect
      v-model="selectedRole"
      :options="allRoles"
      label="title"
      track-by="id"
      selectLabel="Tryk på 'enter' for at vælge"
      selectedLabel="Valgt"
      deselectLabel="Tryk på 'enter' for at fravælge"
      name="role-selection"
      :placeholder="'Vælg rolle'"
    />
    <div class="dg-content-footer">
      <button @click="cancel" class="dg-btn dg-btn--cancel">Fortryd</button>
      <button @click="handleAddRole" class="dg-btn dg-btn--ok">
        {{ loading && selectedRole !== null ? 'Vent venligst...' : 'Tilføj rolle' }}
      </button>
    </div>
  </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import Multiselect from 'vue-multiselect';
import store from '@/store/store';

export default {
  name: 'RolesPickerDialog',

  components: {
    Multiselect,
  },

  mixins: [
    // This mixin includes the methods `proceed` and `cancel` to interface with
    // the dialog window. Also provides the `loading` property. For a full reference,
    // see the mixin source code at: https://github.com/Godofbrowser/vuejs-dialog/blob/master/src/plugin/js/mixins/dialog-mixin.js
    DialogMixin,
  ],

  data() {
    return {
      selectedRole: null,
      allRoles: store.getters.allRoles,
    };
  },

  methods: {
    handleAddRole() {
      this.proceed(this.selectedRole);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.instruction {
  margin-bottom: 0.5rem;
}
</style>
