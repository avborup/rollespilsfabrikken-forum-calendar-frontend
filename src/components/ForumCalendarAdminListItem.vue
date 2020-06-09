<template>
  <li class="ent-li-wrapper">
     <button class="ent-btn" :style="{ color: entity.colour }" @click="toggleCollapsible">
      <span class="fas fa-circle color-circle"></span>
      {{ entity.name }}
    </button>
    <div v-if="collapsibleIsOpen" class="collapsible-main">
      <button class="delete-btn" @click="deleteEntity">Slet</button>
      <button class="btn" @click="editEntity">Redigér</button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ForumCalendarAdminListItem',

  props: {
    // Entity is an alias for either a forum or a calendar object.
    entity: {
      required: true,
      type: Object,
    },
    entityType: {
      requried: true,
      type: String,
      validator: value => value === 'calendar' || value === 'forum',
    },
  },

  data() {
    return {
      collapsibleIsOpen: false,
    };
  },

  methods: {
    toggleCollapsible() {
      this.collapsibleIsOpen = !this.collapsibleIsOpen;
    },

    deleteEntity() {
      const ent = this.entityType === 'calendar' ? 'kalenderen' : 'forummet';

      this.$dialog.confirm(`Er du sikker på, at du vil slette ${ent} '${this.entity.name}'?`, {
        loader: true,
      })
        .then(async (dialog) => {
          try {
            await this.$store.dispatch('deleteForumOrCalendar', {
              id: this.entity.id,
              type: this.entityType,
            });
            dialog.close();
            this.$emit('reload');
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        })
        .catch(() => {});
    },

    editEntity() {
      this.$store.dispatch('setEditForumCalendarDetails', {
        colour: this.entity.colour,
        name: this.entity.name,
        description: this.entity.description,
      });

      this.$dialog.confirm(null, {
        view: 'forum-calendar-editor-dialog',
        loader: true,
      })
        .then(async (dialog) => {
          const { colour, name, desc } = dialog.data;

          try {
            await this.$store.dispatch('editForumOrCalendar', {
              id: this.entity.id,
              colour: colour.hex,
              name,
              desc,
              type: this.entityType,
            });
            dialog.close();
            this.$emit('reload');
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.ent-li-wrapper {
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.ent-btn {
  font-family: $fonts;
  font-size: 1.1rem;
  padding: 0.6rem 0.5rem;
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  width: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
  }

  .color-circle {
    font-size: 0.9rem;
  }
}

.collapsible-main {
  padding: 0.5rem 0.5rem 0.6rem 0;
  display: flex;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  column-gap: 0.5rem;

  .btn, .delete-btn {
    padding: 0.25rem 0.5rem;
    border-radius: 0.2rem;
    border: none;
    color: #fff;
    cursor: pointer;
    font-family: $fonts;
    font-size: 0.9rem;
  }

  .delete-btn {
    background-color: $err-colour;
  }

  .btn {
    background-color: $primary-accent;
  }
}
</style>
