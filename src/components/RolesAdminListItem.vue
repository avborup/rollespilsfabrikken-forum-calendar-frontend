<template>
  <li class="role-li-wrapper">
    <button class="role-btn" :style="{ color: role.color }" @click="toggleCollapsible">
      <span class="fas fa-circle color-circle"></span>
      {{ role.title }}
      <span v-if="getChangedPerms().length > 0">
        ({{ getChangedPerms().length }} ugemte ændringer)
      </span>
    </button>
    <div v-if="collapsibleIsOpen" class="collapsible-main">
      <button
        class="category-btn"
        @click="toggleCollapsible('forum')"
        :class="{ active: forumCollapsibleIsOpen }"
      >
        <span class="fas fa-caret-right open-indicator"></span>
        Forum
      </button>
      <div v-if="forumCollapsibleIsOpen" class="collapsible-forum">
        <ul>
          <PermissionsList
            v-for="forum in groupedPermissionsWithBool.forum"
            :key="forum.parent.id"
            :perms="forum"
            :role="role"
            @update-perm="updatePerm"
          />
        </ul>
      </div>
      <button
        class="category-btn"
        @click="toggleCollapsible('calendar')"
        :class="{ active: calendarCollapsibleIsOpen }"
      >
        <span class="fas fa-caret-right open-indicator"></span>
        Kalender
      </button>
      <div v-if="calendarCollapsibleIsOpen" class="collapsible-calendar">
        <ul>
          <PermissionsList
            v-for="calendar in groupedPermissionsWithBool.calendar"
            :key="calendar.parent.id"
            :perms="calendar"
            :role="role"
            @update-perm="updatePerm"
          />
        </ul>
      </div>
      <div class="main-buttons">
        <button class="delete-btn" @click="deleteRole">Slet rolle</button>
        <button class="btn" @click="saveChanges">Gem ændringer for denne rolle</button>
        <button class="btn" @click="editRole">Redigér rolle</button>
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex';
import PermissionsList from '@/components/PermissionsList.vue';

