import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { VscChromeClose } from 'react-icons/vsc';
import { FaList } from 'react-icons/fa';
import i18n from '@recogito/annotorious-openseadragon/src/util/I18N';

import ResultMap from './ResultMap';

import './GazetteerSearch.scss';

import 'leaflet/dist/leaflet.css';

const GazetteerSearch = props => {
  
  const [ query, setQuery ] = useState('');

  const [ result, setResult ] = useState();

  useEffect(() => {
    setResult();

    if (query) {
      fetch(`/api/place/search?q=${query}&offset=0&size=20`)
        .then(response => response.json())
        .then(setResult);    }
  }, [ query ]);

  const onKeyUp = evt => {
    if (evt.which === 13) {
      setQuery(evt.target.value.trim())
    }
  }

  return createPortal(
    <div className="r6o-g8r-search r6o-nodrag">
      <div className="r6o-g8r-search-modal">
        <header>
          <input
            type="text" 
            placeholder={i18n.t('Search for a place...')} 
            onKeyUp={onKeyUp} />
            
          <button
            className="r6o-g8r-close"
            onClick={props.onClose}>
            <VscChromeClose />
          </button>
        </header>
        <main>
          <aside>
            <div className="r6o-g8r-search-results-totals">  
              <span className="total"> 
                <FaList /> 
                {result ? result.total : ''} Total
              </span>

              { result && 
                <span className="took">
                  Took {result.took}ms
                </span>
              }
            </div>
            <div className="r6o-g8r-search-results-list">
              <ul>
                {result && result.items.map(hit =>
                  <li key={hit.union_id}>
                    {hit.title}
                  </li>
                )}
              </ul>
            </div>
          </aside>

          <ResultMap result={result} />
        </main>
      </div>
    </div>,
    document.body
  )

}

export default GazetteerSearch;

