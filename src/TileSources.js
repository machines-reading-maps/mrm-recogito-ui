import OpenSeadragonWMTS from 'openseadragon-wmts';

const fetchUploadSource = config =>
  fetch(`/document/${config.documentId}/part/${config.partSequenceNo}/manifest`)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const props = data.firstChild;
      const width = parseInt(props.getAttribute('WIDTH'));
      const height = parseInt(props.getAttribute('HEIGHT'));

      // Initialize OpenSeadragon viewer
      const viewer = OpenSeadragon({
        id:'image-pane',
        prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/',
        tileSources: [{
          type: 'zoomifytileservice',
          width: width,
          height: height,
          tilesUrl: `/document/${config.documentId}/part/${config.partSequenceNo}/tiles/`
        }]
      });

      return { viewer };
    });

const fetchIIIFSource = config =>
  fetch(`/document/${config.documentId}/part/${config.partSequenceNo}/manifest`)
    .then(response => response.json())
    .then(manifest => {
      // Initialize OpenSeadragon viewer
      const viewer = OpenSeadragon({
        id:'image-pane',
        prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/',
        tileSources: [ manifest ]
      });
      
      return { viewer };
    });

const fetchWMTSSource = config => {
  const viewer = OpenSeadragon({
    id: 'image-pane',
    prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/'
  });
  
  return OpenSeadragonWMTS(viewer, {
    url: `/document/${config.documentId}/part/${config.partSequenceNo}/manifest`
  }).then(map => {
    return { viewer, map };
  });
}

export const initViewer = config => {

  const { contentType } = config;

  if (contentType === 'IMAGE_UPLOAD') {
    return fetchUploadSource(config);
  } else if (contentType === 'IMAGE_IIIF') {
    return fetchIIIFSource(config);
  } else if (contentType === 'MAP_WMTS') {
    return fetchWMTSSource(config);
  }
  
  throw "Unsupported content type: " + contentType;
}
