const { createHash } = require('crypto');

const hashLength = 7;

function digestNode(str) {
  return createHash('sha1')
    .update(str)
    .digest('base64')
    .substring(0, hashLength);
}

async function digestBrowser(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8); // hash the message
  return btoa(
    new Uint8Array(hashBuffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  ).substring(0, hashLength);
}

module.exports = { digestNode, digestBrowser };