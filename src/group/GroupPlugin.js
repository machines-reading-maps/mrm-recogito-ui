import { nanoid } from 'nanoid';
import Emitter from 'tiny-emitter';

import AnnotationGroup from './AnnotationGroup';
import { clearGroupId, getGroupId, setGroupId } from './Utils';
import GroupWidget from './GroupWidget';

import './GroupPlugin.scss';

let isRequireCtrlKey = true;

export default class GroupPlugin extends Emitter {

  constructor(anno, viewer) {
    super();
    
    this.anno = anno;

    this.svg = anno._element.querySelector('svg');

    this.isCtrlDown = false;

    this.group = null;

    if (viewer)
      this._initOSD(viewer);

    this._addKeyListeners();
    this._addAnnoListeners();

    anno.widgets = [...anno.widgets, GroupWidget(this) ]; 
  }

  _initOSD(viewer) {
    const onOSDChanged = () => this.group?.redraw();

    if (viewer) {
      viewer.addHandler('animation', onOSDChanged);
      viewer.addHandler('rotate', onOSDChanged);
      viewer.addHandler('resize', onOSDChanged);
      viewer.addHandler('flip', onOSDChanged);
    }  
  }

  _addKeyListeners() {
    document.addEventListener('keydown', evt => {
      if (evt.which === 17) { // CTRL
        this.isCtrlDown = true;
        this.anno.disableSelect = true;
      }
    });
  
    document.addEventListener('keyup', evt => {
      if (evt.which === 17) { // CTRL
        this.isCtrlDown = false;
        this.anno.disableSelect = !isRequireCtrlKey;
      }
    });  
  }

  _addAnnoListeners() {
    // Redraw when shapes are moved/resized
    this.anno.on('changeSelectionTarget', () => this.group?.redraw());

    const clearGroup = () => {
      this.group?.destroy();
      this.group = null;

      this.requireCtrlKey = true;
    }
  
    // Just destroy the group on cancel or delete
    this.anno.on('cancelSelected',   clearGroup);
    this.anno.on('deleteAnnotation', clearGroup);

    const onSelect = annotation => {
      // If the annotation is part of a group, show it.
      const groupId = getGroupId(annotation);
      if (groupId) {
        this.group = new AnnotationGroup(annotation, this.svg);

        this.emit('selectGroup', this.group.annotations);
      }

      const removeHandlers = () => {
        this.anno.off('createAnnotation', onOk);
        this.anno.off('updateAnnotation', onOk);
        this.anno.off('cancelSelected', onOk);
        this.anno.off('deleteAnnotation', onOk);
      }
  
      // In any case, persist potential updates when user click OKs
      const onOk = selected => {
        this.handleOk();
        clearGroup();
      };
  
      if (annotation.type === 'Selection') {
        this.anno.once('createAnnotation', onOk);  
      } else {
        this.anno.once('updateAnnotation', onOk);
      }

      // Remove handlers on cancel and delete
      this.anno.once('cancelSelected', removeHandlers);
      this.anno.once('deleteAnnotation', removeHandlers);
    };

    this.anno.on('clickAnnotation', (annotation, shape) => {      
      if (this.isCtrlDown || !isRequireCtrlKey) {
        // Multi-select!
        const currentSelected = this.anno.getSelected(); // if any
  
        if (currentSelected) {
          this.handleCtrlClick(shape);
        } else {
          // There was no current selection - this is the first selection of the pair
          this.anno.selectAnnotation(annotation);
          setTimeout(() => onSelect(annotation), 10);
        }
      }
    });

    // On select, draw existing group, if anyand attach OK handlers
    this.anno.on('selectAnnotation', onSelect);
    this.anno.on('createSelection', onSelect);
  }

  /** 
   * Handles CTRL+click on an annotation while there is 
   * already a selection
   */
  handleCtrlClick(shape) {
    const selectedAnnotation = this.anno.getSelected();

    // Ignore CTRL+click on selected annotation
    if (shape.annotation.id !== selectedAnnotation.id) {
      const existingGroupId = getGroupId(selectedAnnotation);
      if (!existingGroupId) {
        // If the selection is not part of a group, create one
        const updated = setGroupId(selectedAnnotation, nanoid());
        this.anno.updateSelected(updated);

        this.group?.destroy();
        this.group = new AnnotationGroup(updated, this.svg);
      }

      this.group.toggle(shape);
      this.emit('changeGroup', this.group.annotations);

      if (this.group.size === 1) {
        const updated = clearGroupId(selectedAnnotation);
        this.anno.updateSelected(updated);
      } else if (getGroupId(selectedAnnotation) !== this.group.id) {
        const updated = setGroupId(selectedAnnotation, this.group.id);
        this.anno.updateSelected(updated);
      }
    }
  }

  /** 
   * When the user hits OK, this method applies 
   * changes to the annotations that were affected besides
   * the current selection (i.e. those that were CTRL+clicked)
   */
  handleOk() {
    if (this.group) {
      for (let id in this.group.changes) {
        const { before, after } = this.group.changes[id];
        if (before != after) {
          const annotationBefore = this.anno.getAnnotationById(id);

          const annotationAfter = after ? 
            setGroupId(annotationBefore, after) : clearGroupId(annotationBefore);

          this.anno.addAnnotation(annotationAfter);
          this.anno._emitter.emit('updateAnnotation', annotationAfter, annotationBefore);   
          
          this.requireCtrlKey = true;
        }
      }
    }
  }

  clearGroup() {
    this.group.clearGroup();

    const selected = this.anno.getSelected();
    this.anno.updateSelected(clearGroupId(selected));
  }

  get requireCtrlKey() {
    return isRequireCtrlKey;
  }

  set requireCtrlKey(require) {
    isRequireCtrlKey = require;
    this.anno.disableSelect = !require || this.isCtrlDown;
  }

  /** En- or disables ordering for this group (if any) **/
  setOrdered(ordered) {
    if (this.group)
      this.group.setOrdered(ordered);
  }

}
