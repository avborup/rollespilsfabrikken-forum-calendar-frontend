<template>
  <ul class="posts">
    <PostsListItem
      v-for="post in posts"
      :key="post.id"
      v-bind="post"
      :forum="getForumFromId(post.forumId)"
    />
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import PostsListItem from '@/components/PostsListItem.vue';

export default {
  name: 'PostsList',
  components: {
    PostsListItem,
  },

  computed: {
    ...mapGetters('forum', {
      posts: 'getPosts',
      getForumFromId: 'getForumFromId',
      forums: 'getAllForums',
    }),
  },

  methods: {
    async fetchPosts() {
      if (this.forums.length === 0) {
        return;
      }

      const pathName = this.$router.history.current.params.forum;

      try {
        await this.$store.dispatch('forum/fetchPosts', pathName);
      } catch (err) {
        // TODO: Will be handled.
        console.log(err);
      }
    },
  },

  watch: {
    // This should only happen once (on page load).
    forums() {
      this.fetchPosts();
    },
  },

  created() {
    // If the user goes to a specific post and goes back again, this component is
    // recreated. Don't add duplicate posts when this happens.
    if (this.posts.length === 0) {
      this.fetchPosts();
    }
  },
};
</script>

<style lang="scss" scoped>
.posts {
  list-style-type: none;
}
</style>
