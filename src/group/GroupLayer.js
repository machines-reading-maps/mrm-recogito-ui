const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const getGroupBounds = (shapes, svg) => {
  const svgBounds = svg.getBoundingClientRect();

  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  
  shapes.forEach(s => {
    // Note that we can't use getBBox() because it doesn't take transforms into account
    const shapeBounds = s.getBoundingClientRect();

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
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

export default class GroupLayer {

  constructor(svg) {
    this.svg = svg;

    this.g = document.createElementNS(SVG_NAMESPACE, 'g');
    this.g.setAttribute('class', 'a9s-grouplayer');

    // The rectangle shape bounding the group - initialized on first drawGroup
    this.rect = null;

    // Current group, if any (so we can redraw when needed)
    this.shapes = [];

    this.svg.insertBefore(this.g, svg.firstChild);
  }

  // Draw a group around the given SVG shapes
  drawGroup(shapes) {
    if (shapes)
      this.shapes = shapes;

    if (this.shapes.length > 0) {
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
    }
  }

  redraw() {
    this.drawGroup();
  }

  clear() {
    if (this.rect) {
      this.g.removeChild(this.rect);
      this.rect = null;
    }

    this.shapes = [];
  }

  destroy() {
    this.svg.removeChild(this.g);

    this.rect = null;
    this.g = null;
  }

}