/** Shorthand +*/
const toArray = arg => Array.isArray(arg) ? arg : [ arg ];

/** Returns the group ID stored in this annotation, if any **/
export const getGroupId = annotation =>
  toArray(annotation.body).find(b => b.purpose === 'grouping')?.value;

/** Returns the sequence number stored in this annotation, if any **/
export const getSequenceNumber = annotation =>
  toArray(annotation.body).find(b => b.purpose === 'ordering')?.value;

/** 
 * TODO we can optimize this later, by adding the groupID as 
 * a data attribute, using a formatter. Depends on 
 * https://github.com/recogito/annotorious/issues/159
 */
export const getShapesForGroup = (id, svg) => 
  Array.from(svg.querySelectorAll('.a9s-annotation'))
    .filter(shape => getGroupId(shape.annotation) === id);

/** Immutably sets the groupId in the given annotation **/
export const setGroup = (annotation, groupId, seqNo) => {
  // Always add group ID
  const toAdd = [{ type: 'TextualBody', purpose: 'grouping', value: groupId }];
  
  // Add sequence number, if any
  if (seqNo !== null)
    toAdd.push({ type: 'TextualBody', purpose: 'ordering', value: seqNo });

  return {
    ...annotation,
    body: [
      // Remove existing group bodies first, if any
      ...toArray(annotation.body).filter(b => b.purpose != 'grouping' && b.purpose != 'ordering'),
      ...toAdd
    ]
  };
}

/** Immutably removes the groupId body (if any) **/
export const clearGroup = annotation => ({
  ...annotation,
  body: [
    ...toArray(annotation.body).filter(b =>
      b.purpose != 'grouping' && b.purpose != 'ordering')
  ]
});