import download from 'downloadjs';
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

  return withPathNames.map(forum => ({
    ...forum,
    permissions: renameKeys(forum.permissions, {
      canAddComments: 'can_add_comments',
      canAddPosts: 'can_add_posts',
      canDelete: 'can_delete',
      canUpdate: 'can_update',
    }),
  }));
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
    canPin: 'can_pin',
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

function countCommentNodes(comment) {
  return comment.childComments
    .reduce((acc, cur) => acc + countCommentNodes(cur), 1);
}

function recursivelyFixComments(cmts) {
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
      canPin: 'can_pin',
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
    renamedComment.childComments = recursivelyFixComments(renamedComment.childComments);

    renamedComment.numChildren = countCommentNodes(renamedComment) - 1;

    return renamedComment;
  });
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

  return recursivelyFixComments(allComments);
}

export async function createPost(token, forumId, post) {
  const encodedForumId = encodeURIComponent(forumId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post`);

  const formData = new FormData();

  formData.append('title', post.title);
  formData.append('body', post.body);

  post.files.forEach(file => formData.append('files[]', file));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...makeAuthHeader(token),
    },
    body: formData,
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

export async function updateComment(token, {
  forumId,
  postId,
  commentId,
  newBody,
}) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const encodedCommentId = encodeURIComponent(commentId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/comment/${encodedCommentId}`);

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify({ body: newBody }),
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when updating the comment with id ${commentId}`);
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

export async function deletePost(token, forumId, postId) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}`);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when deleting post with id ${postId}`);
  }
}

export async function updatePost(token, {
  forumId,
  postId,
  newTitle,
  newBody,
}) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}`);

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify({
      title: newTitle,
      body: newBody,
    }),
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when updating the post with id ${postId}`);
  }
}

export async function updatePostFiles(token, forumId, postId, addedOrUpdatedFiles, deletedFiles) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/file`);

  const formData = new FormData();

  addedOrUpdatedFiles.forEach(file => formData.append('files[]', file));
  deletedFiles.forEach(file => formData.append('file_deletions[]', file.id));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...makeAuthHeader(token),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when updating files for post with ID ${postId}`);
  }
}

export async function getUser(token) {
  const url = makeUrl('/api/user');

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Failed to fetch user.');
  }

  const json = await res.json();
  const user = renameKeys(json.user, {
    avatarUrl: 'avatar_url',
    createdAt: 'created_at',
    isSuperUser: 'super_user',
  });

  user.createdAt = new Date(user.createdAt);
  user.isBanned = user.banned_at !== undefined;

  return user;
}

export async function getAllUsers(token) {
  const url = makeUrl('/api/user/index');

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Failed to fetch users');
  }

  const json = await res.json();
  const users = json.users.map((user) => {
    const renamed = renameKeys(user, {
      avatarUrl: 'avatar_url',
      createdAt: 'created_at',
      isSuperUser: 'super_user',
    });

    renamed.createdAt = new Date(renamed.createdAt);
    renamed.isBanned = renamed.banned_at !== undefined;

    return renamed;
  });

  users.sort((a, b) => a.username.localeCompare(b.username));

  return users;
}

export async function deleteForumOrCalendar(token, id, type) {
  if (type !== 'calendar' && type !== 'forum') {
    throw new Error('Argument "type" must be either forum or calendar');
  }

  const encodedId = encodeURIComponent(id);
  const url = makeUrl(`/api/${type}/${encodedId}`);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when deleting ${type} with id ${id}`);
  }
}

export async function editForumOrCalendar(token, id, name, desc, colour, type) {
  if (type !== 'calendar' && type !== 'forum') {
    throw new Error('Argument "type" must be either forum or calendar');
  }

  const encodedId = encodeURIComponent(id);
  const url = makeUrl(`/api/${type}/${encodedId}`);

  const body = {
    title: name,
    colour,
  };

  // If an empty string is sent, the API returns an error. Either the description
  // has to be non-empty or not exist.
  if (desc.length > 0) {
    body.description = desc;
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ServerError(`An error occurred when editing ${type} with id ${id}`);
  }
}

export async function createForumOrCalendar(token, name, desc, colour, type) {
  if (type !== 'calendar' && type !== 'forum') {
    throw new Error('Argument "type" must be either forum or calendar');
  }

  const url = makeUrl(`/api/${type}`);

  const body = {
    title: name,
    colour,
  };

  // If an empty string is sent, the API returns an error. Either the description
  // has to be non-empty or not exist.
  if (desc.length > 0) {
    body.description = desc;
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
    throw new ServerError(`An error occurred when creating new ${type}`);
  }
}

export async function getComment(token, forumId, postId, commentId) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const encodedCommentId = encodeURIComponent(commentId);

  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/comment/${encodedCommentId}`);

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (res.status === 404) {
    throw new ResourceNotFoundError('Could not find comment');
  }

  if (!res.ok) {
    throw new ServerError('Failed to fetch comment');
  }

  const json = await res.json();
  const { comment } = json;

  return recursivelyFixComments([comment])[0];
}

export async function updateUsername(token, newUsername) {
  const url = makeUrl('/api/user/username');

  const body = {
    username: newUsername,
    username_confirmation: newUsername,
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ServerError('Failed to update username');
  }
}

export async function updateAvatar(token, newAvatar) {
  const url = makeUrl('/api/user/avatar');

  const formData = new FormData();
  formData.append('avatar', newAvatar);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...makeAuthHeader(token),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new ServerError('Failed to update avatar');
  }
}

export async function saveForumOrder(token, forumIds) {
  const url = makeUrl('/api/forums/priorities');

  const body = forumIds.map((id, index) => ({ id, priority: index + 1 }));

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ServerError('Failed to update forum order');
  }
}

export async function togglePinnedComment(token, forumId, postId, commentId) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const encodedCommentId = encodeURIComponent(commentId);

  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/comment/${encodedCommentId}/pin`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Failed to pin/unpin comment');
  }
}

export async function togglePinnedPost(token, forumId, postId) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);

  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/pin`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Failed to pin/unpin post');
  }
}

export async function downloadFile(token, forumId, postId, fileId, fileName) {
  const encodedForumId = encodeURIComponent(forumId);
  const encodedPostId = encodeURIComponent(postId);
  const encodedFileId = encodeURIComponent(fileId);

  const url = makeUrl(`/api/forum/${encodedForumId}/post/${encodedPostId}/file/${encodedFileId}`);

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`Failed to download file ${fileName} with ID ${fileId}`);
  }

  const blob = await res.blob();
  download(blob, fileName, blob.type);
}

export async function toggleSuperuser(token, userId) {
  const encodedUserId = encodeURIComponent(userId);
  const url = makeUrl(`/api/user/${encodedUserId}/op`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`Failed to toggle superuser privileges for user ${userId}`);
  }

  const json = await res.json();

  return json.user.super_user;
}

export async function toggleBan(token, userId) {
  const encodedUserId = encodeURIComponent(userId);
  const url = makeUrl(`/api/user/${encodedUserId}/ban`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`Failed to ban/unban user ${userId}`);
  }

  const json = await res.json();

  return json.user.banned_at !== undefined;
}
