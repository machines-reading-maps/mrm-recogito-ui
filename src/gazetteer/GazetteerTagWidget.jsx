import React, { useState } from 'react';
import { FiGlobe } from 'react-icons/fi';
import i18n from '@recogito/annotorious-openseadragon/src/util/I18N';

import Messages from './Messages';
import PlaceCard from './PlaceCard';
import GazetteerSearch from './search/GazetteerSearch';

import './GazetteerTagWidget.scss';

// Register I18N labels
for (let [ lang, dict ] of Object.entries(Messages)) {
  i18n.registerMessages(lang, dict);
}

const GazetteerTagWidget = props => {

  const [ bodyToChange, setBodyToChange ] = useState();

  const transcription = props.annotation && 
    props.annotation.bodies.find(b => b.purpose === 'transcribing')?.value;

  const placeBodies = props.annotation ?
    props.annotation.bodies.filter(b => b.purpose === 'geotagging') : [];

  const onConfirm = (body, uri) =>
    props.onUpdateBody(body, { ...body, value: uri });

  const onDelete = body =>
    props.onRemoveBody(body);

  const onAddGeoTag = () =>
    props.onAppendBody({
      type: 'TextualBody', 
      purpose: 'geotagging'
    });

  // User picked a new gazetteer record for this body
  const onChangeBody = (body, record) => {
    props.onUpdateBody(body, {
      ...body,
      value: record.uri
    });
    
    setBodyToChange(null);
  }

  return (
    <div className="r6o-widget r6o-g8r r6o-nodrag">
      {placeBodies.length > 0 && 
        <div className="r6o-g8r-cards">
          {placeBodies.map((body, idx) => 
            <PlaceCard 
              key={idx} 
              env={props.env}
              body={body} 
              transcription={transcription} 
              onConfirm={uri => onConfirm(body, uri)}
              onChange={() => setBodyToChange(body)}
              onDelete={onDelete} /> 
          )}
        </div>
      }
      
      <div className="r6o-g8r-add-new">
        <FiGlobe />
        <button onClick={onAddGeoTag}>{i18n.t('Add geo-tag')}</button>
      </div>

      {bodyToChange &&
        <GazetteerSearch
          gazetteers={props.gazetteers}
          quote={transcription}
          onSelectRecord={record => onChangeBody(bodyToChange, record)}
          onClose={() => setBodyToChange(null)}/>
      }
    </div>
  );

}

export default GazetteerTagWidget;