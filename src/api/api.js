import { makeUrl, makeAuthHeader, addPathNames } from '@/api/utils';
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
