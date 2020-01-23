export default async function graphRequest(endpoint, query) {
  return await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query.replace(/\s\s+/g, ' '),
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      return response.data;
    });
}
