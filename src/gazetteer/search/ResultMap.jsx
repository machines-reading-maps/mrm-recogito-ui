import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const getBounds = items => {

  if (items.length === 0)
    return [
      [ -0.1, -0.1 ],
      [  0.1, 0.1 ]
    ];

  let minLon =  180;
  let maxLon = -180;

  let minLat =  90;
  let maxLat = -90;

  items.forEach(item => {
    if (item.representative_point) {
      const [ lon, lat ] = item.representative_point;

      if (lon < minLon)
        minLon = lon;

      if (lon > maxLon)
        maxLon = lon;

      if (lat < minLat)
        minLat = lat;

      if (lat > maxLat)
        maxLat = lat;
    }
  });
  
  return [
    [ minLat, minLon ],
    [ maxLat, maxLon ]
  ];
}

// Inner component, so we can use useMap hook.
const ResultMapView = props => {

  const map = useMap();

  const { result } = props;

  const locatedItems = result ? result.items.filter(item => item.representative_point) : [];

  const markers = locatedItems.map(item => 
    <Marker 
      key={item.union_id}
      position={item.representative_point.slice().reverse()} />
  );

  useEffect(() => {
    if (result) {
      const bounds = getBounds(locatedItems);
      map.fitBounds(bounds, { maxZoom: 12 });
    }
  }, [ locatedItems ]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markers}
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