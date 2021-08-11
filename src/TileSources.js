const initUploadSource = response => response.text()
  .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
  .then(data => {
    const props = data.firstChild;
    const width = parseInt(props.getAttribute('WIDTH'));
    const height = parseInt(props.getAttribute('HEIGHT'));

    // Initialize OpenSeadragon viewer
    const viewer = OpenSeadragon({
      id:'image-pane',
      prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/",
      tileSources: [{
        type: 'zoomifytileservice',
        width: width,
        height: height,
        tilesUrl: `/document/${config.documentId}/part/${config.partSequenceNo}/tiles/`
      }]
    });

    return { viewer };
  });

const initIIIFSource = response => response.json()
  .then(manifest => {
    // Initialize OpenSeadragon viewer
    const viewer = OpenSeadragon({
      id:'image-pane',
      prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/",
      tileSources: [ manifest ]
    });
    
    return { viewer };
  });

const initWMTSSource = config => {

}

export const initViewer = config =>
  fetch(`/document/${config.documentId}/part/${config.partSequenceNo}/manifest`)
    .then(response => {
      const { contentType } = config;

      if (contentType === 'IMAGE_UPLOAD') {
        return initUploadSource(response);
      } else if (contentType === 'IMAGE_IIIF') {
        return initIIIFSource(response);
      } else if (contentType === 'MAP_WMTS') {
        return initWMTSSource(response);
      }
      
      throw "Unsupported content type: " + contentType;
    });
