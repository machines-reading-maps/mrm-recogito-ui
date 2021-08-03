import React, { useEffect, useState } from 'react';
import Annotorious from '@recogito/annotorious-openseadragon/src';

// Off-the-shelf(-ish) Annotorious plugins
import SelectorPack from '@recogito/annotorious-selector-pack';
import TiltedBox from '@recogito/annotorious-tilted-box';
import LegacyStorage from '@recogito/recogito-legacy-storage';

// Custom MRM extensions and plugins
import ClassifyWidget, { ClassifyFormatter } from './widgets/ClassifyWidget';
import TranscribeWidget from './widgets/TranscribeWidget';
import LinkingPlugin from './linking/LinkingPlugin';
import LinkingWidget from './linking/LinkingWidget';

// GUI elements
import CoordinatePanel from './ui/CoordinatePanel';
import ToolPanel from './ui/ToolPanel';

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
      TranscribeWidget,
      'COMMENT'
      // 'TAG'
    ],
    formatter: ClassifyFormatter
  });

  anno.setAuthInfo({
    id: window.config.me,
    displayName: window.config.me
  });

  // Add extra drawing tools
  new SelectorPack(anno);
  new TiltedBox(anno);

  // Add LegacyStorage plugin
  new LegacyStorage(anno, window.config);

  // Add linking plugin
  new LinkingPlugin(anno);

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