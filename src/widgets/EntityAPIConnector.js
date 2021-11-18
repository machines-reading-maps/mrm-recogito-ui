const EntityAPIConnector = query =>
  fetch(`https://mrm-entities.no5.at/entities?input=${query}`)
    .then(response => response.json())
    .then(data =>
      data.candidates.map(obj => ({ label: obj.entity, uri: obj.uri })));

export default EntityAPIConnector;