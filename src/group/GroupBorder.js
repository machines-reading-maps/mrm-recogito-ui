import { SVG_NAMESPACE } from './SVG';

const getGroupBounds = (shapes, svg) => {
  const svgBounds = svg.getBoundingClientRect();

  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  
  shapes.forEach(s => {
    const outer = s.querySelector('.a9s-outer');

    // Note that we can't use getBBox() because it doesn't take transforms into account
    const shapeBounds = outer.getBoundingClientRect();

    const x = shapeBounds.x - svgBounds.x;
    const y = shapeBounds.y - svgBounds.y;
    const width = shapeBounds.width;
    const height = shapeBounds.height;

    if (x < minX)
      minX = x;

    if (y < minY)
      minY = y;

    if (x + width > maxX)
      maxX = x + width;

    if (y + height > maxY)
      maxY = y + height;
  });

  return {
    x: minX - 1,
    y: minY - 1,
    width: maxX - minX + 2,
    height: maxY - minY + 2
  };
}

export default class GroupBorder {

  constructor(shapes, svg) {
    this.svg = svg;

    this.g = document.createElementNS(SVG_NAMESPACE, 'g');
    this.g.setAttribute('class', 'a9s-grouplayer');

    // The rectangle shape bounding the group - initialized on first drawGroup
    this.rect = null;

    // Current group, if any (so we can redraw when needed)
    this.shapes = shapes || [];

    this.draw();
  }

  // Draw a group around the given SVG shapes
  draw(shapes) {
    if (shapes)
      this.shapes = shapes;

    if (this.shapes.length > 1) {
      this.visible = true;

      const { x, y, width, height } = getGroupBounds(this.shapes, this.svg);

      // Lazy create
      if (!this.rect) {
        this.rect = document.createElementNS(SVG_NAMESPACE, 'rect');
        this.rect.setAttribute('class', 'a9s-group-border'); 
        this.g.appendChild(this.rect);     
      }

      this.rect.setAttribute('x', x);
      this.rect.setAttribute('y', y);
      this.rect.setAttribute('width', width);
      this.rect.setAttribute('height', height);
    } else {
      this.visible = false;
    }
  }

  redraw() {
    this.draw();
  }

  get visible() {
    return this.g.parentNode;
  }

  set visible(visible) {
    if (visible && !this.visible) {
      this.svg.appendChild(this.g, this.svg.firstChild);
    } else if (!visible && this.visible) {
      this.svg.removeChild(this.g);
    }
  }

  destroy() {
    if (this.visible)
      this.svg.removeChild(this.g);

    this.rect = null;
    this.g = null;
  }

}