function numUniqueChars(str) {
  return new Set(str.split('')).size
}

module.exports = { numUniqueChars };