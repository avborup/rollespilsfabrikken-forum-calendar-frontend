import { alwaysHeaders } from '@/api/constants';
import { makeUrl, makeAuthHeader, renameKeys } from '@/api/utils';
import {
  ServerError,
  UnauthorizedError,
  EmailAlreadyTakenError,
  InvalidEmailError,
  WrongAnswerError,
  InvalidTokenError,
  ExpiredTokenError,
  ResourceNotFoundError,
} from '@/api/errors';

/**
 * Gains access to the API by retrieving an access token (provided that the user
 * credentials are correct).
 * @param {String} email    Account email
 * @param {String} password Account password
 *
 * @returns {String} Access token
 */
export async function login(email, password) {
  const url = makeUrl('/api/auth/login');
  const body = {
    email,
    password,
    // Will be removed from the API, but currently it is a mandatory inclusion.
    remember_me: 0,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: alwaysHeaders,
    body: JSON.stringify(body),
  });

  // The API returns 404 if the user doesn't exist and 401 if:
  //   - The account hasnt been activated after signup
  //   - The account is banned or deleted
  //   - The credentials are incorrect
  if (res.status === 401 || res.status === 404) {
    throw new UnauthorizedError('Invalid login credentials');
  }

  if (!res.ok) {
    throw new ServerError('Bad login request');
  }

  const data = await res.json();

  return data.access_token;
}

/**
 * Checks if a given access token is valid and thus if the user is authenticated.
 * @param {String} token Access token
 *
 * @returns {Boolean} Whether or not the access token is valid
 */
export async function tokenIsValid(token) {
  const url = makeUrl('/api/user');

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (res.status !== 200 && res.status !== 401) {
    throw new ServerError('Bad auth status request');
  }

  return res.status === 200;
}

export async function getSecurityQuestion() {
  const url = makeUrl('/api/auth/security-question');

  const res = await fetch(url, {
    headers: alwaysHeaders,
  });

  if (!res.ok) {
    throw new ServerError('Failed to get security question');
  }

  const json = await res.json();

  return json.security_question;
}

export async function signUp(form) {
  const url = makeUrl('/api/auth/signup');

  const body = renameKeys(form, {
    email_confirmation: 'emailConf',
    password_confirmation: 'passwordConf',
    security_question: 'securityQuestionId',
    answer: 'securityQuestionAnswer',
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: alwaysHeaders,
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (res.status === 422 && json.errors.email) {
    if (json.errors.email.includes('The email has already been taken.')) {
      throw new EmailAlreadyTakenError();
    }

    if (json.errors.email.includes('The email must be a valid email address.')) {
      throw new InvalidEmailError();
    }
  }

  if (res.status === 401) {
    throw new WrongAnswerError();
  }

  if (!res.ok) {
    throw new ServerError('Something went wrong during sign-up');
  }
}

export async function resendEmail(email) {
  const url = makeUrl('/api/auth/resend-email');

  await fetch(url, {
    method: 'POST',
    headers: alwaysHeaders,
    body: JSON.stringify({ email }),
  });
}

export async function getAllRoles(token) {
  const numPerPage = 25;
  let page = 1;
  let moreRolesToFetch = true;
  const roles = [];

  /* eslint-disable no-await-in-loop */
  while (moreRolesToFetch) {
    const url = makeUrl('/api/auth/role', {
      items: numPerPage,
      page,
    });

    const res = await fetch(url, {
      headers: {
        ...alwaysHeaders,
        ...makeAuthHeader(token),
      },
    });

    if (!res.ok) {
      throw new ServerError('Failed to fetch all roles');
    }

    const json = await res.json();
    const { data } = json;

    roles.push(...data.roles);

    page += 1;
    moreRolesToFetch = data.links.next_page !== null;
  }
  /* eslint-enable no-await-in-loop */

  return roles.map(role => renameKeys(role, {
    rolePermissions: 'role_permissions',
  }));
}

export async function modifyRoleOnUser(token, { userId, roleId }, action) {
  const encodedUserId = encodeURIComponent(userId);
  const encodedRoleId = encodeURIComponent(roleId);
  const url = makeUrl(`/api/auth/user/${encodedUserId}/role/${encodedRoleId}`);

  const method = action === 'delete' ? 'DELETE' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError(`Failed to perform action '${action}' on role`);
  }
}

export async function createRole(token, name, colour) {
  const url = makeUrl('/api/auth/role');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify({ title: name, color: colour }),
  });

  if (!res.ok) {
    throw new ServerError('Failed to create role');
  }
}

