import React, { useEffect, useState } from 'react';
import { IoCogSharp } from 'react-icons/io5';
import { CgSpinner } from 'react-icons/cg';
import { BiError } from 'react-icons/bi';
import { GrSelect } from 'react-icons/gr';

import SelectionLayer from './SelectionLayer';

import './MapKuratorControl.scss';

const MapKuratorControl = props => {

  // mapKurator processing state
  const [ processing, setProcessing ] = useState();

  const [ jobId, setJobId ] = useState();

  const [ selectionLayer, setSelectionLayer ] = useState();

  useEffect(() => {
    const onKeyDown = evt => {
      if (evt.which === 27) {
        // Escape
        if (processing === 'pick-region')
          resetSelection();
      }
    }

    document.body.addEventListener('keydown', onKeyDown);

    return () => document.body.removeEventListener('keydown', onKeyDown);
  })

  useEffect(() => {
    let timer; 

    if (jobId && processing === 'started') {
      // Start poll loop
      const poll = () => {
        timer = setTimeout(() => {

          fetch(`/api/job/${jobId}`)
            .then(response => response.json())
            .then(data => {
              const { status } = data;

              if (status === 'COMPLETED') {
                // Annotation storage has a bit of lag between
                // ingest and annotations becoming available for read
                window.setTimeout(() => {
                  setProcessing(null);
                  setJobId(null);
                  setSelectionLayer(null);
                  
                  props.onProcessingComplete()
                }, 3000);
              } else if (status === 'FAILED') {
                console.log(data);
                setProcessing('failed');
              } else {
                poll();
              }
            })
            .catch(error => {
              setProcessing('failed');
            });
        }, 2000);
      }

      poll();
    }

    return (() => clearTimeout(timer));
  }, [ jobId ]);
  
  const selectRegion = () => {
    setProcessing('pick-region');

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

      setProcessing('started');

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
        setJobId(data.job_id);
      })
      .catch(error => {
        setProcessing('failed');
      });
    });

    setSelectionLayer(selectionLayer);
  }

  const resetSelection = () => {
    selectionLayer?.destroy();
    setSelectionLayer(null);
    setProcessing(null);
  }

  const onClick = () => {
    if (!processing) {
      selectRegion();
    } else if (processing === 'pick-region') {
      resetSelection();
    }
  }

  let button = null; 

  if (processing === 'pick-region') {
    button = 
      <>
        <GrSelect />
        <label>Select region</label>
      </>
  } else if (processing === 'started') {
    button = 
      <>
        <CgSpinner />
        <label>Processing...</label>
      </>
  } else if (processing === 'failed') {
    button = 
      <>
        <BiError />
        <label>Something went wrong</label>
      </>
  } else {
    button =
      <>
        <IoCogSharp /> 
        <label>mapKurator</label>
      </>
  }

  return (
    <div 
      className={processing ? `mrm-mapkurator-control ${processing}` : 'mrm-mapkurator-control'}>
      <button onClick={onClick}>
        {button}
      </button>
    </div>
  )

}

export default MapKuratorControl;