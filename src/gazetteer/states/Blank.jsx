import React from 'react';

import i18n from '@recogito/annotorious-openseadragon/src/util/I18N';

import Minimap from './Minimap';

const Blank = props => {

  return (
    <div className="r6o-g8r-card blank">
      <Minimap />

      <div className="r6o-g8r-card-content-wrapper">
        <div className="r6o-g8r-card-content">
          <h3 className="label">{i18n.t('No automatic match')}</h3>

          {!props.readOnly &&
            <div className="buttons">
              <button 
                className="btn tiny change" 
                title="Use advanced search to find a match">{i18n.t('Search')}</button>
            
              <button 
                className="btn tiny flag icon" 
                title="Flag this place as unidentified">&#xf11d;</button>

              <button
                onClick={() => props.onDelete(props.body)}
                className="btn tiny delete icon"
                title="Not a place - remove">&#xf014;</button>
            </div>
          }
        </div>
      </div>
    </div>
  )

}

export default Blank;