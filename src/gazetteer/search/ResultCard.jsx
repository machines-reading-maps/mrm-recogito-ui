import React from 'react';

// Shorthand
const distinct = arr => Array.from(new Set(arr));

const ResultCard = props => {

  const { record } = props;

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
      { descriptions.length > 0 && 
        <p>{descriptions[0]}</p> 
      }
    </li>
  )

}

export default ResultCard;