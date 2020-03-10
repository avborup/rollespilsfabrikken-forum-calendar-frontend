<template>
  <div class="content">
    <div class="align-left">
      <button class="close-sidebar-button" @click="$emit('close-sidebar')" title="Luk sidebjælke">
        <span>&times;</span>
      </button>
    </div>
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

export default {
  name: 'PageSidebar',

  computed: {
    ...mapGetters({
      categories: 'getAllCategories',
      getCategoryColour: 'getCategoryColour',
    }),
    checkedCategories: {
      get() {
        return this.$store.getters.getCurrentCalendarCategories;
      },
      set(newCategories) {
        this.$store.dispatch('updateCurrentCalendarCategories', newCategories);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

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

@media (min-width: 1000px) {
  .close-sidebar-button {
    display: none;
  }
}
</style>
