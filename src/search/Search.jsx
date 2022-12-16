import React, { useState } from 'react';
import { SearchWidget } from './SearchWidget';

export const Search = props => {

  const [ showSearch, setShowSearch ] = useState(false);

  const onClick = () => {
    console.log('props', props);
    props.index.search('reply');
  }

  return (
    <div className="mrm-annotation-search">
      <button onClick={onClick}>SEARCH</button>

      {showSearch && (
        <SearchWidget index={props.index} />
      )}
    </div>
  )

}