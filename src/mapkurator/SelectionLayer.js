import Emitter from 'tiny-emitter';

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export default class SelectionLayer extends Emitter {

  constructor(props) {
    super();

    this.viewer = props.viewer;
    this.map = props.map;

    this.svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    this.svg.setAttribute('class', 'mrm-mapkurator-selection-layer');

    this.rect = null; // Selection rectangle
    
    this.svg.addEventListener('mousedown', this.onMouseDown);
    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    document.getElementById('image-pane').appendChild(this.svg);
  }

  onMouseDown = evt => {
    const { offsetX, offsetY } = evt;

    this.rect = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.svg.appendChild(this.rect);

    this.rect.setAttribute('x', offsetX);
    this.rect.setAttribute('y', offsetY);
    this.rect.setAttribute('width', 0);
    this.rect.setAttribute('height', 0);
  }

  onMouseMove = evt => {
    if (this.rect) {
      const { offsetX, offsetY } = evt;

      const x = this.rect.getAttribute('x');
      const y = this.rect.getAttribute('y');

      const w = offsetX - x;
      const h = offsetY - y;

      this.rect.setAttribute('width', w);
      this.rect.setAttribute('height', h);
    }
  }

  onMouseUp = evt => {
    if (this.rect) {
      // Coordinates in SVG/viewport
      const x1 = parseFloat(this.rect.getAttribute('x'));
      const y1 = parseFloat(this.rect.getAttribute('y'));

      const x2 = x1 + parseFloat(this.rect.getAttribute('width'));
      const y2 = y1 + parseFloat(this.rect.getAttribute('height'));

      // Convert to OSD...
      const viewportTopLeft = this.viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x1, y1));
      const viewportBottomRight = this.viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x2, y2));

      // ...and then to lon/lat
      const lonLatTopLeft = this.map.viewportToGeoCoordinates(viewportTopLeft);
      const lonLatBottomRight = this.map.viewportToGeoCoordinates(viewportBottomRight);

      this.emit('select', [ lonLatTopLeft, lonLatBottomRight ]);

      this.svg.parentNode.removeChild(this.svg);
      this.rect = null;
    }
  }

}