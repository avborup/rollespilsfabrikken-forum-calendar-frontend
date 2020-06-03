<template>
  <div>
    <div class="user-admin-wrapper">
      <h1>Administrér brugere</h1>
      <p v-if="!isLoading" class="num-users">
        Viser {{ shownUsers === null ? 0 : shownUsers.length }} brugere
      </p>
      <ul v-if="!isLoading">
        <UserAdminListItem
          v-for="user in shownUsers"
          :key="user.id"
          :user="user"
          @reload="fetchAllUsers"
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
import UserAdminListItem from '@/components/UserAdminListItem.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'UserAdministrationView',

  components: {
    UserAdminListItem,
    LoadingSpinner,
  },

  data() {
    return {
      isLoading: true,
      // This field was added to support search, but search functionality will not
      // be added until a later time.
      shownUsers: null,
      scrollBefore: 0,
    };
  },

  computed: {
    ...mapState([
      'allUsers',
      'allRoles',
    ]),
  },

  methods: {
    async fetchAllUsers() {
      this.scrollBefore = this.$el.scrollTop;
      this.isLoading = true;
      try {
        await this.$store.dispatch('fetchAllUsers');
      } catch (err) {
        console.log(err);
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }
      this.isLoading = false;
    },
  },

  async mounted() {
    if (this.allRoles === null) {
      this.$store.dispatch('fetchAllRoles');
    }

    await this.fetchAllUsers();
    this.shownUsers = this.allUsers;
  },

  // NOTE: This will set the scrollTop to what it was at the previous user fetch.
  // It does that every time the component is updated in the DOM, which might
  // cause unwanted scrolls at certain events. I don't know if it will, but this
  // comment just makes aware that it might.
  updated() {
    this.$el.scrollTop = this.scrollBefore;
  },

  watch: {
    allUsers(newUsersList) {
      // In the future, the newUsersList will be sent to a filterUsers sort of function
      // that will filter off non-searched results.
      this.shownUsers = newUsersList;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.user-admin-wrapper {
  padding: 2rem 1rem;

  .num-users {
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.75);
  }

  ul {
    margin-top: 2rem;
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
  .user-admin-wrapper {
    max-width: 700px;
  }
}

@media (min-width: 1000px) {
  .user-admin-wrapper {
    margin-left: 2rem;
  }
}
</style>
