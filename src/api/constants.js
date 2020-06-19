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
  },
  {
    real: 'weekly',
    text: 'Ugentligt',
  },
  {
    real: 'yearly',
    text: 'Årligt',
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
