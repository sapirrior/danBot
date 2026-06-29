/**
 * Tokenizes a raw arg string, respecting single and double quoted groups.
 *
 * parseArgs('hello "world foo" bar')  →  ['hello', 'world foo', 'bar']
 * parseArgs("it's 'a test' ok")       →  ["it's", 'a test', 'ok']
 *
 * @param {string} raw  — p.rawArgs from the command param
 * @returns {string[]}
 */
export function parseArgs(raw) {
  const args = [];
  let current   = '';
  let inQuote   = false;
  let quoteChar = '';

  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];

    if (inQuote) {
      if (c === quoteChar) {
        inQuote = false;
      } else {
        current += c;
      }
    } else if (c === '"' || c === "'") {
      inQuote   = true;
      quoteChar = c;
    } else if (c === ' ' || c === '\t') {
      if (current.length > 0) {
        args.push(current);
        current = '';
      }
    } else {
      current += c;
    }
  }

  if (current.length > 0) args.push(current);
  return args;
}
