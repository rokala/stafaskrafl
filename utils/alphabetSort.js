const alphabetIndex = {};
'AÁBDÐEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÖ'.split('').forEach((char, idx) => alphabetIndex[char] = idx+1);

export const compareIcelandic = function (a, b) {
  // same word? exit early
  const al = a.length;
  const bl = b.length;
  // char by char evaluation
  const l = Math.min(al, bl);
  let c = -1;
  while (++c < l) {
    const aV = alphabetIndex[a[c]];
    const bV = alphabetIndex[b[c]];
    // because alphabetIndex has a 1 based index, any falsy value means "undefined" character
    if (!aV || !bV) {
      // either char is not defined: we can JS sort them
      if (a[c] < b[c]) { return -1; }
      return a[c] > b[c] ? 1 : 0;
    }
    else if (aV !== bV) {
      // it's not the same char, go by value
      return aV - bV;
    }
  }
  return al - bl;
};

export const compareNone = function (a,b) {
  return 0;
}