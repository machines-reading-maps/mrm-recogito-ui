import React, { useEffect, useState } from 'react';
import Annotorious from '@recogito/annotorious-openseadragon';
import LegacyStorage from '@recogito/recogito-legacy-storage';

const init = (width, height) => {

  const viewer = OpenSeadragon({
    id:'image-pane',
    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/",
    tileSources: [{
      type: 'zoomifytileservice',
      width: width,
      height: height,
      tilesUrl: '/document/' + config.documentId + '/part/' + config.partSequenceNo + '/tiles/'
    }]
  });

  const anno = new Annotorious(viewer);  
  anno.setAuthInfo({
    id: window.config.me,
    displayName: window.config.me
  });

  new LegacyStorage(anno, window.config);

  return { viewer, anno };
};

const App = props => {

  const [ viewer, setViewer ] = useState();

  const [ anno, setAnno ] = useState();
  
  // Load document metadata + init annotation layer when App mounts
  useEffect(() => {
    fetch(`/document/${window.config.documentId}/part/${window.config.partSequenceNo}/manifest`)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        const props = data.firstChild;
        const width = parseInt(props.getAttribute('WIDTH'));
        const height = parseInt(props.getAttribute('HEIGHT'));

        const { viewer, anno } = init(width, height);

        setViewer(viewer);
        setAnno(anno);
      });
  }, []);

  return (<div></div>);

}

export default App;