import {
  makeUrl,
  makeAuthHeader,
  renameKeys,
} from '@/api/utils';
import { alwaysHeaders } from '@/api/constants';
import { ServerError, ResourceNotFoundError, OverlappingEventsError } from '@/api/errors';

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

export async function fetchAllEventsInRange(token, start, end) {
  const url = makeUrl('/api/events', {
    start: start.toISOString(),
    end: end.toISOString(),
  });

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (!res.ok) {
    throw new ServerError('Failed to fetch events');
  }

  const json = await res.json();
  const events = json.data
    .map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));

  return events;
}

export async function fetchEvent(token, calendarId, eventId, date) {
  const encodedCalendarId = encodeURIComponent(calendarId);
  const encodedEventId = encodeURIComponent(eventId);
  const url = makeUrl(`/api/calendar/${encodedCalendarId}/event/${encodedEventId}`, {
    date: date.toISOString(),
  });

  const res = await fetch(url, {
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
  });

  if (res.status === 404) {
    throw new ResourceNotFoundError('Could not find event');
  }

  if (!res.ok) {
    throw new ServerError('Failed to fetch event');
  }

  const json = await res.json();
  const event = {
    ...json.post,
    permissions: renameKeys(json.post.permissions, {
      canDelete: 'can_delete',
      canUpdate: 'can_update',
    }),
  };

  event.start = new Date(event.start);
  event.end = new Date(event.end);

  if (event.recurrence.end !== null) {
    event.recurrence.end = new Date(event.recurrence.end);
  }

  return event;
}

export async function createEvent(token, eventInfo) {
  const encodedCalendarId = encodeURIComponent(eventInfo.calendarId);
  const url = makeUrl(`/api/calendar/${encodedCalendarId}/event`);

  const body = {
    title: eventInfo.title,
    start: eventInfo.start.toISOString(),
    end: eventInfo.end.toISOString(),
    recurring: eventInfo.isRecurring,
  };

  if (eventInfo.description.length > 0) {
    body.description = eventInfo.description;
  }

  if (eventInfo.isRecurring) {
    body.recurrence = {
      type: eventInfo.recurringType,
    };

    if (eventInfo.recurringEnd !== null) {
      body.recurrence.end = eventInfo.recurringEnd.toISOString();
    }
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
    throw new ServerError(`An error occurred when creating a new event in the calendar ${eventInfo.calendarId}`);
  }

  const json = await res.json();

  return json.event;
}

export async function editEvent(token, newEventInfo) {
  const encodedCalendarId = encodeURIComponent(newEventInfo.calendarId);
  const encodedEventId = encodeURIComponent(newEventInfo.eventId);
  const url = makeUrl(`/api/calendar/${encodedCalendarId}/event/${encodedEventId}`);

  const body = {
    title: newEventInfo.title,
    start: newEventInfo.start.toISOString(),
    end: newEventInfo.end.toISOString(),
    recurring: newEventInfo.isRecurring,
    recurrence: {
      series: newEventInfo.saveSettings.series,
      apply_to_all: newEventInfo.saveSettings.applyToAll,
      only_this: newEventInfo.saveSettings.justThisOne,
    },
  };

  if (newEventInfo.description.length > 0) {
    body.description = newEventInfo.description;
  }

  if (newEventInfo.isRecurring) {
    body.recurrence.type = newEventInfo.recurringType;

    if (newEventInfo.recurringEnd !== null) {
      body.recurrence.end = newEventInfo.recurringEnd.toISOString();
    }
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
    throw new ServerError('An error occurred when editing event');
  }

  const json = await res.json();
  const newEvent = json.event;

  newEvent.start = new Date(newEvent.start);

  return newEvent;
}

export async function deleteEvent(token, settings) {
  const encodedCalendarId = encodeURIComponent(settings.calendarId);
  const encodedEventId = encodeURIComponent(settings.eventId);
  const url = makeUrl(`/api/calendar/${encodedCalendarId}/event/${encodedEventId}`);

  const body = {
    series: settings.series,
    apply_to_all: settings.applyToAll,
    only_this: settings.justThisOne,
    date: settings.date.toISOString(),
  };

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ServerError('Failed to delete event');
  }
}

export async function checkEvent(token, eventInfo) {
  const encodedCalendarId = encodeURIComponent(eventInfo.calendarId);
  const url = makeUrl(`/api/calendar/${encodedCalendarId}/event/check`);

  const body = {
    title: eventInfo.title,
    start: eventInfo.start.toISOString(),
    end: eventInfo.end.toISOString(),
    recurring: eventInfo.isRecurring,
  };

  if (eventInfo.description.length > 0) {
    body.description = eventInfo.description;
  }

  if (eventInfo.isRecurring) {
    body.recurrence = {
      type: eventInfo.recurringType,
    };

    if (eventInfo.recurringEnd !== null) {
      body.recurrence.end = eventInfo.recurringEnd.toISOString();
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...alwaysHeaders,
      ...makeAuthHeader(token),
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (res.status === 400) {
    json.warnings.forEach((warning) => {
      switch (warning.message) {
        case 'Event overlaps with another event':
          throw new OverlappingEventsError();

        default:
          break;
      }
    });
  }

  if (!res.ok) {
    throw new ServerError(`An error occurred when checking event in the calendar ${eventInfo.calendarId}`);
  }
}
