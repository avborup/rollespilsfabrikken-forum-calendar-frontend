<template>
  <li>
    <button @click="toggleCollapsible" :class="{ active: collapsibleIsOpen }" class="category-btn">
      <span class="fas fa-caret-right open-indicator"></span>
      {{ perms.parent.name }}
    </button>
    <div v-if="collapsibleIsOpen" class="perms-list-collapsible">
      <ul>
        <li v-for="perm in perms.permissions" :key="perm.id">
          <p>{{ perm.title }}</p>
          <label class="switch" :title="perm.title">
            <input
              type="checkbox"
              :checked="perm.roleHasPerm"
              @input="updatePerms(perm.id, $event.target.checked)"
            >
            <span class="slider"></span>
          </label>
        </li>
      </ul>
    </div>
  </li>
</template>

<script>
export default {
  name: 'PermissionsList',

  props: {
    perms: {
      required: true,
      type: Object,
    },
    role: {
      required: true,
      type: Object,
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

    updatePerms(id, toggleValue) {
      this.$emit('update-perm', { id, toggleValue });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.category-btn {
  font-family: $fonts;
  font-size: 1rem;
  color: $primary-text;
  padding: 0.25rem;
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

  .open-indicator {
    color: rgba(0, 0, 0, 0.3);
    font-size: 0.9rem;
  }

  &.active .open-indicator {
    transform: rotate(90deg);
  }
}

.perms-list-collapsible {
  margin-left: 1.1rem;

  ul {
    list-style-type: none;
    padding-top: 0.75rem;

    li {
      margin-bottom: 0.75rem;
      display: grid;
      column-gap: 0.25rem;
      grid-template-columns: 1fr 1.9rem;
      width: 100%;

      .switch {
        position: relative;
        align-self: flex-start;
        margin-top: 0.15rem;
        width: 1.9rem;
        height: 1.2rem;

        input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          border-radius: 5rem;
          display: flex;
          align-items: center;
          padding: 0 0.2rem;
          transition: background-color 0.2s ease;
        }

        .slider:before {
          border-radius: 100%;
          content: "";
          height: 0.75rem;
          width: 0.75rem;
          background-color: white;
          transition: transform 0.2s;
        }

        input:checked + .slider {
          background-color: $primary-accent;

          &.slider:before {
            transform: translateX(100%);
          }
        }
      }
    }
  }
}
</style>
