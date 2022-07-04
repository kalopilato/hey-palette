/**
 * A very naive utility to convert a given string to SentenceCase
 * @param string the string value to convert to SentenceCase
 * @returns The string value converted to SentenceCase
 */
function sentenceCase(string: String): String {
  return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}

export {
  sentenceCase
}