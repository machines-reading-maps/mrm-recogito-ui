import React, { useEffect, useState } from 'react';
import { VscColorMode } from 'react-icons/vsc';

import { addClass, getClassNames, removeClass } from '../group/SVG';

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

  const [ selected, setSelected ] = useState();
 
  useEffect(() => {
    // Set default color coding
    const el = document.querySelector('.a9s-annotationlayer');
    addClass(el, 'color-by-category');
  }, []);

  useEffect(() => {
    if (selected) {
      const el = document.querySelector('.a9s-annotationlayer');
      const classes = Array.from(getClassNames(el));

      classes.filter(c => c.startsWith('color-by')).forEach(clss =>
        removeClass(el, clss));

      addClass(el, selected);
    }
  }, [selected]);

  const onChange = evt => {
    const { value } = evt.target;
    setSelected(value);
  }

  return (
    <div className="mrm-colorcoding-panel">
      <VscColorMode />

      <select onChange={onChange} value={selected}>
        <option value="color-by-category">Color by Category</option>
        <option value="color-by-progress">Color by Editing Progress</option>
      </select>
    </div>
  )

}

export default ColorCodingPanel;