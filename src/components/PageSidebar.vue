<template>
  <div class="content">
    <div class="align-left">
      <button class="close-sidebar-button" @click="$emit('close-sidebar')" title="Luk sidebjælke">
        <span>&times;</span>
      </button>
    </div>
    <h3 class="sidebar-section-header">Sider</h3>
    <nav class="sidebar-nav">
      <router-link :to="{ name: 'forum'}">
        <img class="icon" src="assets/icons/forum.svg" alt="Forumikon">
        <p>Forum</p>
      </router-link>
      <div class="sub-nav">
        <router-link
          v-for="forum in forums"
          :key="forum.pathName"
          :to="{ name: 'forum', params: { forum: forum.pathName } }"
          class="sub-nav-item"
        >
          <p>{{ forum.name }}</p>
        </router-link>
      </div>
      <router-link :to="{ name: 'calendar'}">
        <CalendarIcon class="icon" />
        <p>Kalender</p>
      </router-link>
    </nav>
    <h3 class="sidebar-section-header">Kalendervisning</h3>
    <ul class="choose-category">
      <li v-for="category in categories" :key="category">
        <input
          type="checkbox"
          checked
          :value="category"
          :id="'checkbox-' + category"
          v-model="checkedCategories"
        >
        <label class="category-option" :for="'checkbox-' + category" tabindex="0">
          <div class="checkbox" :style="{ backgroundColor: getCategoryColour(category) }">
            <img src="assets/icons/checkmark.svg" alt="Flueben">
          </div>
          <span class="option-text">{{ category }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CalendarIcon from '@/components/CalendarIcon.vue';

export default {
  name: 'PageSidebar',
  components: {
    CalendarIcon,
  },

  watch: {
    isAuthenticated(isAuth) {
      if (isAuth) {
        this.$store.dispatch('forum/fetchAllForums');
      }
    },
  },

  computed: {
    ...mapGetters('calendar', {
      categories: 'getAllCategories',
      getCategoryColour: 'getCategoryColour',
    }),
    ...mapGetters('forum', {
      forums: 'getAllForums',
    }),
    ...mapGetters('auth', [
      'isAuthenticated',
    ]),
    checkedCategories: {
      get() {
        return this.$store.getters['calendar/getCurrentCalendarCategories'];
      },
      set(newCategories) {
        this.$store.dispatch('calendar/updateCurrentCalendarCategories', newCategories);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

$listitem-padding: 0.5rem;

.close-sidebar-button {
  border: none;
  background: none;
  cursor: pointer;
}

// .content {
//   position: absolute;
//   z-index: 100;
//   height: 100vh;
//   top: 0;
//   left: 0;
// }

.content {
  background-color: #fff;
  color: $primary-text;
  width: 15rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 400;

  .close-sidebar-button {
    position: relative;
    margin: 0;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;

    span {
      position: absolute;
      color: rgba(0, 0, 0, 0.6);
      font-size: 2rem;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-55%);
      font-weight: 300;
    }
  }

  .align-left {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .sidebar-section-header:not(:first-of-type) {
    margin-top: 1rem;
  }

  .sidebar-section-header {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .choose-category {
    list-style-type: none;

    li:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    li {
      user-select: none;
      padding-left: $listitem-padding;

      input[type='checkbox'] {
        opacity: 0;
        position: absolute;
        left: -100vw;
        top: -100vh;
        z-index: -100;
      }

      label {
        position: relative;
        display: grid;
        grid-template-columns: 1.1rem auto;
        align-items: center;
        grid-column-gap: 0.5rem;
        cursor: pointer;
        width: fit-content;

        .checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 0.2rem;

          img {
            width: 100%;
            height: 100%;
            transition: all 0.2s;
          }
        }
      }

      input[type="checkbox"]:not(:checked) + label .checkbox img {
        opacity: 0;
        transform: scale(0);
      }

      input[type="checkbox"]:checked + label .checkbox img {
        opacity: 1;
        transform: scale(0.75);
      }
    }
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: center;
    padding: 0.2rem $listitem-padding;
    text-decoration: none;
    color: $primary-text;

    &:not(:last-child) {
      margin-bottom: 0.4rem;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      border-radius: 0.25rem;
    }

    .icon {
      width: 1.4rem;
      height: 1.4rem;
      margin-right: 0.6rem;
    }
  }

  .sub-nav {
    margin-left: 1.5rem;
    margin-top: -0.4rem;
    font-size: 0.9rem;

    &:not(:last-child) {
      margin-bottom: 0.4rem;
    }

    .sub-nav-item {
      align-items: flex-start;

      &:not(:last-child) {
        margin-bottom: 0.2rem;
      }

      &::before {
        // En-dash. Corresponds to the HTML entity &ndash;
        content: '\2013';
        margin-right: 0.2rem;
      }
    }
  }
}

@media (min-width: 1000px) {
  .close-sidebar-button {
    display: none;
  }
}
</style>
