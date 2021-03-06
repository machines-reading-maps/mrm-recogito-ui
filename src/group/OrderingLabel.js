import { SVG_NAMESPACE } from './SVG';

const isFirefox = /firefox/i.test(navigator.userAgent);

const createContainer = bounds => {
  const { x, y, width, height } = bounds;

  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('class', 'a9s-formatter-el a9s-group-order');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  // Argh - Firefox produces broken SVG bounds for nested SVG
  if (isFirefox) {
    svg.setAttribute('x', 0);
    svg.setAttribute('y', 0);
    svg.setAttribute('transform', `translate(${x}, ${y})`);  
  } else {
    svg.setAttribute('x', x);
    svg.setAttribute('y', y);
  }

  const g = document.createElementNS(SVG_NAMESPACE, 'g');
  svg.appendChild(g);

  return svg;
}

export default class OrderingLabel {

  constructor(shape, seqNo, initialScale) {
    this.shape = shape;

    const inner = shape.querySelector('.a9s-inner');
    this.container = createContainer(inner.getBBox());

    const box = document.createElementNS(SVG_NAMESPACE, 'rect');
    box.setAttribute('x', -30);
    box.setAttribute('width', 24);
    box.setAttribute('height', 24);
    box.setAttribute('rx', 3);

    this.text = document.createElementNS(SVG_NAMESPACE, 'text');
    this.text.innerHTML = seqNo;
    this.text.setAttribute('text-anchor', 'middle');

    // Append now, so we can measure text width and center accordingly
    const g = this.container.firstChild;

    g.appendChild(box);
    g.appendChild(this.text);

    // Set initial scale
    g.setAttribute('transform', `scale(${initialScale})`);

    this.shape.appendChild(this.container);

    this.text.setAttribute('x', -18);
    this.text.setAttribute('y',  18);        
  }

  setValue = seqNo =>
    this.text.innerHTML = seqNo;

  destroy = () => {
    this.container.parentNode.removeChild(this.container);
  }

}