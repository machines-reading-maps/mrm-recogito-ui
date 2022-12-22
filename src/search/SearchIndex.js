import Fuse from 'fuse.js';
import diacritics from 'diacritics';

export class SearchIndex {

  constructor(anno, storage, initialAnnotations) {
    this.index = new Fuse([], {
      ignoreLocation: true,
      includeMatches: true,
      threshold: 0.25,
      keys: [
        'transcription',
        'comments',
        'tags'
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
    
    // Listen to anno changes...
    anno.on('updateAnnotation', this.update);

    // ...and anno deletes.
    anno.on('deleteAnnotation', this.delete);

    // But grab create events from the storage plugin, 
    // because this will return the annotation with the
    // server-side ID already inserted!
    storage.afterCreate(this.add);

    [...initialAnnotations].forEach(this.add);
  }

  add = annotation => {
    const body = Array.isArray(annotation.body) ? annotation.body : [ annotation.body ];

    // Pull out searchable fields for easier access
    const transcription = body.find(b => b.purpose === 'transcribing')?.value;
    const comments = body.filter(b => b.purpose === 'commenting' || !b.purpose).map(b => b.value);
    const tags = body.filter(b => b.purpose === 'tagging').map(b => b.value);

    const document = { transcription, comments, tags, annotation };
    this.index.add(document);
  }

  update = (annotation, previous) => {
    this.delete(previous);
    this.add(annotation);
  }

  delete = annotation => {
    this.index.remove(doc => doc.annotation.id === annotation.id);
  }
  
  search = query =>
    this.index.search(diacritics.remove(query));

}