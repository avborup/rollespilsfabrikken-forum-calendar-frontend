import {
  makeUrl,
  makeAuthHeader,
  addPathNames,
  renameKeys,
} from '@/api/utils';
import { alwaysHeaders } from '@/api/constants';
import { UnauthorizedError, ServerError } from '@/api/errors';

export async function fetchAllForums(token) {
  const numForumsPerPage = 15;
  const forums = [];

  let moreForumsToFetch = true;
  let page = 1;

  /* eslint-disable no-await-in-loop */
  while (moreForumsToFetch) {
    const url = makeUrl('/api/forum', {
      items: numForumsPerPage,
      page,
    });

    const res = await fetch(url, {
      headers: {
        ...alwaysHeaders,
        ...makeAuthHeader(token),
      },
    });

    if (res.status === 401) {
      throw new UnauthorizedError('Access denied for list of forums');
    }

    if (!res.ok) {
      throw new ServerError('Bad forum list request');
    }

    const json = await res.json();
    const { data } = json;

    forums.push(...data.forums);

    page += 1;
    moreForumsToFetch = data.links.next_page !== null;
  }
  /* eslint-enable no-await-in-loop */

  const withPathNames = addPathNames(forums);

  return withPathNames;
}

// Fix up the key names and data types to be more JavaScripty.
function jsifyPostResponse(post) {
  const renamedUser = renameKeys(post.user, {
    avatarUrl: 'avatar_url',
    createdAt: 'created_at',
    superuser: 'super_user',
  });

  renamedUser.createdAt = new Date(renamedUser.createdAt);

  const renamedPost = renameKeys({ ...post, user: renamedUser }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    commentCount: 'comments',
    hasFiles: 'has_files',
  });

  renamedPost.createdAt = new Date(renamedPost.createdAt);
  renamedPost.updatedAt = new Date(renamedPost.updatedAt);

  return renamedPost;
}

/**
 * Fetches a list of posts from a forum.
 * @param {String} token Access token
 * @param {String} forumId Forum to get posts from
 * @param {Object} queryOptions Options passed as URL queries (e.g. pagination info, sorting etc.)
 *
 * @returns {Array<Object>} List of posts
 */
export async function fetchPostsFromForum(token, forumId, {
  page = 1,
  numPostsPerPage = 10,
  extraQueries = {},
}) {
  const encodedId = encodeURIComponent(forumId);
  const url = makeUrl(`/api/forum/${encodedId}/post`, {
    items: numPostsPerPage,
    page,
    ...extraQueries,
  });

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`Failed to fetch posts for forum ${forumId}`);
  }

  const json = await res.json();
  const { posts } = json.data;

  return posts.map(jsifyPostResponse);
}

/**
 * Fetches a list of posts from all forums.
 * @param {String} token Access token
 * @param {Object} queryOptions Options passed as URL queries (e.g. pagination info, sorting etc.)
 *
 * @returns {Array<Object>} List of posts
 */
export async function fetchPostsFromAllForums(token, {
  page = 1,
  numPostsPerPage = 10,
  extraQueries = {},
}) {
  const url = makeUrl('/api/post', {
    items: numPostsPerPage,
    page,
    ...extraQueries,
  });

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Failed to fetch posts');
  }

  const json = await res.json();
  const { posts } = json.data;

  return posts.map(jsifyPostResponse);
}

export async function fetchPost(token, forumId, postId) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}`);

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`Failed to fetch post with id ${postId}`);
  }

  const json = await res.json();
  const { post } = json;

  return jsifyPostResponse(post);
}

export async function fetchComments(token, forumId, postId) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/comment`);

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`Failed to fetch comments for post with id ${postId}`);
  }

  const json = await res.json();
  const { comments } = json.data;

  function recursivelyFixData(cmts) {
    return cmts.map((comment) => {
      const renamedUser = renameKeys(comment.user, {
        avatarUrl: 'avatar_url',
        createdAt: 'created_at',
      });

      renamedUser.createdAt = new Date(renamedUser.createdAt);

      const renamedComment = renameKeys({ ...comment, user: renamedUser }, {
        childComments: 'child_comments',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      });

      renamedComment.createdAt = new Date(renamedComment.createdAt);
      renamedComment.updatedAt = new Date(renamedComment.updatedAt);
      renamedComment.childComments = recursivelyFixData(renamedComment.childComments);

      return renamedComment;
    });
  }

  return recursivelyFixData(comments);
}
