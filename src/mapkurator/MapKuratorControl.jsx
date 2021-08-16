import React from 'react';
import { IoCogSharp } from 'react-icons/io5';

import SelectionLayer from './SelectionLayer';

import './MapKuratorControl.scss';

const MapKuratorControl = props => {

  /** Start selecting a region for mapKurator **/
  const onSelectRegion = () => {
    console.log('start selection!');

    const selectionLayer = new SelectionLayer(props);

    selectionLayer.on('select', bbox => {

      // TODO contact mapKurator service and wait for WebAnnotations
      console.log('bbox', bbox);

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