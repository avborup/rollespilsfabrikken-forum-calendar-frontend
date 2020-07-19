import * as api from '@/api/api';

export default {
  async fetchAllForums(context) {
    const { authToken } = context.rootState.auth;
    const forums = await api.fetchAllForums(authToken);

    forums.sort((a, b) => a.priority - b.priority);

    context.commit('SET_FORUMS', forums);
  },

  async fetchPosts(context, { forumPathName, page, numPostsPerPage = 10 }) {
    const { authToken } = context.rootState.auth;

    const params = {
      page,
      numPostsPerPage,
      extraQueries: {
        sort: 'created_at',
      },
    };
    const forum = context.getters.getForumFromPathName(forumPathName);

    const postsPromise = !forumPathName
      ? api.fetchPostsFromAllForums(authToken, params)
      : api.fetchPostsFromForum(authToken, forum.id, params);

    // This latestPostsPromise makes loading the correct forum work when clicking
    // different forums very quickly. If it is not used, wrong forums can end up
    // being showed or multiple forums are showed in the same list.
    context.commit('SET_LATEST_POSTS_PROMISE', postsPromise);

    try {
      const { posts, hasMorePosts } = await postsPromise;

      if (postsPromise === context.state.latestPostsPromise) {
        const withForumId = [];

        if (!forumPathName) {
          withForumId.push(...posts.map((post) => {
            const copy = { ...post };
            copy.forumId = copy.parent.id;
            delete copy.parent;

            return copy;
          }));
        } else {
          withForumId.push(...posts.map(post => ({ ...post, forumId: forum.id })));
        }

        context.commit('APPEND_POSTS', withForumId);
        context.commit('SET_LATEST_POSTS_PROMISE', null);
        context.commit('SET_HAS_MORE_POSTS', hasMorePosts);
      }
    } catch (err) {
      if (postsPromise === context.state.latestPostsPromise) {
        context.commit('SET_LATEST_POSTS_PROMISE', null);
      }

      throw err;
    }
  },

  clearPosts(context) {
    context.commit('SET_POSTS', []);
  },

  async fetchPost(context, { postId, forumPathName }) {
    const { authToken } = context.rootState.auth;
    const forumId = context.getters.getForumFromPathName(forumPathName).id;
    const post = await api.fetchPost(authToken, forumId, postId);

    post.forumId = forumId;

    context.commit('SET_POST', post);
  },

  async fetchComments(context, { postId, forumPathName }) {
    const { authToken } = context.rootState.auth;
    const forumId = context.getters.getForumFromPathName(forumPathName).id;

    const comments = await api.fetchComments(authToken, forumId, postId);

    context.commit('SET_CURRENT_POST_COMMENTS', comments);
  },

  setLoadingPostsStatus(context, status) {
    context.commit('SET_LOADING_POSTS_STATUS', status);
  },

  updateCurrentForumView(context, newForumPathName) {
    const pathName = newForumPathName === undefined ? '' : newForumPathName;
    context.commit('SET_CURRENT_FORUM_VIEW', pathName);
  },

  prevPage(context) {
    const newPage = context.state.currentPage - 1;
    context.commit('SET_CURRENT_PAGE', newPage);
  },

  nextPage(context) {
    const newPage = context.state.currentPage + 1;
    context.commit('SET_CURRENT_PAGE', newPage);
  },

  resetPage(context) {
    context.commit('SET_CURRENT_PAGE', 1);
  },

  async createPost(context, { forumId, post }) {
    const { authToken } = context.rootState.auth;

    const createdPost = await api.createPost(authToken, forumId, post);

    return { ...createdPost, forumId };
  },

  async createComment(context, {
    forumPathName,
    postId,
    body,
    parentId,
  }) {
    const { authToken } = context.rootState.auth;
    const forumId = context.getters.getForumFromPathName(forumPathName).id;

    await api.createComment(authToken, forumId, postId, {
      body,
      parentId,
    });
  },

  async updateComment(context, {
    forumPathName,
    postId,
    commentId,
    newBody,
  }) {
    const { authToken } = context.rootState.auth;
    const forumId = context.getters.getForumFromPathName(forumPathName).id;

    await api.updateComment(authToken, {
      forumId,
      postId,
      commentId,
      newBody,
    });
  },

  async deleteComment(context, { forumPathName, postId, commentId }) {
    const { authToken } = context.rootState.auth;
    const forumId = context.getters.getForumFromPathName(forumPathName).id;

    await api.deleteComment(authToken, forumId, postId, commentId);
  },

  async deletePost(context, { forumPathName, postId }) {
    const { authToken } = context.rootState.auth;
    const forumId = context.getters.getForumFromPathName(forumPathName).id;

    await api.deletePost(authToken, forumId, postId);
  },

  async updatePost(context, {
    forumPathName,
    postId,
    newTitle,
    newBody,
  }) {
    const { authToken } = context.rootState.auth;
    const forumId = context.getters.getForumFromPathName(forumPathName).id;

    await api.updatePost(authToken, {
      forumId,
      postId,
      newTitle,
      newBody,
    });
  },

  async fetchComment(context, { forumId, postId, commentId }) {
    const { authToken } = context.rootState.auth;
    const comment = await api.getComment(authToken, forumId, postId, commentId);

    context.commit('SET_COMMENT', comment);
  },
};
