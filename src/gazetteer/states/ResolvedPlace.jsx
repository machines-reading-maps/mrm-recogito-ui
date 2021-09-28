import React from 'react';
import useSWR from 'swr';

import Minimap from './Minimap';
import { yyyyMMddToYear } from '../Formatting';

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
          <Minimap center={data.representative_point.slice().reverse()} />

          <div className="r6o-g8r-card-metadata-wrapper">
            <div className="r6o-g8r-card-metadata">
              <h3>{record.title}</h3>
              <p className="uri">
                <a href={record.uri} target="_blank">{formatURI(record.uri)}</a>
              </p>
              
              {record.descriptions?.length > 0 && 
                <p className="description">{record.descriptions[0].description}</p>
              }
              
              <p className="names">{record.names.map(n => n.name).join(', ')}</p>

              {record.temporal_bounds && 
                <p className="date">
                  {yyyyMMddToYear(record.temporal_bounds.from)} - {yyyyMMddToYear(record.temporal_bounds.to)}
                </p>
              }

              <div className="last-modified">
                <a className="by"></a>
                <span className="at"></span>
              </div>
              
              {!readOnly && 
                <div className="edit-buttons">
                  <button className="change btn tiny icon">&#xf040;</button>
                  <button className="delete btn tiny icon">&#xf014;</button>
                </div>
              }
              
              <div className={readOnly ? 'unverified-warning readonly' : 'unverified-warning'}></div>
            </div>
          </div>
        </>
      }
    </div>
  )

}

export default ResolvedPlace;