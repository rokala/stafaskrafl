import { gameConfig as config } from './gameConfig';

class GameComposer {
  constructor() {}

  static getRandomLetter() {
    const rnd = Math.floor(Math.random() * config.alphabet.length);
    return config.alphabet[rnd];
  }

  static generateRandomState() {
    const letterSet = new Set();
    while(letterSet.size < config.numLetterOptions) {
      letterSet.add(this.getRandomLetter());
    }
    const letters = Array.from(letterSet.values());
    return {
      optional: letters.slice(0, config.numLetterOptions - 1).sort(),
      required: letters[letters.length - 1]
    };
  }
}

export default GameComposer;