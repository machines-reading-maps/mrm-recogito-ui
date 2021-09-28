import React from 'react';

import PlaceCard from './PlaceCard';

const GazetteerTagWidget = props => {

  const transcription = props.annotation && 
    props.annotation.bodies.find(b => b.purpose === 'transcribing');

  const placeBodies = props.annotation ?
    props.annotation.bodies.filter(b => b.purpose === 'geotagging') : [];

  const onAddGeoTag = () =>
    props.onAppendBody({
      // Hack for testing!
      type: 'TextualBody', purpose: 'geotagging', value: 'http://pleiades.stoa.org/places/109126'
    });

  return (
    <div className="r6o-widget r6o-g8r r6o-nodrag">
      <div className="r6o-g8r-add-new">
        <button onClick={onAddGeoTag}>Add GeoTag</button>
      </div>

      {placeBodies.length > 0 && 
        <div className="r6o-g8r-cards">
          {placeBodies.map((body, idx) => 
            <PlaceCard key={idx} body={body} transcription={transcription} /> 
          )}
        </div>
      }
    </div>
  );

}

export default GazetteerTagWidget;