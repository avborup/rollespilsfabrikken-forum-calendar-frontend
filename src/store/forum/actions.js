export default {
  updateCurrentForumView(context, newForumPathName) {
    const pathName = newForumPathName === undefined ? '' : newForumPathName;
    context.commit('SET_CURRENT_FORUM_VIEW', pathName);
  },

  updateCurrentlyFocusedPostId(context, postId) {
    context.commit('SET_CURRENTLY_FOCUSED_POST_ID', postId);
  },
};
