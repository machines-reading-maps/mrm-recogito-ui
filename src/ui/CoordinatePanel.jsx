import React, { useEffect, useState } from 'react';

import './CoordinatePanel.scss';

const CoordinatePanel = props => {

  const [ mouseXY, setMouseXY ] = useState();

  const onMouseMove = precision => evt => {
    const viewportPoint = props.viewer.viewport.pointFromPixel(evt.position);
    const imagePoint = props.viewer.viewport.viewportToImageCoordinates(viewportPoint);

    const x = imagePoint.x.toFixed(precision);
    const y = imagePoint.y.toFixed(precision);

    setMouseXY({ x, y });
  }

  useEffect(() => {
    const tracker = new OpenSeadragon.MouseTracker({
      element: props.viewer.container,
      moveHandler: onMouseMove(1) 
    });

    tracker.setTracking(true);

    return () => tracker.destroy();
  }, []);

  return (
    <div className="mrm-coordinate-panel">
      <span>X: { mouseXY?.x || '-' }</span>
      <span>Y: { mouseXY?.y || '-' }</span>
    </div>
  )

}

export default CoordinatePanel;