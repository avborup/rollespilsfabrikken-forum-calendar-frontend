<template>
  <div class="dg-view-wrapper event-delete-dialog-wrapper">
    <div v-if="isRecurring">
      <p class="instruction">Vælg hvilke gentagelser, der skal slettes.</p>
      <multiselect
        v-model="deleteFor"
        :options="deleteForOptions"
        label="text"
        track-by="text"
        selectLabel=""
        selectedLabel=""
        deselectLabel=""
        :searchable="false"
        :allow-empty="false"
      />
    </div>
    <p v-else class="instruction">Er du sikker?</p>
    <div class="dg-content-footer">
      <button @click="cancel" class="dg-btn dg-btn--cancel">Fortryd</button>
      <button @click="handleProceed" class="dg-btn dg-btn--ok">
        {{ loading ? 'Vent venligst...' : 'Slet' }}
      </button>
    </div>
  </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import Multiselect from 'vue-multiselect';
import { affectRecurrenceOptions } from '@/api/constants';
import store from '@/store/store';

export default {
  name: 'CalendarEventDeleteDialog',

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
    const { type } = store.state.calendar.currentEvent.recurrence;

    return {
      isRecurring: type !== 'none',
      deleteFor: affectRecurrenceOptions[0],
      deleteForOptions: affectRecurrenceOptions,
    };
  },

  methods: {
    handleProceed() {
      this.proceed(this.deleteFor);
    },
  },
};
</script>

<style lang="scss" scoped>
.instruction {
  margin-bottom: 0.5rem;
}
</style>

<style lang="scss">
.event-delete-dialog-wrapper .multiselect__element > .multiselect__option {
  white-space: normal;
}
</style>
