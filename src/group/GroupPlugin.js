import { nanoid } from 'nanoid';
import Emitter from 'tiny-emitter';

import AnnotationGroup from './AnnotationGroup';
import { clearGroup as _clearGroup, getGroupId, setGroup } from './Utils';
import GroupWidget from './GroupWidget';

import './GroupPlugin.scss';

let isRequireCtrlKey = true;

export default class GroupPlugin extends Emitter {

  constructor(anno, viewer, IS_WMTS) {
    super();
    
    this.anno = anno;

    this.viewer = viewer;

    this.IS_WMTS = IS_WMTS;

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

      if (evt.key === 'm') {
        if (this.isCtrlDown && this.group?.shapes.length > 1) {
          const annotations = this.group.shapes.map(s => s.annotation);

          this.group.destroy();
          this.group = null;
    
          this.requireCtrlKey = true;

          this.emit('merge', annotations);
        }
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
        this.group = new AnnotationGroup(annotation, this.svg, this.viewer, this.IS_WMTS);
        this.emit('selectGroup', this.group);
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
        const updated = setGroup(selectedAnnotation, nanoid(), null);
        this.anno.updateSelected(updated);

        this.group?.destroy();
        this.group = new AnnotationGroup(updated, this.svg, this.viewer, this.IS_WMTS);
      }

      this.group.toggle(shape);
      this.emit('changeGroup', this.group);

      if (this.group.size === 1) {
        // Group was reduced to one element - remove ID from selected annotation
        const updated = _clearGroup(selectedAnnotation);
        this.anno.updateSelected(updated);
      } else if (getGroupId(selectedAnnotation) !== this.group.id) {
        const seqNo = this.group.isOrdered ? this.group.size - 1 : null;
        const updated = setGroup(selectedAnnotation, this.group.id, seqNo);
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
    const hasChanged = (before, after) => 
      before?.groupId !== after?.groupId || before?.seqNo !== after?.seqNo;

    if (this.group) {
      for (let id in this.group.changes) {
        const { before, after } = this.group.changes[id];
        
        if (hasChanged(before, after)) {
          // There's a tricky problem in WMTS mode: getAnnotationById returns a crosswalked
          // version of the annotation (geo-coordinates). If we emit this annotation
          // in the 'updateAnnotation' event, it will be crosswalked again - resulting
          // in mangled coordiantes. Therefore, we need to treat both cases
          // differently
          if (this.IS_WMTS) {
            const annotationBeforeImg = this.anno.getAnnotationById(id, true);
            const annotationBeforeGeo = this.anno.getAnnotationById(id);

            if (annotationBeforeImg) {
              const annotationAfterImg = after ? 
                setGroup(annotationBeforeImg, after.groupId, after.seqNo) : _clearGroup(annotationBeforeImg);

              const annotationAfterGeo = after ? 
                setGroup(annotationBeforeGeo, after.groupId, after.seqNo) : _clearGroup(annotationBeforeGeo);

              this.anno.addAnnotation(annotationAfterGeo);
              this.anno._emitter.emit('updateAnnotation', annotationAfterImg, annotationBeforeImg);   
            }
          } else {
            const annotationBefore = this.anno.getAnnotationById(id);
            if (annotationBefore) {
              const annotationAfter = after ? 
                setGroup(annotationBefore, after.groupId, after.seqNo) : _clearGroup(annotationBefore);

              this.anno.addAnnotation(annotationAfter);
              this.anno._emitter.emit('updateAnnotation', annotationAfter, annotationBefore);   
            }
          }
          
          this.requireCtrlKey = true;
        }
      }
    }
  }

  clearGroup() {
    this.group.clearGroup();

    const selected = this.anno.getSelected();
    this.anno.updateSelected(_clearGroup(selected));
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
