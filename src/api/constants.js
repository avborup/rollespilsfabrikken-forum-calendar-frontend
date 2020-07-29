export const baseUrl = process.env.NODE_ENV === 'development'
  ? 'https://forum.studiogoose.dk'
  : 'https://forum.rollespilsfabrikken.dk';

export const alwaysHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

export const recurringTypes = [
  {
    real: 'none',
    text: 'Gentag ikke',
  },
  {
    real: 'daily',
    text: 'Dagligt',
    interval: 1,
  },
  {
    real: 'weekly',
    text: 'Ugentligt',
    interval: 7,
  },
  {
    real: 'yearly',
    text: 'Årligt',
    interval: 365,
  },
  {
    real: 'biweekly',
    text: 'Hver anden uge',
    interval: 14,
  },
  {
    real: 'triweekly',
    text: 'Hver tredje uge',
    interval: 21,
  },
];

export const affectRecurrenceOptions = [
  {
    text: 'Kun denne gentagelse',
    series: false,
    applyToAll: false,
    justThisOne: true,
  },
  {
    text: 'Alle gentagelser (inkl. ændrede)',
    series: true,
    applyToAll: false,
    justThisOne: false,
  },
  {
    text: 'Denne gentagelse samt fremtidige indtil næste ændrede gentagelse',
    series: false,
    applyToAll: false,
    justThisOne: false,
  },
  {
    text: 'Siden sidste ændring og frem til næste (ekskl. ændringerne)',
    series: false,
    applyToAll: true,
    justThisOne: false,
  },
];
