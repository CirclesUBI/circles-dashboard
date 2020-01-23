import fetch from 'isomorphic-fetch';

export default async function isServiceReachable(endpoint) {
  try {
    const response = await fetch(endpoint);
    return response.ok;
  } catch {
    return false;
  }
}
