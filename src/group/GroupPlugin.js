import { nanoid } from 'nanoid';
import GroupLayer from './GroupLayer';

import './GroupPlugin.scss';

/** Shorthand +*/
const toArray = arg => Array.isArray(arg) ? arg : [ arg ];

/** Returns the group ID stored in this annotation, if any **/
const getGroupId = annotation =>
  toArray(annotation.body).find(b => b.purpose === 'grouping')?.value;

/** Immutably sets the groupId in the given annotation **/
const setGroupId = (annotation, groupId) => (
  {
    ...annotation,
    body: [
      // Remove existing groupig bodies first, if any
      ...toArray(annotation.body).filter(b => b.purpose != 'grouping'),
      { type: 'TextualBody', purpose: 'grouping', value: groupId }
    ]
  }
);

/** Immutably removes the groupId body (if any) **/
const clearGroupId = annotation => (
  {
    ...annotation,
    body: [
      ...toArray(annotation.body).filter(b => b.purpose != 'grouping')
    ]
  }
);

/** 
 * TODO we can optimize this later, by adding the groupID as 
 * a data attribute, using a formatter. Depends on 
 * https://github.com/recogito/annotorious/issues/159
 */
const getShapesForGroup = (id, svg) => 
  Array.from(svg.querySelectorAll('.a9s-annotation'))
    .filter(shape => getGroupId(shape.annotation) === id);

const LinkingPlugin = (anno, viewer) => {

  const svg = anno._element.querySelector('svg');

  const groupLayer = new GroupLayer(svg);

  let isCtrlDown = false;

  let currentGroupId = null;

  let currentGroup = [];

  let queuedUpdates = [];

  const onOSDChanged = () => groupLayer.redraw();

  if (viewer) {
    viewer.addHandler('animation', onOSDChanged);
    viewer.addHandler('rotate', onOSDChanged);
    viewer.addHandler('resize', onOSDChanged);
    viewer.addHandler('flip', onOSDChanged);
  }

  document.addEventListener('keydown', evt => {
    if (evt.which === 17) { // CTRL
      isCtrlDown = true;
      anno.disableSelect = true;
    }
  });

  document.addEventListener('keyup', evt => {
    if (evt.which === 17) { // CTRL
      isCtrlDown = false;
      anno.disableSelect = false;
    }
  });

  anno.on('changeSelectionTarget', () => groupLayer.redraw());

  const clear = () => {
    groupLayer.clear();
    currentGroup = null;
    currentGroupId = null;
  }

  // Could be simplified with https://github.com/recogito/annotorious/issues/160
  anno.on('cancelSelected', clear);
  anno.on('createAnnotation', clear);
  anno.on('updateAnnotation', clear);
  anno.on('deleteAnnotation', clear);

  // A new selection - part of a group? Highlight!
  anno.on('selectAnnotation', annotation => {
    currentGroupId = getGroupId(annotation);
    if (currentGroupId) {
      currentGroup = getShapesForGroup(currentGroupId, svg);
      groupLayer.drawGroup(currentGroup);
    }
  });

  anno.on('clickAnnotation', (annotation, shape) => {
    if (isCtrlDown) {
      // Multi-select!
      const currentSelected = anno.getSelected(); // if any

      if (currentSelected) {
        // There is already a selection - add or remove
        const selectedShape = svg.querySelector(`.a9s-annotation.selected`);

        // Group ID stored in the current selection (if any)
        currentGroupId = getGroupId(currentSelected);

        // Group ID stored in the CTRL-clicked annotation (if any)
        const clickedGroupId = getGroupId(annotation);

        if (currentGroupId) {
          let updatedClicked;

          if (currentGroupId === clickedGroupId) {
            // If the clicked annotation is in the same group: remove
            updatedClicked = clearGroupId(annotation);
            currentGroup = currentGroup.filter(shape => shape.annotation.id != annotation.id);
          } else {
            // otherwise: add to this group
            updatedClicked = setGroupId(annotation, currentGroupId);
            currentGroup = [ ...currentGroup, shape ];
          }

          // ...but persist only if the user hits ok
          const onOk = () => {
            anno.addAnnotation(updatedClicked);
            anno._emitter.emit('updateAnnotation', updatedClicked);
          }

          anno.once('createAnnotation', onOk);
          anno.once('updateAnnotation', onOk);      
        } else {
          console.log('creating new group');

          // No annotation is in a group - create new
          currentGroupId = nanoid();
          currentGroup = [ selectedShape, shape ];

          const updatedSelected = setGroupId(currentSelected, currentGroupId);
          const updatedClicked = setGroupId(annotation, currentGroupId);

          // Update selection
          anno.updateSelected(updatedSelected);

          // If user hits ok, also persist the change to the clicked annotation
          const onOk = () => {
            anno.addAnnotation(updatedClicked);
            anno._emitter.emit('updateAnnotation', updatedClicked);
          };
        }

        // Draw the group now...
        groupLayer.drawGroup(currentGroup);
      } else {
        // There was no current selection - this is the first selection of the pair
        anno.selectAnnotation(annotation);
      }
    }
  });

}

export default LinkingPlugin;