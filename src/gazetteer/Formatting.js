/** Formats a yyyyMMddToYear to YYYY [Era] **/
export const yyyyMMddToYear = str => {
  const era = (str.indexOf('-') === 0) ? ' BC' : '';
  const year = (str.indexOf('-') === 0) ?
    str.substring(1, str.indexOf('-', 1)) :
    str.substring(0, str.indexOf('-'));

  return parseInt(year) + era;
}

export const parsePlaceURI = (uri, gazetteers) => {
  
  const uriToId = (uri, pattern) => {
    const tokenPos = pattern.indexOf('\{\{id\}\}');

    if (tokenPos === -1) {
      // Suffix pattern
      return uri.substring(pattern.length);
    } else {
      // Infix pattern
      const suffix = pattern.substring(tokenPos + 6);
      return uri.substring(tokenPos, uri.length - suffix.length);
    }
  };

  const matchesPattern = (uri, pattern) => {
    const tokenPos = pattern.indexOf('\{\{id\}\}');

    if (tokenPos === -1) {
      // Prefix pattern
      return uri.startsWith(pattern);
    } else {
      // Infix pattern
      const prefix = pattern.substring(0, tokenPos);
      return uri.startsWith(prefix) && uri.endsWith(pattern.substring(tokenPos + 6));
    }
  }

  let pattern = null;
  const gazetteer = gazetteers.find(g => {
    const matchingPattern = g.url_patterns.find(p => matchesPattern(uri, p));
    if (matchingPattern) {
      pattern = matchingPattern;
      return true;
    }
  });

  if (gazetteer) {
    return {
      uri,
      shortcode: gazetteer.shortcode,
      id: uriToId(uri, pattern),
      color: gazetteer.color,
    }
  } else {
    return { uri };
  }
}