<template>
  <div>
    <div class="role-admin-wrapper">
      <h1>Administrér roller</h1>
      <div class="top-controls">
        <button @click="createNewRole" class="new-role-btn">
          <span class="fas fa-plus-square"></span>
          Opret ny rolle
        </button>
      </div>
      <ul v-if="!isLoading && allRoles !== null">
        <RolesAdminListItem
          v-for="role in allRoles"
          :key="role.id"
          :role="role"
          @reload="fetchAllRolesAndPermissions"
        />
      </ul>
      <div class="loading" v-else>
        <LoadingSpinner />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RolesAdminListItem from '@/components/RolesAdminListItem.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'RolesAdministrator',

  components: {
    RolesAdminListItem,
    LoadingSpinner,
  },

  data() {
    return {
      isLoading: true,
    };
  },

  computed: {
    ...mapState([
      'allRoles',
    ]),
  },

  methods: {
    async fetchAllRolesAndPermissions() {
      this.isLoading = true;
      try {
        await Promise.all([
          this.$store.dispatch('fetchAllRoles'),
          this.$store.dispatch('fetchAllPermissions'),
        ]);
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }
      this.isLoading = false;
    },

    createNewRole() {
      this.$dialog.confirm(null, {
        view: 'role-editor-dialog',
        loader: true,
      })
        .then(async (dialog) => {
          const { colour, roleName } = dialog.data;

          try {
            await this.$store.dispatch('createRole', { colour: colour.hex, roleName });
            dialog.close();
            this.$dialog.alert('Rollen blev oprettet. Genindlæs siden for at se den på listen. Hvis du har ugemte ændringer, kan du gemme dem først.');
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        })
        .catch(() => {});
    },
  },

  async mounted() {
    this.fetchAllRolesAndPermissions();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.role-admin-wrapper {
  padding: 2rem 1rem;

  .top-controls {
    margin-top: 1rem;

    .new-role-btn {
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

@media (min-width: 700px) {
  .role-admin-wrapper {
    max-width: 700px;
  }
}

@media (min-width: 1000px) {
  .role-admin-wrapper {
    margin-left: 2rem;
  }
}
</style>
