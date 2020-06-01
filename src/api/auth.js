import { alwaysHeaders } from '@/api/constants';
import { makeUrl, makeAuthHeader, renameKeys } from '@/api/utils';
import {
  ServerError,
  UnauthorizedError,
  EmailAlreadyTakenError,
  InvalidEmailError,
  WrongAnswerError,
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
    throw ServerError('Failed to get security question');
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
