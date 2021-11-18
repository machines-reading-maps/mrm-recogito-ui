const EntityAPIConnector = query =>
  fetch(`http://51.105.40.135/entities?input=${query}`)
    .then(response => response.json())
    .then(data =>
      data.candidates.map(obj => ({ label: obj.entity, uri: obj.uri })));

export default EntityAPIConnector;