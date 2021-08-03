import React from 'react';

import './TranscribeWidget.scss';

/** The draft is a transcription body with a 'draft' flag **/
const getDraft = existingDraft => 
  existingDraft ? existingDraft : {
    type: 'TextualBody', value: '', purpose: 'transcribing', draft: true
  };

const TranscribeWidget = props => {
  
  const draft = getDraft(
    props.annotation ?
      props.annotation.bodies.find(b => b.purpose === 'transcribing') : null);

  const onChange = evt => {
    const prev = draft.value;
    const updated = evt.target.value;

    if (prev.length === 0 && updated.length > 0)
      props.onAppendBody({ ...draft, value: updated });
    else if (prev.length > 0 && updated.length === 0)
      props.onRemoveBody(draft);
    else
      props.onUpdateBody(draft, { ...draft, value: updated });
  }

  return (
    <div className="r6o-widget mrm-transcribe-widget">
      <input
        value={draft.value} 
        onChange={onChange} 
        placeholder="Add a transcription..." />
    </div>
  )

}

export default TranscribeWidget;