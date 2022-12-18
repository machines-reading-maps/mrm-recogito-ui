import React, { useState } from 'react';
import { SearchWidget } from './SearchWidget';
import { AiOutlineSearch } from 'react-icons/ai';

import './Search.scss';

export const Search = props => {

  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="mrm-annotation-search">
      <button 
        className="mrm-search-toggle"
        onClick={() => setShowSearch(!showSearch)}>
        <AiOutlineSearch />
      </button>

      <SearchWidget 
        index={props.index} 
        open={showSearch} 
        onClose={() => setShowSearch(false)}
        onSelectResult={props.onSelectResult} />
    </div>
  )

}