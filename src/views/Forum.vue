<template>
  <div class="forum-content-wrapper">
    <div class="forum">
      <h1>Opslag</h1>
      <PostsList />
    </div>
  </div>
</template>

<script>
import PostsList from '@/components/PostsList.vue';

export default {
  name: 'Forum',
  components: {
    PostsList,
  },

  beforeMount() {
    const { forum } = this.$route.params;
    this.$store.dispatch('forum/updateCurrentForumView', forum);
  },

  watch: {
    $route(to) {
      const newForumView = to.params.forum;
      this.$store.dispatch('forum/updateCurrentForumView', newForumView);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.forum-content-wrapper {
  overflow: auto;
}

.forum {
  padding: 2rem 1rem;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

@media (min-width: 900px) {
  .forum {
    max-width: 900px;
  }
}

@media (min-width: 1000px) {
  .forum {
    margin-left: 2rem;
  }
}
</style>
