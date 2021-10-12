import React, { useEffect, useState } from 'react';

import Blank from './states/Blank';
import ResolvedPlace from './states/ResolvedPlace';

/**
 * The container place card. Inspects the body fetches gazetteer details
 * from the backend, and displays the approprate place card state.
 */
const PlaceCard = props => {

  const [ status, setStatus ] = useState('PENDING');

  const [ place, setPlace ] = useState();

  useEffect(() => {
    if (props.body?.value) {
      // Resolve place URI
      fetch(`/api/place/${encodeURIComponent(props.body.value)}`)
        .then(res => res.json())
        .then(place => {
          setPlace(place);
          setStatus('RESOLVED');
        })
    } else if (props.transcription) {
      // Fetch suggestion
      fetch(`/api/place/search?q=${encodeURIComponent(props.transcription)}&size=1`)
        .then(res => res.json())
        .then(data => {
          if (data?.total > 0) {
            setPlace(data.items[0]);
            setStatus('SUGGESTED');
          } else {
            setStatus('NO_SUGGESTION');
          }
        });
    } else {
      setStatus('BLANK');
    }
  }, [ props.body ]);

  if (status === 'RESOLVED' || status === 'SUGGESTED') {
    return <ResolvedPlace {...props} place={place} />;
  } else if (status === 'BLANK' || status === 'NO_SUGGESTION') {
    return <Blank {...props} />;
  }

  return null;

}

export default PlaceCard;