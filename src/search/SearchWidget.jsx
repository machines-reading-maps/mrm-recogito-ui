import React, { useEffect, useRef, useState } from 'react';

import './SearchWidget.scss';

const SearchResult = props => {

  const { annotation, matches, onSelect } = props;
  
  const snippets = matches.map(match => match.value);

  return (
    <li onClick={() => onSelect(annotation)}>
      {snippets.join(' ... ')}
    </li>
  )

}

export const SearchWidget = props => {

  const { index, open } = props;

  const el = useRef();

  const [query, setQuery] = useState('');

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (open)
      el.current.querySelector('input').focus({ preventScroll: true });
  }, [open]);

  const onChange = evt => {
    const { value } = evt.target;
    setQuery(value);

    if (value.length > 3)
      setResults(index.search(value));
  }

  return (
    <div 
      ref={el}
      className={open ? 'mrm-search-widget-wrapper open' : 'mrm-search-widget-wrapper'}>

      <input value={query} onChange={onChange} />

      {results.length > 0 && (
        <ul>
          {results.map(result => (
            <SearchResult 
              key={result.item.annotation.id}
              annotation={result.item.annotation} 
              matches={result.matches} 
              onSelect={props.onSelectResult} />
          ))}
        </ul>
      )}
    </div>
  )

}