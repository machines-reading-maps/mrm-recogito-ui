import React, { useEffect, useState } from 'react';

import './CoordinatePanel.scss';

const CoordinatePanel = props => {

  const [ mouseXY, setMouseXY ] = useState();

  const onImageMouseMove = precision => evt => {
    const viewportPoint = props.viewer.viewport.pointFromPixel(evt.position);
    const imagePoint = props.viewer.viewport.viewportToImageCoordinates(viewportPoint);

    const x = imagePoint.x.toFixed(precision);
    const y = imagePoint.y.toFixed(precision);

    setMouseXY({ x, y });
  }

  const onMapMouseMove = precision => evt => {
    const pt = props.viewer.viewport.pointFromPixel(evt.position);
    const lonlat = props.map.viewportToLonLat([pt.x, pt.y]);

    const x = lonlat[0].toFixed(precision);
    const y = lonlat[1].toFixed(precision);

    setMouseXY({ x, y });
  }

  useEffect(() => {
    // Display lon/lat in case it's a map, X/Y other
    const onMouseMove = props.map ? 
      onMapMouseMove(5) :
      onImageMouseMove(1);

    const tracker = new OpenSeadragon.MouseTracker({
      element: props.viewer.container,
      moveHandler: onMouseMove 
    });

    tracker.setTracking(true);

    return () => tracker.destroy();
  }, []);

  return (
    <div className="mrm-coordinate-panel">
      <span>{props.map ? 'Lon' : 'X'}: { mouseXY?.x || '-' }</span>
      <span>{props.map ? 'Lat' : 'Y'}: { mouseXY?.y || '-' }</span>
    </div>
  )

}

export default CoordinatePanel;