import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix missing Leaflet marker images
// Cf. https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/images/leaflet/marker-icon-2x.png',
  iconUrl: '/assets/images/leaflet/marker-icon.png',
  shadowUrl: '/assets/images/leaflet/marker-shadow.png'
});

const CENTER_POINT = L.point(82, 70);

import 'leaflet/dist/leaflet.css';

const MinimapContents = props => {

  const map = useMap();

  useEffect(() => {
    map.panTo(map.containerPointToLatLng(CENTER_POINT), { animate: false});
  }, []);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {props.center && <Marker position={props.center} /> }
    </>
  )

}

const Minimap = props => {

  const center = props.center || [ 0, 0 ];

  const zoom = props.center ? 4 : 1;

  return (
    <MapContainer 
      className="minimap" 
      zoomControl={false}
      center={center} 
      zoom={zoom}
      attributionControl={false}>
      <MinimapContents {...props} />
    </MapContainer>
  );

}

export default Minimap;