import React from 'react';
import { IoCogSharp } from 'react-icons/io5';

import SelectionLayer from './SelectionLayer';

import './MapKuratorControl.scss';

const MapKuratorControl = props => {

  const onSelectRegion = () => {
    const selectionLayer = new SelectionLayer(props);

    selectionLayer.on('select', bbox => {

      const data = {
        task_type: 'MAPKURATOR',
        documents: [ props.config.documentId ],
        minLon: bbox[0][0],
        minLat: bbox[0][1],
        maxLon: bbox[1][0],
        maxLat: bbox[1][1]
      }

      fetch('/api/job', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });

    });
  }

  return (
    <div className="mrm-mapkurator-control">
      <button onClick={onSelectRegion}>
        <IoCogSharp /> 
        <label>mapKurator</label>
      </button>
    </div>
  )

}

export default MapKuratorControl;