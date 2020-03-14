<template>
  <div class="view-container">
    <h1 class="post-title">{{ post.title }}</h1>
    <!-- TODO: Rendered markdown -->
    <div class="post-content"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ForumPostViewer',

  computed: {
    ...mapGetters({
      post: 'getCurrentlyFocusedPost',
    }),
  },

  beforeMount() {
    const { postId } = this.$route.params;
    this.$store.dispatch('updateCurrentlyFocusedPostId', postId);
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.view-container {
  margin: 0.8rem;
}

@media (min-width: 700px) {
  .view-container {
    width: 700px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
