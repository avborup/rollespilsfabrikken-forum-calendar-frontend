/* eslint import/no-webpack-loader-syntax: off */
import version from 'raw-loader!./assets/VERSION.txt';

export const VERSION = version;

export const monthNames = [
  'Januar',
  'Februar',
  'Marts',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'December',
];

export const weekDayNames = [
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lørdag',
  'Søndag',
];

export const colourCycle = [
  '#20639B',
  '#ED553B',
  '#3CAEA3',
];
