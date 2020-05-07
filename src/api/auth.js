import { makeUrl, alwaysHeaders } from '@/api/api';
import { ServerError, UnauthorizedError } from '@/api/errors';

export function makeAuthHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

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

  console.log(res);

  if (res.status === 401) {
    throw new UnauthorizedError('Invalid login credentials');
  }

  if (res.status !== 200) {
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
