import React from 'react';

import './ClassifyWidget.scss';

export const ClassifyFormatter = annotation =>
  annotation?.bodies.find(b => b.purpose === 'classifying')?.value;

const ClassifyWidget = props => {

  const current =
    props.annotation?.bodies.find(b => b.purpose === 'classifying')?.value;

  const onClick = value => () =>
    props.onUpsertBody({ value, purpose: 'classifying' });

  return (
    <div className="r6o-widget mrm-classify-widget">
      <button
        className={current === 'ENTITY' ? 'entity selected' : 'entity'}
        onClick={onClick('ENTITY')}> 
        Entity
      </button>
      
      <button 
        className={current === 'LABEL' ? 'label selected' : 'label'}
        onClick={onClick('LABEL')}>
        Label
      </button>
      
      <button 
        className={current === 'SYMBOL' ? 'symbol selected' : 'symbol'}
        onClick={onClick('SYMBOL')}>
        Symbol
      </button>
    </div>
  )

}

export default ClassifyWidget;