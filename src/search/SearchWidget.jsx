import React, { useState } from 'react';

import './SearchWidget.scss';

export const SearchWidget = props => {

  const { index } = props;

  const [query, setQuery] = useState('');

  const [results, setResults] = useState([]);

  const onChange = evt => {
    const { value } = evt.target;
    setQuery(value);

    if (value.length > 3) {
      const results = index.search(value);
      console.log(results);
    }
  }

  return (
    <div className="mrm-search-widget-wrapper">
      <input value={query} onChange={onChange} />

      {results.length > 0 && (
        <ul>
          {results.map(result => (
            <li>Result</li>
          ))}
        </ul>
      )}
    </div>
  )

}