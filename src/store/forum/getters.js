export default {
  getAllPosts(state) {
    return state.forumPosts;
  },

  getPosts(state) {
    return state.posts;
  },

  getCurrentPost(state) {
    return state.currentPost;
  },

  getCurrentPostComments(state) {
    return state.currentPostComments;
  },

  getForumFromId: state => forumId => state.forums.find(({ id }) => id === forumId),

  getForumFromPathName: state => pn => state.forums.find(({ pathName }) => pn === pathName),

  getAllForums(state) {
    return state.forums;
  },
};
