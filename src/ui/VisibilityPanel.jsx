import React, { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import './VisibilityPanel.scss';

const VisibilityPanel = props => {

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.querySelector('.a9s-annotationlayer');
    
    if (visible)
      el.style.display = 'block';
    else
      el.style.display = 'none';
  }, [ visible ]);

  return (
    <div className="mrm-visibility-panel">
      <button onClick={() => setVisible(!visible)}>
        {visible ? ( 
          <AiFillEye /> 
        ) : (
          <AiFillEyeInvisible />
        )}
      </button>
    </div>
  )

}

export default VisibilityPanel;