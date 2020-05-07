/* eslint-disable no-param-reassign */

export default {
  SET_CURRENT_FORUM_VIEW(state, newForumPathName) {
    state.currentForumViewPathName = newForumPathName;
  },

  SET_CURRENTLY_FOCUSED_POST_ID(state, newPostId) {
    state.currentlyFocusedPostId = newPostId;
  },
};
