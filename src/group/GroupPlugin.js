import { nanoid } from 'nanoid';

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

const LinkingPlugin = anno => {

  let isCtrlDown = false;

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

  /**
   * TODO handle GROUP REMOVAL!
   */

  anno.on('clickAnnotation', annotation => {
    if (isCtrlDown) {
      // Multi-select!
      const currentSelected = anno.getSelected(); // if any
      if (currentSelected) {
        // Group ID stored in the current selection (if any)
        const selectedGroupId = getGroupId(currentSelected);

        // Group ID stored in the CTRL-clicked annotation (if any)
        const clickedGroupId = getGroupId(annotation);

        if (selectedGroupId) {
          // Selected group takes precedence! If the
          // clicked annotation already has a group, it will
          // be re-associated
          const updatedClicked = setGroupId(annotation, selectedGroupId);

          // If user hits ok, persist the change to the clicked annotation
          const onOk = () => {
            anno.addAnnotation(updatedClicked);
            anno._emitter.emit('updateAnnotation', updatedClicked);
          }

          anno.once('createAnnotation', onOk);
          anno.once('updateAnnotation', onOk);
        } else if (clickedGroupId) {
          // Selected annotation has no group, but CTRL-clicked one
          // does -> associated selected annotation with the clicked one's
          const updatedSelected = setGroupId(currentSelected, clickedGroupId);

          // Update annotation...
          anno.updateSelected(updatedSelected);          
        } else {
          // No annotation is in a group - create new
          const groupId = nanoid();

          const updatedSelected = setGroupId(currentSelected, groupId);
          const updatedClicked = setGroupId(annotation, groupId);

          // Update selection
          anno.updateSelected(updatedSelected);

          // If user hits ok, also persist the change to the clicked annotation
          const onOk = () => {
            anno.addAnnotation(updatedClicked);
            anno._emitter.emit('updateAnnotation', updatedClicked);
          };

          anno.once('createAnnotation', onOk);
          anno.once('updateAnnotation', onOk);
        }
      } else {
        // There was no current selection - this is the first selection of the pair
        anno.selectAnnotation(annotation);
      }
    }
  });

}

export default LinkingPlugin;