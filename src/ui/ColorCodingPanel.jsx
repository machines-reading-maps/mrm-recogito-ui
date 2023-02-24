import React, { useEffect, useState } from 'react';
import { VscColorMode } from 'react-icons/vsc';

import { addClass, getClassNames, removeClass } from '../group/SVG';

import './ColorCodingPanel.scss';

export const ByProgressFormatter = annotation => {
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

export const ByCheckOrNoCheckFormatter = annotation => {
  const hasCheckTag = !!annotation.bodies.find(b => b.purpose === 'tagging' && b.value === 'check');
  return hasCheckTag && 'needs-check';
}

export const ByGroupedFormatter = annotation => {
  const isGrouped = !!annotation.bodies.find(b => b.purpose === 'grouping');
  const isOrdered = !!annotation.bodies.find(b => b.purpose === 'ordering');

  if (isGrouped && isOrdered) {
    return 'grouped ordered';
  } else if (isGrouped) {
    return 'grouped';
  }
}

const PALETTE = [ "#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0" ];

const TAG_LOOKUP_TABLE = {};

export const ByTagFormatter = annotation => {
  const firstTag = annotation.bodies.find(b => b.purpose === 'tagging');
  if (!firstTag)
    return;

  let color = TAG_LOOKUP_TABLE[firstTag.value];
  if (!color) {
    const next = Object.keys(TAG_LOOKUP_TABLE).length % PALETTE.length;
    
    color = PALETTE[next];
    TAG_LOOKUP_TABLE[firstTag.value] = color;
  }

  return {
    style: `--stroke: ${color}; --fill: ${color}55;`
  }
}

const ColorCodingPanel = () => {

  const [ selected, setSelected ] = 
    useState(localStorage.getItem('mrm.color-scheme') || 'color-by-category');
 
  useEffect(() => {
    // Set default color coding
    const el = document.querySelector('.a9s-annotationlayer');
    addClass(el, 'color-by-category');
  }, []);

  useEffect(() => {
    const el = document.querySelector('.a9s-annotationlayer');
    const classes = Array.from(getClassNames(el));

    classes.filter(c => c.startsWith('color-by')).forEach(clss =>
      removeClass(el, clss));

    addClass(el, selected);
  }, [selected]);

  const onChange = evt => {
    const { value } = evt.target;
    localStorage.setItem('mrm.color-scheme', value);
    setSelected(value);
  }

  return (
    <div className="mrm-colorcoding-panel">
      <VscColorMode />

      <select onChange={onChange} value={selected}>
        <option value="color-by-check">Color by Checked or Unchecked</option>
        <option value="color-by-grouped">Color by Grouped or not</option>
        <option value="color-by-category">Color by Category</option>
        <option value="color-by-tag">Color by First Tag</option>
        <option value="color-by-progress">Color by Editing Progress</option>
      </select>
    </div>
  )

}

export default ColorCodingPanel;