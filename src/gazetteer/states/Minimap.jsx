import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';

// Fix missing Leaflet marker images
// Cf. https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  iconUrl: 'leaflet/marker-icon.png',
  shadowUrl: 'leaflet/marker-shadow.png'
});

import 'leaflet/dist/leaflet.css';

const Minimap = props => {

  return (
    <MapContainer className="minimap" center={[51.505, -0.09]} zoom={13}>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />

        <Marker position={[51.505, -0.09]} />
    </MapContainer>
  );

}

export default Minimap;