<template>
    <ul class="comment-section">
      <SingleComment
        v-for="comment in comments"
        :key="comment.id"
        v-bind="comment"
        :depth="0"
      />
    </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import SingleComment from '@/components/SingleComment.vue';

export default {
  name: 'CommentSection',
  components: {
    SingleComment,
  },

  computed: {
    ...mapGetters({
      comments: 'getCurrentPostComments',
    }),
  },
};
</script>
