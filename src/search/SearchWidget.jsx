import React, { useEffect, useRef, useState } from 'react';

import './SearchWidget.scss';

const SearchResult = props => {
  const { active, transcription, comments, tags, annotation, matches, onSelect } = props;
  
  const snippets = matches.map(match => match.value);

  return (
    <li 
      className={active ? 'active' : null}
      onClick={() => onSelect(annotation)}>
      {transcription && (
        <h3>{transcription}</h3> 
      )}
      <p className="comments">{comments.join(' ... ')}</p>
      <p className="tags">
        {tags.join(' · ')}
      </p>
    </li>
  )

}

export const SearchWidget = props => {

  const { index, open } = props;

  const el = useRef();

  const [query, setQuery] = useState('');

  const [results, setResults] = useState([]);

  const [active, setActive] = useState(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setActive(null);

      el.current.querySelector('input').focus({ preventScroll: true });
    }
  }, [open]);

  const onChange = evt => {
    const { value } = evt.target;
    setQuery(value);

    if (value.length > 3)
      setResults(index.search(value));
    else
      setResults([]);
  }

  const onKeyDown = evt => {
    const { key } = evt;
    if (key === 'ArrowDown') {
      setActive(active === null ? 0 : Math.min(active + 1, results.length - 1));
    } else if (key === 'ArrowUp' && active !== null) {
      setActive(Math.max(0, active - 1));
    } else if (key === 'Enter' && active !== null) {
      props.onSelectResult(results[active].item.annotation);
    } else if (key === 'Escape') {
      evt.stopPropagation();
      props.onClose();
    }
  }

  const onSelect = annotation => {
    const selectedResult = results.find(r => r.item.annotation.id === annotation.id);
    setActive(results.indexOf(selectedResult));
    props.onSelectResult(annotation);
  }

  return (
    <div 
      ref={el}
      onKeyDown={onKeyDown}
      className={open ? 'mrm-search-widget-wrapper open' : 'mrm-search-widget-wrapper'}>

      <input value={query} onChange={onChange} />

      {results.length > 0 && (
        <ul>
          {results.map((result, idx) => (
            <SearchResult 
              key={result.item.annotation.id}
              active={idx === active}
              transcription={result.item.transcription}
              comments={result.item.comments}
              tags={result.item.tags}
              annotation={result.item.annotation} 
              matches={result.matches} 
              onSelect={onSelect} />
          ))}
        </ul>
      )}
    </div>
  )

}