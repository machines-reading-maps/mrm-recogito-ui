import React, { useEffect } from 'react';

import { addClass, removeClass } from '../group/SVG';

import './ColorCodingPanel.scss';

export const ColorCodingFormatter = annotation => {
  // Change style if there's at least one human contribution
  const hasManualContribution = !!annotation.bodies.find(b =>
    b.creator);

  // Multiple edits will mark this as "verified"
  const hasMultipleEdits = annotation.bodies.filter(b =>
    b.creator).length > 1;

  if (hasMultipleEdits) {
    return 'verified';    
  } else if (hasManualContribution) {
    return 'incomplete';
  } else {
    return 'unverified';
  }
}

const ColorCodingPanel = props => {
 
  useEffect(() => {
    // Set default color coding
    const el = document.querySelector('.a9s-annotationlayer');
    addClass(el, 'color-by-category');
  }, []);

  return (
    <div className="mrm-colorcoding-panel">

    </div>
  )

}

export default ColorCodingPanel;