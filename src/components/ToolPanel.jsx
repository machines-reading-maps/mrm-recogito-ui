import React, { useEffect, useRef, useState } from 'react';
import Toolbar from '@recogito/annotorious-toolbar';

import './ToolPanel.scss';

const ToolPanel = props => {

  const containerEl = useRef();

  const [ toolbar, setToolbar ] = useState();

  useEffect(() => {
    setToolbar(new Toolbar(props.anno, containerEl.current));
  }, []);

  return (
    <div
      className="mrm-toolbar"
      ref={containerEl}>
    </div>
  )

}

export default ToolPanel;