import React, { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import './Colorpicker.scss';

const PRESET_COLORS = [
  '#ff0000', 
  '#0000ff', 
  '#008000',
  '#ffff00', 
  '#00ffff', 
  '#ffa500'
];

export const ColorpickerFormatter = annotation => {
  const color = annotation?.bodies.find(b => b.purpose === 'coloring')?.value;

  return color ? {
    className: 'has-custom',
    style: `--col: ${color}` 
  } : null;
}

export const ColorpickerWidget = props => {

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
  
  const clearColor = () => {
    const current = props.annotation?.bodies.find(b => b.purpose === 'coloring');
    if (current)
      props.onRemoveBody(current);
  }

  const onCancel = () => {
    if (initialColor)
      setColor(initialColor);
  
    setShowPicker(false);
  }

  return (
    <div className="r6o-widget mrm-colorpicker-widget">
      <button 
        style={color ? { '--col': color } : null}
        className="mrm-colorpicker-toggle" 
        onClick={() => setShowPicker(true)}>

        <div className="mrm-color-current"></div>
        { color ? <span>{color}</span> : <span>Set custom color</span> }
      </button>

      {color && (
        <button 
          className="mrm-color-remove"
          onClick={clearColor}>
          Clear color
        </button>
      )}

      {showPicker && (
        <div className="mrm-colorpicker-wrapper">
          <section>
            <HexColorPicker color={color} onChange={setColor} />
          </section>
          <section className="presets">
            {PRESET_COLORS.map(col => (
              <button 
                key={col} 
                style={{ backgroundColor: col }}
                onClick={() => setColor(col)} />
            ))}
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