export async function editRole(token, roleId, name, colour) {
  const encodedRoleId = encodeURIComponent(roleId);
  const url = makeUrl(`/api/auth/role/${encodedRoleId}`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify({ title: name, color: colour }),
  });

  if (!res.ok) {
    throw new ServerError('Failed to edit role');
  }
}

export async function deleteRole(token, roleId) {
  const encodedRoleId = encodeURIComponent(roleId);
  const url = makeUrl(`/api/auth/role/${encodedRoleId}`);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Failed to delete role');
  }
}

export async function getAllPermissions(token) {
  const numPerPage = 500;
  let page = 1;
  let morePermsToFetch = true;
  const perms = [];

  /* eslint-disable no-await-in-loop */
  while (morePermsToFetch) {
    const url = makeUrl('/api/auth/permission', {
      items: numPerPage,
      page,
    });

    const res = await fetch(url, {
      headers: {
        ...alwaysHeaders,
        ...makeAuthHeader(token),
      },
    });

    if (!res.ok) {
      throw new ServerError('Failed to fetch all permissions');
    }

    const json = await res.json();
    const { data } = json;

    perms.push(...data.permissions);

    page += 1;
    morePermsToFetch = data.links.next_page !== null;
  }
  /* eslint-enable no-await-in-loop */

  return perms;
}

export async function modifyRolePermissions(token, roleId, permissionIds, action) {
  const encodedRoleId = encodeURIComponent(roleId);
  const url = makeUrl(`/api/auth/role/${encodedRoleId}/permissions`);

  const method = action === 'delete' ? 'DELETE' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify({ permissions: permissionIds }),
  });

  if (!res.ok) {
    throw new ServerError(`Failed to perform action '${action}' on role permissions`);
  }
}

export async function logout(token) {
  const url = makeUrl('/api/auth/logout');

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Logout request failed');
  }
}

export async function confirmEmail(confirmationToken) {
  const encodedConfirmationToken = encodeURIComponent(confirmationToken);
  const url = makeUrl(`/api/auth/activate/${encodedConfirmationToken}`);

  const res = await fetch(url, {
    headers: alwaysHeaders,
  });

  if (res.status === 404) {
    throw new InvalidTokenError('Confirmation token is invalid');
  }

  if (!res.ok) {
    throw new ServerError('Email confirmation failed');
  }
}

export async function sendPasswordResetMail(email) {
  const url = makeUrl('/api/auth/password/forgot');

  const res = await fetch(url, {
    method: 'POST',
    headers: alwaysHeaders,
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new ServerError('Failed to send password reset email');
  }
}

export async function getResetTokenDetails(resetToken) {
  const encodedToken = encodeURIComponent(resetToken);
  const url = makeUrl(`/api/auth/password/find/${encodedToken}`);

  const res = await fetch(url, {
    headers: alwaysHeaders,
  });

  if (res.status === 404) {
    throw new ResourceNotFoundError('Could not find reset token');
  }

  if (res.status === 498) {
    throw new ExpiredTokenError('Reset token has expired');
  }

  if (!res.ok) {
    throw new ServerError('Failed to get reset token details');
  }

  const tokenDetails = await res.json();

  return tokenDetails;
}

export async function changePassword(resetToken, email, newPassword, passwordRepeated) {
  const url = makeUrl('/api/auth/password/reset');

  const body = {
    email,
    token: resetToken,
    password: newPassword,
    password_confirmation: passwordRepeated,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: alwaysHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ServerError('Failed to change password');
  }
}
