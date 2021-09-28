import React from 'react';

import Blank from './states/Blank';
import ResolvedPlace from './states/ResolvedPlace';
import TranscribedPlacename from './states/TranscribedPlacename';

/**
 * The container place card. Inspects the body fetches gazetteer details
 * from the backend, and displays the approprate place card state.
 */
const PlaceCard = props => {

  let cardState;

  if (props.body?.value) {
    // Resolve place
    cardState = <ResolvedPlace body={props.body} />
  } else if (props.transcription) {
    // Not resolve - but we have a transcription at least
    cardState = <TranscribedPlacename body={props.body} transcription={props.transcription} />
  } else {
    // Neither resolved, nor transcribed - just show the blank "Search" prompt
    cardState = <Blank body={props.body} />
  }
  
  return (
    <div className="r6o-g8r-place">
      { cardState }
    </div>
  );

}

export default PlaceCard;