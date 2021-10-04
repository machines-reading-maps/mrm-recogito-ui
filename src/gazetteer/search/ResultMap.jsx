import React from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

// Inner component, so we can use useMap hook.
const ResultMapView = props => {

  // const map = useMap();

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </>
  )

}

const ResultMap = props => {

  return (
    <div className="r6o-g8r-search-map-container">
      <MapContainer 
        className="r6o-g8r-search-map" 
        zoomControl={false}
        attributionControl={false}
        center={[0 , 0]}
        zoom={2}>
        <ResultMapView {...props} />
      </MapContainer>
    </div>
  )

}

export default ResultMap;