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

// GUI elements
import CoordinatePanel from './ui/CoordinatePanel';
import ToolPanel from './ui/ToolPanel';

import './App.scss';

const initAnnotorious = viewer => {

  // Initialize Annotorious
  const anno = new Annotorious(viewer, {    
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
  const groups = new GroupPlugin(anno, viewer);

  anno.setWidgets([
    ClassifyWidget,
    TranscribeWidget,
    'COMMENT',
    'TAG',
    groups.editorWidget
  ]);

  return anno;
};

const App = props => {

  const [ viewer, setViewer ] = useState();

  const [ map, setMap ] = useState();

  const [ anno, setAnno ] = useState();

  const [ groups, setGroups ] = useState(); 
  
  // Load document metadata + init annotation layer when App mounts
  useEffect(() => {
    // Viewer initialization differs based on content type
    initViewer(window.config).then(({ viewer, map }) => {
      const anno = initAnnotorious(viewer);

      setMap(map); // Only in case of WMTS
      setViewer(viewer);
      setAnno(anno);
    });
  }, []);

  return (
    <div>
      { viewer && <CoordinatePanel viewer={viewer} map={map} /> }
      { anno && <ToolPanel anno={anno} /> }
    </div>
  );

}

export default App;