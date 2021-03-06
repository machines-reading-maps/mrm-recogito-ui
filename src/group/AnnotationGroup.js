import GroupBorder from './GroupBorder';
import OrderingLabel from './OrderingLabel';
import { addClass, removeClass } from './SVG';
import { getGroupId, getSequenceNumber, getShapesForGroup } from './Utils';

const currentScale = viewer => {
  const containerWidth = viewer.viewport.getContainerSize().x;
  const zoom = viewer.viewport.getZoom(true);
  return viewer.world.getContentFactor() / (zoom * containerWidth);
}

export default class AnnotationGroup {

  constructor(selectedAnnotation, svg, viewer, gigapixelMode) {
    this.id = getGroupId(selectedAnnotation);

    this.viewer = viewer;

    this.gigapixelMode = gigapixelMode;

    this.shapes = getShapesForGroup(this.id, svg);

    this.shapes.forEach(s => addClass(s, 'a9s-group-selected'));
    
    // For new groups, this.shapes will be empty, because
    // the group info is not stored in the DOM elemnet yet!
    if (this.shapes.length == 0)
      this.shapes = [ svg.querySelector(`.a9s-annotation.selected`) ];

    // Group ID before and after, by annotation ID
    this.changes = {
      // [annotationId]: { 
      //  before: { groupId: ..., seqNo: ... }, 
      //  after: { groupId: ..., seqNo: ... }
      // }
    };

    // Sequence no. labels, if any
    this.labels = {};
  
    // Group is ordered if ALL annotations have a sequence no.
    this.isOrdered = this.shapes.every(s => getSequenceNumber(s.annotation));

    if (this.isOrdered)
      this.showLabels();

    this.border = new GroupBorder(this.shapes, svg);
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
  toggle = shape => {
    const exists = this.shapes.indexOf(shape) > -1;
    if (exists) {
      // Annotation is part of the group -> remove
      this.removeFromGroup(shape);
    } else {
      // Otherwise -> add
      this.addToGroup(shape);
    }
  }

  addToGroup = shape => {
    this.shapes = [ ...this.shapes, shape ];

    addClass(shape, 'a9s-group-selected');

    const { annotation } = shape;
    const seqNo = this.isOrdered ? this.shapes.length : null;

    this.changes[annotation.id] = 
      { 
        before: {
          groupId: getGroupId(annotation),
          seqNo: getSequenceNumber(annotation)
        },
        after: {
          groupId: this.id,
          seqNo 
        }
      };

    // Add label for the new shape
    if (this.isOrdered) {
      // Bit of an unfortunate consequence of hijacking the
      // formatter element mechanism to implement ordering labels
      const initialScale = this.gigapixelMode ? 1 : currentScale(this.viewer);
      this.labels[annotation.id] = new OrderingLabel(shape, seqNo, initialScale);
    }

    this.border.draw(this.shapes);
  }

  setOrdering = (annotation, seqNo) => {
    if (seqNo === this.getOrdering(annotation))
      return; // No change

    const change = this.changes[annotation.id];
    if (change) {
      // Just update the existing change
      change.after.seqNo = seqNo
    } else {
      this.changes[annotation.id] = {
        before: {
          groupId: getGroupId(annotation),
          seqNo: getSequenceNumber(annotation)
        },
        after: {
          groupId: this.id,
          seqNo
        }
      }
    }

    // Update label
    this.labels[annotation.id].setValue(seqNo);
  }

  moveUp = annotation => {    
    if (this.isOrdered) {
      // The annotation's current seqNo. 
      const seqNo = this.getOrdering(annotation);
      
      // Updated seqNo.
      const updated = seqNo === this.size ?
        1 : seqNo + 1;

      // The annotation changes place with the one 'above' it
      const toSwap = this.findAnnotationByOrdering(updated);
      this.setOrdering(annotation, updated);
      this.setOrdering(toSwap, seqNo);
    }
  }

  moveDown = annotation => {
    if (this.isOrdered) {
      // The annotation's current seqNo. 
      const seqNo = this.getOrdering(annotation);
      
      // Updated seqNo.
      const updated = seqNo === 1 ?
        this.size : seqNo - 1;

      // The annotation changes place with the one 'above' it
      const toSwap = this.findAnnotationByOrdering(updated);
      this.setOrdering(annotation, updated);
      this.setOrdering(toSwap, seqNo);
    }
  }

  removeFromGroup = shape => {
    this.shapes = this.shapes.filter(s => 
      s.annotation.id != shape.annotation.id);

    removeClass(shape, 'a9s-group-selected');

    // Removed annotation
    const { annotation } = shape;

    // Sequence number of removed annotation
    const removedSeqNo = this.getOrdering(annotation);
    
    // Update changes list with removal
    this.changes[annotation.id] = 
      { 
        before: { 
          groupId: getGroupId(annotation), 
          seqNo: getSequenceNumber(annotation)
        },
        after: null 
      };

    if (this.isOrdered) {
      // Re-arrange sequence
      this.shapes.forEach(shape => {
        const seqNo = this.getOrdering(shape.annotation);
        if (seqNo > removedSeqNo)
          this.setOrdering(shape.annotation, seqNo - 1);
      });

      // Delete label
      this.labels[annotation.id].destroy();
      delete this.labels[annotation.id];
    }

    this.border.draw(this.shapes);
  }

  clearGroup = () => {
    this.hideLabels();
    [...this.shapes].forEach(s => this.removeFromGroup(s));
  }

  redraw = () =>
    this.border?.redraw();
  
  /** En- or disables ordering for this group **/
  setOrdered = ordered => {
    this.isOrdered = ordered;
        
    // TODO make smarter
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

    if (ordered)
      this.showLabels();
    else
      this.hideLabels();
  }

  destroy = () => {
    this.hideLabels();
    this.shapes.forEach(s => removeClass(s, 'a9s-group-selected'));
    this.border?.destroy();
  }

  getOrdering = annotation =>
    this.changes[annotation.id]?.after?.seqNo || getSequenceNumber(annotation);

  findAnnotationByOrdering = ordering => 
    this.shapes.find(s => this.getOrdering(s.annotation) === ordering)?.annotation;

  showLabels = () => {
    this.shapes.forEach(s => {
      const { annotation } = s;
      
      const seqNo = this.changes[annotation.id]?.after?.seqNo || getSequenceNumber(annotation);

      const initialScale = this.gigapixelMode ? 1 : currentScale(this.viewer);
      this.labels[annotation.id] = new OrderingLabel(s, seqNo, initialScale);
    });
  }

  hideLabels = () => {
    for (const id in this.labels) {
      this.labels[id].destroy();
    }

    this.labels = {};
  }

}