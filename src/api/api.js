import {
  makeUrl,
  makeAuthHeader,
  addPathNames,
  renameKeys,
} from '@/api/utils';
import { alwaysHeaders } from '@/api/constants';
import { UnauthorizedError, ServerError, ResourceNotFoundError } from '@/api/errors';

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

  const renamedPermissions = renameKeys(post.permissions, {
    canAddComments: 'can_add_comments',
    canDelete: 'can_delete',
    canUpdate: 'can_update',
  });

  const renamedPost = renameKeys({
    ...post,
    user: renamedUser,
    permissions: renamedPermissions,
  }, {
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
  const { posts, links } = json.data;

  return {
    posts: posts.map(jsifyPostResponse),
    hasMorePosts: links.next_page !== null,
  };
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
  const { posts, links } = json.data;

  return {
    posts: posts.map(jsifyPostResponse),
    hasMorePosts: links.next_page !== null,
  };
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

  // 422: Invalid uuid format
  // 404: Could not find post
  if (res.status === 422 || res.status === 404) {
    throw new ResourceNotFoundError(`Could not find post with id ${postId}`);
  }

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

  const allComments = [];
  const itemsPerPage = 100;
  let curPage = 1;
  let hasMoreComments = true;

  /* eslint-disable no-await-in-loop */
  while (hasMoreComments) {
    const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/comment`, {
      page: curPage,
      items: itemsPerPage,
    });

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
    const { comments, links } = json.data;

    allComments.push(...comments);

    curPage += 1;
    hasMoreComments = links.next_page !== null;
  }
  /* eslint-enable no-await-in-loop */

  function recursivelyFixData(cmts) {
    return cmts.map((comment) => {
      const renamedUser = renameKeys(comment.user, {
        avatarUrl: 'avatar_url',
        createdAt: 'created_at',
      });

      renamedUser.createdAt = new Date(renamedUser.createdAt);

      const renamedPermissions = renameKeys(comment.permissions, {
        canDelete: 'can_delete',
        canUpdate: 'can_update',
        canAddComments: 'can_add_comments',
      });

      const renamedComment = renameKeys({
        ...comment,
        user: renamedUser,
        permissions: renamedPermissions,
      }, {
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

  return recursivelyFixData(allComments);
}

export async function createPost(token, forumId, post) {
  const encodedForumId = encodeURIComponent(forumId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when creating a post in the forum ${forumId}`);
  }

  const json = await res.json();

  return jsifyPostResponse(json.post);
}

export async function createComment(token, forumId, postId, comment) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/comment`);

  const body = {
    body: comment.body,
  };

  if (comment.parentId !== null) {
    body.parent_id = comment.parentId;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when creating a comment on the post with id ${postId} and parent id ${comment.parentId}`);
  }
}

export async function deleteComment(token, forumId, postId, commentId) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const encodedCommentId = encodeURIComponent(commentId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/comment/${encodedCommentId}`);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when deleting comment with id ${commentId}`);
  }
}
