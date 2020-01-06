<template>
  <div>
    <button class="open-button" @click="openSidebar" title="Åben sidebjælke">
      <img src="assets/icons/sidebar.svg">
    </button>
    <transition name="open-sidebar-fade">
      <div v-if="isOpen" class="darkened-bg" @click="closeSidebar"></div>
    </transition>
    <transition name="open-sidebar-slide">
      <div v-if="isOpen" class="content">
        <div class="align-left">
          <button class="close-button" @click="closeSidebar" title="Luk sidebjælke">
            <span>&times;</span>
          </button>
        </div>
        <ul class="choose-category">
          <li v-for="category in categories" :key="category">
            <input type="checkbox" checked :value="category" :id="'checkbox-' + category">
            <label class="category-option" :for="'checkbox-' + category" tabindex="0">
              <div class="checkbox" :style="{ backgroundColor: getCategoryColour(category) }">
                <img src="assets/icons/checkmark.svg" alt="Flueben">
              </div>
              <span class="option-text">{{ category }}</span>
            </label>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PageSidebar',

  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    openSidebar() {
      this.isOpen = true;
    },

    closeSidebar() {
      this.isOpen = false;
    },
  },

  computed: {
    ...mapGetters({
      categories: 'getAllCategories',
      getCategoryColour: 'getCategoryColour',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.open-button, .close-button {
  border: none;
  background: none;
  cursor: pointer;
}

.open-button {
  padding: 0.1rem;
  width: 1.5rem;
  height: 1.5rem;

  img {
    width: 100%;
    height: 100%;
  }
}

.content, .darkened-bg {
  position: absolute;
  z-index: 100;
  height: 100vh;
  top: 0;
  left: 0;
}

.darkened-bg {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
}

.content {
  background-color: #fff;
  color: $primary-text;
  width: 15rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 400;

  .close-button {
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

  .choose-category {
    list-style-type: none;

    li:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    li {
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
          user-select: none;
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

.open-sidebar-slide-leave-active,
.open-sidebar-slide-enter-active,
.open-sidebar-fade-leave-active,
.open-sidebar-fade-enter-active {
  transition: 0.5s;
}
.open-sidebar-slide-enter, .open-sidebar-slide-leave-to {
  transform: translate(-100%, 0);
}
.open-sidebar-fade-enter, .open-sidebar-fade-leave-to {
  opacity: 0;
}
</style>
