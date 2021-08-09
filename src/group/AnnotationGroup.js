import GroupBorder from './GroupBorder';
import { getGroupId, getShapesForGroup } from './Utils';

export default class AnnotationGroup {

  constructor(selectedAnnotation, svg) {
    this.id = getGroupId(selectedAnnotation);
    this.shapes = getShapesForGroup(this.id, svg);
    
    // For new groups, this.shapes will be empty, because
    // the group info is not stored in the DOM elemnet yet!
    if (this.shapes.length == 0) {
      this.shapes = [ svg.querySelector(`.a9s-annotation.selected`) ];
    }

    this.border = new GroupBorder(this.shapes, svg);

    // Group ID before and after, by annotation ID
    this.changes = {
      // [annotationId]: { before: ..., after: }
    };
  }

  get size() {
    return this.shapes.length;
  }

  /** 
   * Adds the given annotation to the group if it's not yet
   * part of it, removes otherwise.
   */
  toggle(shape) {
    const exists = this.shapes.indexOf(shape) > -1;
    if (exists) {
      // Annotation is part of the group -> remove
      this.removeFromGroup(shape);
    } else {
      // Otherwise -> add
      this.addToGroup(shape);
    }
  }

  addToGroup(shape) {
    this.shapes = [ ...this.shapes, shape ];

    this.changes[shape.annotation.id] = 
      { before: getGroupId(shape.annotation), after: this.id };

    this.border.draw(this.shapes);
  }

  removeFromGroup(shape) {
    this.shapes = this.shapes.filter(s => 
      s.annotation.id != shape.annotation.id);

    // Add to changes list
    this.changes[shape.annotation.id] = 
      { before: getGroupId(shape.annotation), after: null };

    this.border.draw(this.shapes);
  }

  redraw() {
    this.border?.redraw();
  }

  destroy() {
    this.border?.destroy();
  }

}