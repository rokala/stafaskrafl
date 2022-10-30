export default function shuffle(array) {
  let currIdx = array.length, randIdx;
  // While there remain elements to shuffle.
  while (currIdx != 0) {
    // Pick a remaining element.
    randIdx = Math.floor(Math.random() * currIdx);
    currIdx--;
    // And swap it with the current element.
    [array[currIdx], array[randIdx]] = [array[randIdx], array[currIdx]];
  }
  return array;
}
