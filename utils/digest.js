const { createHash } = require('crypto');

const hashLength = 10;

function digestNode(str) {
  return createHash('sha256')
    .update(str)
    .digest('hex')
    .substring(0, hashLength);
}

async function digestBrowser(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('') // convert bytes to hex string
    .slice(0, hashLength);
  return hashHex;
}

module.exports = { digestNode, digestBrowser };