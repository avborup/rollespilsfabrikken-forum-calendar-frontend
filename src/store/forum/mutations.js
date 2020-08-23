/* eslint-disable no-param-reassign */
import initialState from './state';

export default {
  SET_FORUMS(state, forums) {
    state.forums = forums;
  },

  APPEND_POSTS(state, posts) {
    state.posts.push(...posts);
  },

  SET_POSTS(state, posts) {
    state.posts = posts;
  },

  SET_POST(state, post) {
    state.currentPost = post;
  },

  SET_CURRENT_POST_COMMENTS(state, comments) {
    state.currentPostComments = comments;
  },

  SET_LOADING_POSTS_STATUS(state, status) {
    state.isLoadingPosts = status;
  },

  SET_LATEST_POSTS_PROMISE(state, promise) {
    state.latestPostsPromise = promise;
  },

  SET_CURRENT_FORUM_VIEW(state, newForumPathName) {
    state.currentForumViewPathName = newForumPathName;
  },

  SET_HAS_MORE_POSTS(state, hasMorePosts) {
    state.hasMorePosts = hasMorePosts;
  },

  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page;
  },

  SET_COMMENT(state, comment) {
    state.currentComment = comment;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState());
  },

  SET_MD_EDITOR_FILE_LIST(state, files) {
    state.mdEditorFileList = files;
  },
};
