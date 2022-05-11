import React, { useEffect, useRef } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { MapContainer, Marker, TileLayer, Popup, useMap } from 'react-leaflet';

import { parsePlaceURI } from '../Formatting';

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

const PlaceMarker = props => {
  
  const ref = useRef();

  useEffect(() => {
    if (props.selected && ref.current)
      ref.current.openPopup();
  }, [ ref.current, props.selected ]);

  const onClose = () => {
    ref.current.closePopup();
    props.onDeselectPlace(props.item);
  }

  const records = props.item.is_conflation_of.map(record => ({
    ...record,
    ...parsePlaceURI(record.uri, props.gazetteers)
  }));
  
  return (
    <Marker 
      ref={ref}
      position={props.item.representative_point.slice().reverse()}>
      <Popup className="r6o-g8r-map-popup">
        <div className="r6o-g8r-map-popup-header">
          <h4>{props.item.title}</h4>
          <button
            className="r6o-g8r-close"
            onClick={onClose}>
            <VscChromeClose />
          </button>
        </div>
        <div className="r6o-g8r-map-popup-choices">
          <table>
            <tbody>
              {records.map(record =>
                <tr 
                  key={record.uri}
                  onClick={() => props.onSelectRecord(record)}>

                  <td
                    className="record-id"
                    style={{ backgroundColor: record.color }}>
                    <span className="shortcode">{record.shortcode}</span>
                    <span className="id">{record.id}</span>
                  </td>

                  <td>
                    <h5>{record.title}</h5>
                    <p className="names">
                      {record.names && 
                        record.names.map(n => n.name).join(', ')
                      }
                    </p>
                    <p className="description">
                      {record.descriptions?.length > 0 &&
                        record.descriptions[0].description
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Popup>
    </Marker>
  )

}

// Inner component, so we can use useMap hook.
const ResultMapView = props => {

  const map = useMap();

  const { result } = props;

  const locatedItems = result ? result.items.filter(item => item.representative_point) : [];

  const markers = locatedItems.map(item =>
    <PlaceMarker 
      gazetteers={props.gazetteers}
      key={item.union_id}
      item={item} 
      selected={item === props.selected}
      onSelectRecord={props.onSelectRecord} 
      onDeselectPlace={props.onDeselectPlace} />);

  useEffect(() => {
    if (result) {
      const bounds = getBounds(locatedItems);
      // map.fitBounds(bounds, { maxZoom: 12 });
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
        center={[55.9533, -3.189167]}
        zoom={12}>
        <ResultMapView {...props} />
      </MapContainer>
    </div>
  )

}

export default ResultMap;