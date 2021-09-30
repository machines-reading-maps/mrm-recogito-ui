import React from 'react';
import useSWR from 'swr';
import { BiPencil, BiTrash } from 'react-icons/bi';
import { LocalTimeAgo } from '@recogito/annotorious-openseadragon/src/util/I18N';

import Minimap from './Minimap';
import { yyyyMMddToYear } from '../Formatting';

const fetcher = url => fetch(url).then(res => res.json());

const ResolvedPlace = props => {

  const { readOnly } = props;

  const { data, error } = useSWR(`/api/place/${encodeURIComponent(props.body.value)}`, fetcher);

  const record = data && data.is_conflation_of.find(record => record.uri === props.body.value);

  const timestamp = props.body.modified || props.body.created;

  return (
    <div className="r6o-g8r-card resolved">
      {record && 
        <>
          <Minimap center={data.representative_point.slice().reverse()} />

          <div className="r6o-g8r-card-content-wrapper">
            <div className="r6o-g8r-card-metadata">
              <h3>{record.title}</h3>
              <p className="uri">
                <a href={record.uri} target="_blank">{record.uri}</a>
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
                <a className="by">{props.body.creator.name}</a>
                <span className="at">
                  <LocalTimeAgo 
                    datetime={props.env.toClientTime(timestamp)} />
                </span>
              </div>
              
              {!readOnly && 
                <div className="edit-buttons">
                  <button className="change btn tiny icon">
                    <BiPencil />
                  </button>

                  <button className="delete btn tiny icon" onClick={() => props.onDelete(props.body)}>
                    <BiTrash />
                  </button>
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