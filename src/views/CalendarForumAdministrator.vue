<template>
  <div>
    <div class="cf-admin-wrapper">
      <h1>Administrér kalendre og fora</h1>
      <div class="top-controls">
        <button class="new-btn" @click="createNewEntity('calendar')">
          <span class="fas fa-plus-square"></span>
          Opret ny kalender
        </button>
        <button class="new-btn" @click="createNewEntity('forum')">
          <span class="fas fa-plus-square"></span>
          Opret nyt forum
        </button>
      </div>
      <div v-if="!isLoading">
        <h2>Kalendre</h2>
        <ul>
          <ForumCalendarAdminListItem
            v-for="calendar in calendars"
            :key="calendar.id"
            :entity="calendar"
            entityType="calendar"
            @reload="fetchForumsAndCalendars"
          />
        </ul>
        <h2>Fora</h2>
        <ul>
          <ForumCalendarAdminListItem
            v-for="forum in forums"
            :key="forum.id"
            :entity="forum"
            entityType="forum"
            @reload="fetchForumsAndCalendars"
          />
        </ul>
      </div>
      <div class="loading" v-else>
        <LoadingSpinner />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ForumCalendarAdminListItem from '@/components/ForumCalendarAdminListItem.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'CalendarForumAdministrator',

  components: {
    ForumCalendarAdminListItem,
    LoadingSpinner,
  },

  data() {
    return {
      isLoading: false,
    };
  },

  computed: {
    ...mapState('forum', [
      'forums',
    ]),
    ...mapState('calendar', {
      calendars: 'allCalendars',
    }),
  },

  methods: {
    async fetchForumsAndCalendars() {
      this.isLoading = true;

      try {
        await Promise.all([
          this.$store.dispatch('calendar/fetchAllCalendars'),
          this.$store.dispatch('forum/fetchAllForums'),
        ]);
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }

      this.isLoading = false;
    },

    async createNewEntity(type) {
      this.$dialog.confirm(null, {
        view: 'forum-calendar-editor-dialog',
        loader: true,
      })
        .then(async (dialog) => {
          const { colour, name, desc } = dialog.data;

          try {
            await this.$store.dispatch('createForumOrCalendar', {
              colour: colour.hex,
              name,
              desc,
              type,
            });
            dialog.close();
            this.fetchForumsAndCalendars();
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        })
        .catch(() => {});
    },
  },

  mounted() {
    this.fetchForumsAndCalendars();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.cf-admin-wrapper {
  .top-controls {
    margin-top: 1rem;
    display: flex;
    column-gap: 1rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;

    .new-btn {
      font-family: $fonts;
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.7);
      text-align: left;
      cursor: pointer;
      font-weight: 600;
      background: none;
      border: none;
      display: flex;
      align-items: center;
      column-gap: 0.5rem;
    }
  }

  h2 {
    font-size: 1.2rem;
    color: $primary-text;
    margin-top: 1.5rem;
  }

  ul {
    margin: 0.5rem 0;
    list-style-type: none;
  }
}

.loading {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
