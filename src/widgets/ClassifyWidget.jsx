import React from 'react';
import { BiHomeAlt, BiMessageSquareDetail, BiTargetLock } from 'react-icons/bi';

import './ClassifyWidget.scss';

export const ClassifyFormatter = annotation => {
  const classes = annotation ?  
    annotation.bodies.filter(b => b.purpose === 'classifying') : [];

  return classes.length === 1 ? classes[0].value : 'multi-class';
}

const ClassifyWidget = props => {

  const currentClasses = props.annotation ? 
    new Set(props.annotation.bodies.filter(b => b.purpose === 'classifying').map(b => b.value)) : new Set();

  const onClick = classToToggle => () => {

    if (currentClasses.has(classToToggle)) {
      const toRemove = props.annotation.bodies.find(b => 
        b.purpose === 'classifying' && b.value === classToToggle);

      props.onRemoveBody(toRemove);
    } else {
      props.onAppendBody({ 
        type: 'TextualBody',
        value: classToToggle, 
        purpose: 'classifying' 
      });
    }
  }

  return (
    <div className="r6o-widget mrm-classify-widget r6o-nodrag">
      <button
        className={currentClasses.has('ENTITY') ? 'entity selected' : 'entity'}
        onClick={onClick('ENTITY')}> 
        <BiHomeAlt /> <span>Entity</span>
      </button>
      
      <button 
        className={currentClasses.has('LABEL') ? 'label selected' : 'label'}
        onClick={onClick('LABEL')}>
        <BiMessageSquareDetail /> <span>Label</span>
      </button>
      
      <button 
        className={currentClasses.has('SYMBOL') ? 'symbol selected' : 'symbol'}
        onClick={onClick('SYMBOL')}>
        <BiTargetLock /> <span>Symbol</span>
      </button>
    </div>
  )

}

export default ClassifyWidget;