import React, { useEffect, useState } from 'react';
import Annotorious from '@recogito/annotorious-openseadragon/src';
import LegacyStorage from '@recogito/recogito-legacy-storage';
import TiltedBox from '@recogito/annotorious-tilted-box';

// GUI elements
import CoordinatePanel from './ui/CoordinatePanel';
import ToolPanel from './ui/ToolPanel';

// Annotorious editor plugins
import ClassifyWidget, { ClassifyFormatter } from './widgets/ClassifyWidget';

import './App.scss';

const init = (width, height) => {

  // Initialize OpenSeadragon viewer
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

  // Initialize Annotorious
  const anno = new Annotorious(viewer, {
    widgets: [
      ClassifyWidget,
      'COMMENT'
      // 'TAG'
    ],
    formatter: ClassifyFormatter
  });

  anno.on('createAnnotation', a => console.log(a));

  anno.setAuthInfo({
    id: window.config.me,
    displayName: window.config.me
  });

  // Add Tilted Box drawing tool plugin
  new TiltedBox(anno);

  // Add LegacyStorage plugin
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

  return (
    <div>
      { viewer && <CoordinatePanel viewer={viewer} /> }
      { anno && <ToolPanel anno={anno} /> }
    </div>
  );

}

export default App;