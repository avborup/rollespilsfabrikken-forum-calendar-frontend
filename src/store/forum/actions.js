import * as api from '@/api/api';

export default {
  async fetchAllForums(context) {
    const { authToken } = context.rootState.auth;
    const forums = await api.fetchAllForums(authToken);

    context.commit('SET_FORUMS', forums);
  },

  async fetchPosts(context, forumPathName) {
    const { authToken } = context.rootState.auth;

    const params = {
      page: 1,
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
      const posts = await postsPromise;

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
};
