import React from 'react';

import './ClassifyWidget.scss';

const ClassifyWidget = props => {

  return (
    <div className="r6o-widget mrm-classify-widget">
      <button> 
        Entity
      </button>
      
      <button>
        Label
      </button>
      
      <button>
        Symbol
      </button>
    </div>
  )

}

export default ClassifyWidget;