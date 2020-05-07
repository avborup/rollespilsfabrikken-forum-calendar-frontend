import testComments from '@/assets/testComments';

export default {
  getAllPosts(state) {
    return state.forumPosts;
  },

  getCurrentForumPosts(state) {
    if (state.currentForumViewPathName === '') {
      return state.forumPosts;
    }

    const { id } = state.forums
      .find(({ pathName }) => pathName === state.currentForumViewPathName);

    return state.forumPosts.filter(({ forumId }) => forumId === id);
  },

  getForumFromId: state => forumId => state.forums.find(({ id }) => id === forumId),

  getAllForums(state) {
    return state.forums;
  },

  getCurrentlyFocusedPost(state) {
    return state.forumFullPosts.find(({ id }) => id === state.currentlyFocusedPostId);
  },

  getCurrentPostComments() {
    // Don't save the full-text comments. To be changed.
    // In the future, this will be a request.
    function recursivelyFixData(comments) {
      return comments.map(comment => ({
        ...comment,
        childComments: recursivelyFixData(comment.childComments),
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
        id: comment.id.toString(),
      }));
    }

    return recursivelyFixData(testComments);
  },
};
