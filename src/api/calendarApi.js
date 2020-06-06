import {
  makeUrl,
  makeAuthHeader,
  renameKeys,
} from '@/api/utils';
import { alwaysHeaders } from '@/api/constants';
import { ServerError } from '@/api/errors';

// eslint-disable-next-line
export async function fetchAllCalendars(token) {
  const numPerPage = 15;
  const calendars = [];

  let moreToFetch = true;
  let page = 1;

  /* eslint-disable no-await-in-loop */
  while (moreToFetch) {
    const url = makeUrl('/api/calendar', {
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
      throw new ServerError('Failed to fetch all calendars');
    }

    const json = await res.json();
    const { data } = json;

    calendars.push(...data.calendars);

    page += 1;
    moreToFetch = data.links.next_page !== null;
  }
  /* eslint-enable no-await-in-loop */

  return calendars.map(calendar => ({
    ...calendar,
    permissions: renameKeys(calendar.permissions, {
      canAddEvents: 'can_add_events',
      canDelete: 'can_delete',
      canUpdate: 'can_update',
    }),
  }));
}
