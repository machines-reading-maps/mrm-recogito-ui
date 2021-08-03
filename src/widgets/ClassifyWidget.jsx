import React from 'react';
import { BiHomeAlt, BiMessageSquareDetail, BiTargetLock } from 'react-icons/bi';

import './ClassifyWidget.scss';

export const ClassifyFormatter = annotation =>
  annotation?.bodies.find(b => b.purpose === 'classifying')?.value;

const ClassifyWidget = props => {

  const current =
    props.annotation?.bodies.find(b => b.purpose === 'classifying')?.value;

  const onClick = value => () =>
    props.onUpsertBody({ 
      type: 'TextualBody',
      value, 
      purpose: 'classifying' 
    });

  return (
    <div className="r6o-widget mrm-classify-widget">
      <button
        className={current === 'ENTITY' ? 'entity selected' : 'entity'}
        onClick={onClick('ENTITY')}> 
        <BiHomeAlt /> <span>Entity</span>
      </button>
      
      <button 
        className={current === 'LABEL' ? 'label selected' : 'label'}
        onClick={onClick('LABEL')}>
        <BiMessageSquareDetail /> <span>Label</span>
      </button>
      
      <button 
        className={current === 'SYMBOL' ? 'symbol selected' : 'symbol'}
        onClick={onClick('SYMBOL')}>
        <BiTargetLock /> <span>Symbol</span>
      </button>
    </div>
  )

}

export default ClassifyWidget;