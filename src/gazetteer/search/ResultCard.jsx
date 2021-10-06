import React from 'react';

import { parsePlaceURI } from '../Formatting';

// Shorthand
const distinct = arr => Array.from(new Set(arr));

const ResultCard = props => {

  const { record } = props;

  const uris = record.is_conflation_of.map(r => {
    const meta = parsePlaceURI(r.uri, props.gazetteers);

    return  meta.shortcode ? 
      <a 
        key={r.uri}
        className="minilink" 
        href={r.uri} 
        title={`${meta.shortcode}:${meta.id}`} 
        style={{ backgroundColor: meta.color }}
        target="_blank">{meta.shortcode.charAt(0).toUpperCase()}
      </a> :

      <a 
        key={r.uri}
        className="minilink" 
        href={r.uri}
        title={r.uri}
        target="_blank">?</a>
  });

  const distinctNames = distinct(
    record.is_conflation_of.reduce((allNames, r) => r.names ? 
      [...allNames, ...r.names.map(n => n.name)] : allNames, []));

  const descriptions = 
    record.is_conflation_of.reduce((allDescriptions, r) => r.descriptions ? 
      [...allDescriptions, ...r.descriptions.map(d => d.description)] : allDescriptions, []);

  return (
    <li onClick={props.onClick}>
      <h3>{record.title}</h3>
      <p className="names">{distinctNames.join(', ')}</p>
      <p className="uris">{uris}</p>
      { descriptions.length > 0 && 
        <p>{descriptions[0]}</p> 
      }
    </li>
  )

}

export default ResultCard;