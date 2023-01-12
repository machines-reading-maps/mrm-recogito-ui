import React, { useEffect, useState } from 'react';
import Annotorious from '@recogito/annotorious-openseadragon/src';

import { initViewer } from './TileSources';

// Off-the-shelf(-ish) Annotorious plugins
import SelectorPack from '@recogito/annotorious-selector-pack';
import TiltedBox from '@recogito/annotorious-tilted-box';
import BetterPolygon from '@recogito/annotorious-better-polygon';
import LegacyStorage, { fromLegacyAnnotation } from '@recogito/recogito-legacy-storage/src';
import MapAnnotation from '@recogito/annotorious-map-annotation';

// Custom MRM extensions and plugins
import ClassifyWidget, { ClassifyFormatter } from './widgets/ClassifyWidget';
import TranscribeWidget from './widgets/TranscribeWidget';
import GroupPlugin from './group/GroupPlugin';
import GazetteerTagWidget from './gazetteer/GazetteerTagWidget';
import EntityAPIConnector from './widgets/EntityAPIConnector';

// GUI elements
import CoordinatePanel from './ui/CoordinatePanel';
import ToolPanel from './ui/ToolPanel';
import ColorCodingPanel, { ByProgressFormatter, ByCheckOrNoCheckFormatter, ByGroupedFormatter} from './ui/ColorCodingPanel';
import MapKuratorControl from './mapkurator/MapKuratorControl';

import './App.scss';
      
const IS_WMTS = window.config.contentType === 'MAP_WMTS';

const initAnnotorious = (viewer, map, gazetteers) => {

  const localVocabulary = 
    window.config.vocabulary?.length > 0 ?
      window.config.vocabulary.map(({ value, uri }) => 
        uri ? { label: value, uri } : value) 
      : null;

  // User either local vocab, if any, or the Entity API
  const vocabulary = localVocabulary || EntityAPIConnector;

  // Initialize Annotorious
  const anno = new Annotorious(viewer, {    
    gigapixelMode: IS_WMTS,
    locale: 'auto',
    allowEmpty: true,
    drawOnSingleClick: true,
    crosshair: true,
    widgets: [
      ClassifyWidget,
      { widget: GazetteerTagWidget, gazetteers },
      TranscribeWidget,
      'COMMENT',
      { widget: 'TAG', vocabulary }
    ],
    formatters: [ 
      ClassifyFormatter,
      ByProgressFormatter,
      ByCheckOrNoCheckFormatter,
      ByGroupedFormatter
    ]
  });

  anno.setAuthInfo({
    id: window.config.me,
    displayName: window.config.me
  });

  // Add extra drawing tools
  // In case of WMTS, don't add circle!
  const selectorPackConfig = IS_WMTS ? 
    { tools: [ 'point', 'ellipse', 'freehand' ]} : null;

  new BetterPolygon(anno);
  new SelectorPack(anno, selectorPackConfig);
  new TiltedBox(anno);

  // Add linking plugin
  new GroupPlugin(anno, viewer, IS_WMTS);

  // Add MapAnnotation plugin
  if (IS_WMTS)
    new MapAnnotation(anno, map);

  // Add LegacyStorage plugin
  const storage = new LegacyStorage(anno, window.config);

  storage.onError(error => {
    if (window.confirm('You were logged out due to inactivity. Click OK to log in again.')) {
      window.location = '/login';
    }
  });

  return { anno, storage };
};

const App = () => {

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
          const { anno, storage } = initAnnotorious(viewer, map, gazetteers);

          storage.init();

          setMap(map); // Only in case of WMTS
          setViewer(viewer);
          setAnno(anno);
        });
      });
  }, []);

  const onMapKuratorComplete = () => {
    // mapKurator has completed - refresh all annotations
    fetch(`/api/document/${window.config.documentId}/part/${window.config.partSequenceNo}/annotations`)
      .then(response => response.json())
      .then(data => {
        // API returns legacy format - crosswalk!
        const annotations = data.map(a => fromLegacyAnnotation(a));
        anno.setAnnotations(annotations);
      });
  }

  return (
    <div>
      { viewer && 
        <CoordinatePanel 
          viewer={viewer} 
          map={map} /> }

      { anno && 
        <ToolPanel anno={anno} /> }

      { anno &&
        <div className="bottom-right-controls">
          {(viewer && IS_WMTS) &&
            <MapKuratorControl 
              hidden
              config={window.config} 
              viewer={viewer} 
              map={map} 
              onProcessingComplete={onMapKuratorComplete} /> 
          }
           
          <ColorCodingPanel /> 
        </div>
      }
    </div>
  );

}

export default App;