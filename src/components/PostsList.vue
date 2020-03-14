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
    ...mapGetters({
      posts: 'getCurrentForumPosts',
      getForumFromId: 'getForumFromId',
    }),
  },
};
</script>

<style lang="scss" scoped>
.posts {
  list-style-type: none;
}
</style>
