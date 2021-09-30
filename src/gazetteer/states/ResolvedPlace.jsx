import React from 'react';
import { BiPencil, BiTrash } from 'react-icons/bi';
import i18n, { LocalTimeAgo } from '@recogito/annotorious-openseadragon/src/util/I18N';

import Minimap from './Minimap';
import { yyyyMMddToYear } from '../Formatting';

const ResolvedPlace = props => {

  const { readOnly } = props;

  const isSuggested = !props.body?.value;

  const record = isSuggested ?
    // No resolution - pick first from union record
    props.place.is_conflation_of[0] : 

    // Resolved place - pick the correct one from the union record
    props.place.is_conflation_of.find(record => record.uri === props.body.value);

  const timestamp = props.body.modified || props.body.created;

  return (
    <div className="r6o-g8r-card resolved">
      {record && 
        <>
          <Minimap center={props.place.representative_point.slice().reverse()} />

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

              {!isSuggested && 
                <>
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

                      <button
                        className="delete btn tiny icon" 
                        onClick={() => props.onDelete(props.body)}>
                        <BiTrash />
                      </button>
                    </div>
                  }
                </>
              }
              
              {isSuggested &&
                <div className={readOnly ? 'unverified-warning readonly' : 'unverified-warning'}>
                   <span className="warning">
                      <span className="icon">&#xf071;</span> {i18n.t('Automatic match')}
                    </span>
                    
                    {!readOnly &&
                      <>
                        <button
                          className="btn tiny delete icon"
                          onClick={() => props.onDelete(props.body)}>
                            <BiTrash />
                        </button>
                        
                        <button className="btn tiny unverified-change">
                          {i18n.t('Change')}
                        </button>
                        
                        <button
                          className="btn tiny unverified-confirm"
                          onClick={() => props.onConfirm(record.uri)}>
                          {i18n.t('Confirm')}
                        </button>
                      </>
                    }
                </div>
              }
            </div>
          </div>
        </>
      }
    </div>
  )

}

export default ResolvedPlace;