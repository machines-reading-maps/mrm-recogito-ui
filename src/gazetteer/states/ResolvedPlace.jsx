import React from 'react';
import useSWR from 'swr';

import Minimap from './Minimap';

const fetcher = url => fetch(url).then(res => res.json());

const ResolvedPlace = props => {

  const { readOnly } = props;

  const { data, error } = useSWR(`/api/place/${encodeURIComponent(props.body.value)}`, fetcher);

  const record = data && data.is_conflation_of.find(record => record.uri === props.body.value);

  // Temporary hack
  const formatURI = uri => uri;

  return (
    <div className="r6o-g8r-card resolved">
      {record && 
        <>
          <Minimap />
          <div className="r6o-g8r-card-metadata">
            <h3>{record.title}</h3>
            <p className="uri">
              <a href={record.uri} target="_blank">{formatURI(record.uri)}</a>
            </p>
            
            {record.descriptions?.length > 0 && 
              <p className="description">{record.descriptions[0].description}</p>
            }
            
            <p className="names">{record.names.map(n => n.name).join(', ')}</p>

            <p className="date"></p>

            <div className="last-modified">
              <a className="by"></a>
              <span className="at"></span>
            </div>
            
            {!readOnly && <div className="edit-buttons"></div> }
            
            <div className={readOnly ? 'unverified-warning readonly' : 'unverified-warning'}></div>
          </div>
          </>
      }
    </div>
  )

}

export default ResolvedPlace;