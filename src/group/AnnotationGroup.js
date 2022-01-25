import GroupBorder from './GroupBorder';
import OrderingLabel from './OrderingLabel';
import { addClass, removeClass } from './SVG';
import { getGroupId, getSequenceNumber, getShapesForGroup } from './Utils';

export default class AnnotationGroup {

  constructor(selectedAnnotation, svg) {
    this.id = getGroupId(selectedAnnotation);
    this.shapes = getShapesForGroup(this.id, svg);

    this.shapes.forEach(s => addClass(s, 'a9s-group-selected'));
    
    // For new groups, this.shapes will be empty, because
    // the group info is not stored in the DOM elemnet yet!
    if (this.shapes.length == 0) {
      this.shapes = [ svg.querySelector(`.a9s-annotation.selected`) ];
    }

    // Group is ordered if ALL annotations have a sequence no.
    this.isOrdered = this.shapes.every(s =>
      getSequenceNumber(s.annotation) !== null);

    this.border = new GroupBorder(this.shapes, svg);

    // Group ID before and after, by annotation ID
    this.changes = {
      // [annotationId]: { 
      //  before: { groupId: ..., seqNo: ... }, 
      //  after: { groupId: ..., seqNo: ... }
      // }
    };
  }

  get size() {
    return this.shapes.length;
  }

  get annotations() {
    return this.shapes.map(s => s.annotation.clone());
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

    addClass(shape, 'a9s-group-selected');

    this.changes[shape.annotation.id] = 
      { 
        before: {
          groupId: getGroupId(shape.annotation),
          seqNo: getSequenceNumber(shape.annotation)
        },
        after: {
          groupId: this.id,
          seqNo: this.isOrdered ? this.shapes.length - 1 : null 
        }
      };

    this.border.draw(this.shapes);
  }

  removeFromGroup(shape) {
    this.shapes = this.shapes.filter(s => 
      s.annotation.id != shape.annotation.id);

    removeClass(shape, 'a9s-group-selected');
    
    // Add to changes list
    this.changes[shape.annotation.id] = 
      { 
        before: { 
          groupId: getGroupId(shape.annotation), 
          seqNo: getSequenceNumber(shape.annotation)
        },
        after: null 
      };

    this.border.draw(this.shapes);
  }

  clearGroup() {
    [...this.shapes].forEach(s => this.removeFromGroup(s));
  }

  redraw() {
    this.border?.redraw();
  }
  
  /** En- or disables ordering for this group **/
  setOrdered(ordered) {
    this.isOrdered = ordered;
    
    const annotations = this.shapes.map(s => s.annotation);

    annotations.forEach((a, idx) => {
      const change = this.changes[a.id];
      if (change) {
        // Mutate change.after.seqNo in place
        change.after.seqNo = ordered ? (idx + 1) : null;
      } else {
        this.changes[a.id] = { 
          before: { groupId: this.id, seqNo: getSequenceNumber(a) },
          after: { groupId: this.id, seqNo: ordered ? (idx + 1) : null }
        }
      }
    });
  }

  destroy() {
    this.shapes.forEach(s => removeClass(s, 'a9s-group-selected'));
    this.border?.destroy();
  }

}