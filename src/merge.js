// import { BooleanOperations, polygon} from '@flatten-js/core';
import concaveman from 'concaveman';

export const merge = (annotations, anno) => {

  // Deselect all
  anno.selectAnnotation();

  const isPolygon = annotation => {
    const selector = annotation.selector('SvgSelector');
    if (selector)
      return selector.value?.match(/^<svg.*<polygon/g);
  }

  const isPolyLine = annotation => {
    const selector = annotation.selector('SvgSelector');
    if (selector)
      return selector.value?.match(/^<svg.*<path/g);
  }

  const isValid = annotations.every(annotation => isPolygon(annotation) || isPolyLine(annotation));

  if (isValid && annotations.length > 1) {
    
    const points = annotations.reduce((all, annotation) => {
      if (isPolygon(annotation)) {
        const [a, b, str] = annotation.selector('SvgSelector').value.match(/(<polygon points=['"])([^('|")]*)/) || [];
        return [...all, ...str.split(' ').map((p) => p.split(',').map(parseFloat)) ];
      } else {
        const [a, b, str] = annotation.selector('SvgSelector').value.match(/(<path d=['"])([^('|")]*)/) || [];

        const points = str.split(/[ML]/)
          .map(str => str.trim())
          .filter(str => str)
          .map(str => str.split(' ').map(parseFloat));

        return [...all, ...points];
      }

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