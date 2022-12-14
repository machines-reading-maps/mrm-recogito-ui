import React, { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import './Colorpicker.scss';

const ColorpickerWidget = props => {

  const [showPicker, setShowPicker] = useState(false);

  const color = props.annotation?.bodies.find(b => b.purpose === 'coloring')?.value;
  
  const setColor = value => {
    props.onUpsertBody({
      type: 'TextualBody',
      value, 
      purpose: 'coloring' 
    });
  }

  return (
    <div className="r6o-widget mrm-colorpicker-widget">
      <button 
        className="mrm-colorpicker-toggle" 
        onClick={() => setShowPicker(true)} />

      {showPicker && (
        <div className="mrm-colorpicker-wrapper">
          <HexColorPicker color={color} onChange={setColor} />
          <HexColorInput color={color} onChange={setColor} />
        </div>
      )}
      </div>
  )

}

export default ColorpickerWidget;