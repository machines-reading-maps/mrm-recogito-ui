import Annotorious from '@recogito/annotorious-openseadragon';
import Storage from '@recogito/recogito-legacy-storage';

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

  new Storage(anno, window.config);
};

window.onload = function() {
  fetch(`/document/${window.config.documentId}/part/${window.config.partSequenceNo}/manifest`)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const props = data.firstChild;
      const width = parseInt(props.getAttribute('WIDTH'));
      const height = parseInt(props.getAttribute('HEIGHT'));

      init(width, height);
    });
}
