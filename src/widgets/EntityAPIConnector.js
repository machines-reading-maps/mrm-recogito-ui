const LOCAL_VOCABULARY = 
  window.config.vocabulary?.length > 0 ?
    window.config.vocabulary.map(({ value, uri }) => 
      uri ? { label: value, uri } : value) 
    : [];

const EntityAPIConnector = query => {
  // Local vocabulary matches by prefix
  const localMatches = LOCAL_VOCABULARY.filter(literal => {
    const label = literal.label ? literal.label : literal;
    return label.toLowerCase().startsWith(query.toLowerCase());
  });

  // Abort after 5 seconds
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  const url = `https://mrm-entities.no5.at/entities?input=${query}`;
  const opts = { signal: controller.signal };

  return fetch(url, opts)
    .then(response => response.json())
    .then(data => {
      const apiMatches = data.candidates.map(obj => ({ label: obj.entity, uri: obj.uri }));
      return [...localMatches, ...apiMatches ];
    })
    .catch(error => {
      return localMatches;
    });
}

export default EntityAPIConnector;