export default {
  name: 'RolesAdminListItem',

  components: {
    PermissionsList,
  },

  props: {
    role: {
      required: true,
      type: Object,
    },
  },

  data() {
    const { groupedPermissions } = this.$store.getters;

    const addRoleHasPerm = perms => perms.map((perm) => {
      const rolePerms = this.role.rolePermissions;
      const roleHasPerm = rolePerms.find(rp => rp.id === perm.id) !== undefined;

      return {
        ...perm,
        roleHasPerm,
      };
    });

    const groupedPermissionsWithBool = Object.keys(groupedPermissions).reduce((acc, key) => {
      const withBool = groupedPermissions[key]
        .map(({ parent, permissions }) => ({ parent, permissions: addRoleHasPerm(permissions) }));

      return { ...acc, [key]: withBool };
    }, {});

    const flattened = Object.keys(groupedPermissionsWithBool)
      .flatMap(key => groupedPermissionsWithBool[key].flatMap(list => list.permissions));

    return {
      collapsibleIsOpen: false,
      calendarCollapsibleIsOpen: false,
      forumCollapsibleIsOpen: false,
      hasBeenEdited: true,
      groupedPermissionsWithBool,
      // We can deep clone this safely with JSON because it only contains booleans,
      // strings, arrays, and numbers.
      original: JSON.parse(JSON.stringify(flattened)),
    };
  },

  computed: {
    ...mapGetters([
      'groupedPermissions',
    ]),
  },

  methods: {
    toggleCollapsible(which) {
      switch (which) {
        case 'forum':
          this.forumCollapsibleIsOpen = !this.forumCollapsibleIsOpen;
          break;

        case 'calendar':
          this.calendarCollapsibleIsOpen = !this.calendarCollapsibleIsOpen;
          break;

        default:
          this.collapsibleIsOpen = !this.collapsibleIsOpen;
          break;
      }
    },

    deleteRole() {
      this.$dialog.confirm(`Er du sikker på, at du vil slette rollen "${this.role.title}"?`, {
        loader: true,
      })
        .then(async (dialog) => {
          try {
            await this.$store.dispatch('deleteRole', this.role.id);
            dialog.close();
            this.$emit('reload');
          } catch (err) {
            dialog.close();
            this.$dialog.alert('Vi beklager, men der opstod en fejl.');
          }
        }).catch(() => {});
    },

    updatePerm({ id, toggleValue }) {
      const tree = this.groupedPermissionsWithBool;

      Object.keys(tree).forEach((key) => {
        tree[key].forEach((forumOrCalendar) => {
          const result = forumOrCalendar.permissions.find(perm => perm.id === id);

          if (result !== undefined) {
            result.roleHasPerm = toggleValue;
          }
        });
      });
    },

    getChangedPerms() {
      const flattened = Object.keys(this.groupedPermissionsWithBool)
        .flatMap(key => this.groupedPermissionsWithBool[key].flatMap(list => list.permissions));

      const changed = flattened.filter((perm) => {
        const orig = this.original.find(origPerm => perm.id === origPerm.id);

        return perm.roleHasPerm !== orig.roleHasPerm;
      });

      return changed;
    },

    async saveChanges() {
      const changed = this.getChangedPerms();

      const { removedPerms, addedPerms } = changed.reduce((acc, perm) => {
        if (perm.roleHasPerm) acc.addedPerms.push(perm);
        else acc.removedPerms.push(perm);

        return acc;
      }, {
        removedPerms: [],
        addedPerms: [],
      });

      const promises = [];

      if (removedPerms.length > 0) {
        const promise = this.$store.dispatch('removePermissionsFromRole', {
          roleId: this.role.id,
          permissionIds: removedPerms.map(perm => perm.id),
        });
        promises.push(promise);
      }

      if (addedPerms.length > 0) {
        const promise = this.$store.dispatch('addPermissionsToRole', {
          roleId: this.role.id,
          permissionIds: addedPerms.map(perm => perm.id),
        });
        promises.push(promise);
      }

      try {
        await Promise.all(promises);

        const flattened = Object.keys(this.groupedPermissionsWithBool)
          .flatMap(key => this.groupedPermissionsWithBool[key].flatMap(list => list.permissions));

        this.original = JSON.parse(JSON.stringify(flattened));
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl.');
      }
    },

    editRole() {
      this.$store.dispatch('setEditRoleDetails', {
        colour: this.role.color,
        name: this.role.title,
      });

      this.$dialog.confirm(null, {
        view: 'role-editor-dialog',
        loader: true,
      })
        .then(async (dialog) => {
          const { colour, roleName } = dialog.data;

          try {
            await this.$store.dispatch('editRole', {
              roleId: this.role.id,
              colour: colour.hex,
              roleName,
            });
            dialog.close();
            this.$dialog.alert('Rollen blev redigeret. Genindlæs siden for at se ændringerne. Hvis du har ugemte ændringer, kan du gemme dem først.');
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

.role-li-wrapper {
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.category-btn, .role-btn {
  font-family: $fonts;
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
}

.role-btn {
  font-size: 1.1rem;
  padding: 0.6rem 0.5rem;

  .color-circle {
    font-size: 0.9rem;
  }
}

.category-btn {
  font-size: 1rem;
  color: $primary-text;
  padding: 0.25rem;

  .open-indicator {
    color: rgba(0, 0, 0, 0.3);
    font-size: 0.9rem;
  }

  &.active .open-indicator {
    transform: rotate(90deg);
  }
}

.main-buttons {
  margin-top: 0.6rem;
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

.collapsible-calendar, .collapsible-forum {
  margin-left: 1rem;

  ul {
    list-style-type: none;
  }
}

.collapsible-main {
  padding: 0 0.5rem 0.6rem 0.5rem;
}
</style>
