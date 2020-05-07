// This is a temporary testing URL
const baseUrl = 'http://forum.studiogoose.dk';

export const alwaysHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

export function makeUrl(route) {
  return `${baseUrl}${route}`;
}
