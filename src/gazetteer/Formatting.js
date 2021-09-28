/** Formats a yyyyMMddToYear to YYYY [Era] **/
export const yyyyMMddToYear = str => {
  const era = (str.indexOf('-') === 0) ? ' BC' : '';
  const year = (str.indexOf('-') === 0) ?
    str.substring(1, str.indexOf('-', 1)) :
    str.substring(0, str.indexOf('-'));

  return parseInt(year) + era;
}