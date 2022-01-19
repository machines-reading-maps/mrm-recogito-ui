const EntityAPIConnector = query => {
  // Abort after 5 seconds
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  const url = `https://mrm-entities.no5.at/entities?input=${query}`;
  const opts = { signal: controller.signal };

  return fetch(url, opts)
    .then(response => response.json())
    .then(data => {
      return data.candidates.map(obj => ({ label: obj.entity, uri: obj.uri }));
    })
    .catch(error => {
      return [];
    });
}

export default EntityAPIConnector;