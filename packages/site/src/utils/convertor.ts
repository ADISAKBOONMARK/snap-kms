/**
 * Convert the string to hex.
 *
 * @param str - The target string that want to convert.
 * @returns The hex of input.
 */
export function stringToHex(str: string) {
  var hex = '';
  for (var i = 0, l = str.length; i < l; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

/**
 * Convert the hex to string.
 *
 * @param hex - The target hex that want to convert.
 * @returns The string of input.
 */
export function hexToString(hex: string) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
