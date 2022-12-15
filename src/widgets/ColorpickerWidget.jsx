import React, { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import './Colorpicker.scss';

const ColorpickerWidget = props => {

  const [showPicker, setShowPicker] = useState(false);

  const color = props.annotation?.bodies.find(b => b.purpose === 'coloring')?.value;

  const [initialColor, ] = useState(color);
  
  const setColor = value => {
    props.onUpsertBody({
      type: 'TextualBody',
      value, 
      purpose: 'coloring' 
    });
  }

  const onCancel = () => {
    if (initialColor)
      setColor(initialColor);
  
    setShowPicker(false);
  }

  return (
    <div className="r6o-widget mrm-colorpicker-widget">
      <button 
        className="mrm-colorpicker-toggle" 
        onClick={() => setShowPicker(true)} />

      {showPicker && (
        <div className="mrm-colorpicker-wrapper">
          <section>
            <HexColorPicker color={color} onChange={setColor} />
          </section>
          <section>
            <HexColorInput color={color} onChange={setColor} />
          </section>
          <footer>
            <button 
              className="mrm-colorpicker-cancel"
              onClick={onCancel}>Cancel</button>
            
            <button 
              disabled={!color}
              className="mrm-colorpicker-ok"
              onClick={() => setShowPicker(false)}>Ok</button>
          </footer>
        </div>
      )}
      </div>
  )

}

export default ColorpickerWidget;