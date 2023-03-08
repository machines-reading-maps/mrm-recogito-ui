// import { BooleanOperations, polygon} from '@flatten-js/core';
import concaveman from 'concaveman';

export const merge = (annotations, anno) => {

  // Deselect all
  anno.selectAnnotation();

  const onlyPolygons = annotations.every(annotation => {
    const selector = annotation.selector('SvgSelector');
    if (selector)
      return selector.value?.match(/^<svg.*<polygon/g);
  });

  console.log('merging. only polygons?', onlyPolygons);

  if (onlyPolygons && annotations.length > 1) {
    const points = annotations.reduce((points, annotation) => {
      const [a, b, str] = annotation.selector('SvgSelector').value.match(/(<polygon points=['"])([^('|")]*)/) || [];

      return [...points, ...str.split(' ').map((p) => p.split(',').map(parseFloat)) ];
    }, []);

    const merged = concaveman(points);

    const svg = `<svg><polygon points="${merged.map(t => `${t[0]},${t[1]}`).join(' ')}" /></svg>`;

    const original = annotations[0].underlying;
    
    const updated = {
      ...original,
      target: {
        ...original.target,
        selector: {
          ...original.target.selector,
          value: svg
        }
      }
    }

    const [ first, ...rest ] = annotations;
    
    // Delete all except first
    rest.forEach(a => {
      anno.removeAnnotation(a);
      anno._emitter.emit('deleteAnnotation', a);   
    });

    // Update first
    anno.addAnnotation(updated);  
    anno._emitter.emit('updateAnnotation', updated, original);
  }
}