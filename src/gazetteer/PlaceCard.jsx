import React from 'react';

import Blank from './states/Blank';
import ResolvedPlace from './states/ResolvedPlace';
import TranscribedPlacename from './states/TranscribedPlacename';

/**
 * The container place card. Inspects the body fetches gazetteer details
 * from the backend, and displays the approprate place card state.
 */
const PlaceCard = props => {

  let card;

  if (props.body?.value) {
    // Resolve place
    card = <ResolvedPlace {...props} />
  } else if (props.transcription) {
    // Not resolve - but we have a transcription at least
    card = <TranscribedPlacename {...props} />
  } else {
    // Neither resolved, nor transcribed - just show the blank "Search" prompt
    card = <Blank {...props} />
  }
  
  return (
    <div className="r6o-g8r-place">
      { card }
    </div>
  );

}

export default PlaceCard;