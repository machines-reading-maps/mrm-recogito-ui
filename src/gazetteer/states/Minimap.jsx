import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix missing Leaflet marker images
// Cf. https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  iconUrl: 'leaflet/marker-icon.png',
  shadowUrl: 'leaflet/marker-shadow.png'
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

      <Marker position={props.center} />
    </>
  )

}

const Minimap = props => {

  return (
    <MapContainer 
      className="minimap" 
      zoomControl={false}
      center={props.center} 
      zoom={4}>
      <MinimapContents {...props} />
    </MapContainer>
  );

}

export default Minimap;