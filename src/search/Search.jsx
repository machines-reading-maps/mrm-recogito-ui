import React, { useState } from 'react';
import { SearchWidget } from './SearchWidget';
import { AiOutlineSearch } from 'react-icons/ai';

import './Search.scss';

export const Search = props => {

  const [ showSearch, setShowSearch ] = useState(false);

  const onClick = () => {
    console.log('props', props);
    props.index.search('reply');
  }

  return (
    <div className="mrm-annotation-search">
      <button 
        className="mrm-search-toggle"
        onClick={() => setShowSearch(true)}>
        <AiOutlineSearch />
      </button>

      {showSearch && (
        <SearchWidget index={props.index} />
      )}
    </div>
  )

}