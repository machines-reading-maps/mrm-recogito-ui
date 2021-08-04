const addLinkBody = (annotation, targetId) => {
  const bodies = Array.isArray(annotation.body) ? annotation.body : [ annotation.body ];

  const linkExists = bodies.find(b => b.purpose === 'linking' && b.id === targetId);
  if (linkExists) {
    return annotation; // No change
  } else {
    return {
      ...annotation,
      body: [ ...bodies, { purpose: 'linking', id: targetId } ]
    }
  }
}

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

  anno.on('clickAnnotation', annotation => {
    if (isCtrlDown) {
      // Multi-select!
      const currentSelected = anno.getSelected(); // if any
      if (currentSelected) {
        // Add a link body to the first selected, pointing to the second...
        const updatedFirst = addLinkBody(currentSelected, annotation.id); 
        
        // ...and vice versa
        const updatedSecond = addLinkBody(annotation, currentSelected.id);

        // Update the annotation layer
        anno.updateSelected(updatedFirst);
        anno.addAnnotation(updatedSecond);

        // Fire update events
        // anno._emitter.emit('updateAnnotation', updatedFirst);
        // anno._emitter.emit('updateAnnotation', updatedSecond);
      } else {
        // There was no current selection - this is the first selection of the pair
        anno.selectAnnotation(annotation);
      }
    }
  });

}

export default LinkingPlugin;