import { SVG_NAMESPACE } from './SVG';

const isFirefox = /firefox/i.test(navigator.userAgent);

const createContainer = bounds => {
  const { x, y, width, height } = bounds;

  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('class', 'a9s-formatter-el');
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

  return svg;
}

export default class OrderingLabel {

  constructor(shape) {
    const inner = shape.querySelector('.a9s-inner');
    
    this.group = shape;
    this.element = createContainer(inner.getBBox());

    const text = document.createElementNS(SVG_NAMESPACE, 'text');
    text.innerHTML = '1';

    this.element.appendChild(text);
    
    // this.group.appendChild(this.element);

    text.setAttribute('x', 0);
    text.setAttribute('y', 0);
  }

}