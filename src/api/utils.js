import { baseUrl } from '@/api/constants';

export function makeUrl(route, params = {}) {
  const url = new URL(`${baseUrl}${route}`);

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });

  return url;
}

export function makeAuthHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
