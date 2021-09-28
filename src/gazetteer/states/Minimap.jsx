import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

const Minimap = props => {

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13}>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />

        <Marker position={[51.505, -0.09]} />
    </MapContainer>
  );

}

export default Minimap;