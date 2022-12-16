import Fuse from 'fuse.js';
import diacritics from 'diacritics';

export class SearchIndex {

  constructor(anno, initialAnnotations) {
    this.index = new Fuse([], {
      ignoreLocation: true,
      threshold: 0.25,
      keys: [
        'transcription',
        'comments'
      ],

      getFn: (obj, path) => {
        const value = Fuse.config.getFn(obj, path);

        if (Array.isArray(value)) {
          return value.map(diacritics.remove);
        } else if (value) {
          return diacritics.remove(value);
        }
      }
    });

    anno.on('createAnnotation', this.add);
    anno.on('updateAnnotation', this.update);
    anno.on('deleteAnnotation', this.delete);

    [...initialAnnotations].forEach(this.add);
  }

  add = annotation => {
    const body = Array.isArray(annotation.body) ? annotation.body : [ annotation.body ];

    // Pull out searchable fields for easier access
    const transcription = body.find(b => b.purpose === 'transcribing')?.value;
    const comments = body.filter(b => b.purpose === 'commenting' || !b.purpose).map(b => b.value);

    const document = { transcription, comments, annotation };
    this.index.add(document);
  }

  update = (annotation, previous) => {
    this.delete(previous);
    this.add(annotation);
  }

  delete = annotation => {
    this.index.remove(doc => doc.annotation.id === annotation.id);
  }
  
  search = query => {
    const result = this.index.search(diacritics.remove(query));
    console.log(result);
  }

}