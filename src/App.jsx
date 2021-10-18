import React, { useEffect, useState } from 'react';
import Annotorious from '@recogito/annotorious-openseadragon/src';

import { initViewer } from './TileSources';

// Off-the-shelf(-ish) Annotorious plugins
import SelectorPack from '@recogito/annotorious-selector-pack';
import TiltedBox from '@recogito/annotorious-tilted-box';
import LegacyStorage from '@recogito/recogito-legacy-storage';

// Custom MRM extensions and plugins
import ClassifyWidget, { ClassifyFormatter } from './widgets/ClassifyWidget';
import TranscribeWidget from './widgets/TranscribeWidget';
import GroupPlugin from './group/GroupPlugin';
import GazetteerTagWidget from './gazetteer/GazetteerTagWidget';

// GUI elements
import CoordinatePanel from './ui/CoordinatePanel';
import ToolPanel from './ui/ToolPanel';
import MapKuratorControl from './mapkurator/MapKuratorControl';

import './App.scss';

const hasVocabulary = () =>
  window.config.vocabulary?.length > 0;

const getVocabulary = () =>
  window.config.vocabulary.map(({ value, uri }) => 
      uri ? { label: value, uri } : value);

const initAnnotorious = (viewer, gazetteers) => {

  // Initialize Annotorious
  const gigapixelMode = window.config.contentType === 'MAP_WMTS';

  const tagWidget = hasVocabulary() ? { widget: 'TAG', vocabulary: getVocabulary() } : 'TAG';

  const anno = new Annotorious(viewer, {    
    formatter: ClassifyFormatter,
    gigapixelMode,
    locale: 'auto',
    allowEmpty: true,
    widgets: [
      ClassifyWidget,
      { widget: GazetteerTagWidget, gazetteers },
      TranscribeWidget,
      'COMMENT',
      tagWidget
    ]
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
  new GroupPlugin(anno, viewer);
  
  return anno;
};

const App = props => {

  const [ viewer, setViewer ] = useState();

  const [ map, setMap ] = useState();

  const [ anno, setAnno ] = useState();

  // Load document metadata + init annotation layer when App mounts
  useEffect(() => {
    // Load user-configured gazetteer set + gazetteer display config data
    fetch('/api/authorities/gazetteers')
      .then(response => response.json())
      .then(gazetteers => { 
        // Viewer initialization differs based on content type
        initViewer(window.config).then(({ viewer, map }) => {
          const anno = initAnnotorious(viewer, gazetteers);

          setMap(map); // Only in case of WMTS
          setViewer(viewer);
          setAnno(anno);
        });
      });
  }, []);

  return (
    <div>
      { viewer && <CoordinatePanel viewer={viewer} map={map} /> }
      { anno && <ToolPanel anno={anno} /> }
      { viewer && <MapKuratorControl config={window.config} viewer={viewer} map={map} /> }
    </div>
  );

}

export default App;