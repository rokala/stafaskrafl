const fs = require('fs');
//const path = require('path');
const { digestNode } = require('../utils/digest');
const { numUniqueChars } = require('../utils/numUniqueChars');
const sqlite3 = require('better-sqlite3');
const config = require('../core/gameConfig').gameConfig;
class DatabaseInitializer {
  constructor(dbPath) {

	  const options = {
      readonly: false,
      fileMustExist: false,
      timeout: 2500,
      //verbose: console.log
	  };

    this.instance = new sqlite3(dbPath, options);
 
    this.instance.exec(`
      CREATE TABLE IF NOT EXISTS words (
        'value' TEXT UNIQUE NOT NULL PRIMARY KEY,
        'hash' TEXT UNIQUE NOT NULL,
        'is_key' INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS game_states (
        'date' INTEGER UNIQUE NOT NULL PRIMARY KEY,
        'value' TEXT UNIQUE NOT NULL
      );
    `);

    this.#populateData();
    //this.#defineFunctions();
    //this.createIndices();

    this.instance.close();
  }

  #populateData() {
    const validCharacters = new RegExp(`^[${config.alphabet}]+$`);
    const words = Array.from(new Set(
      fs.readFileSync('core/source/ord.txt', { encoding: 'utf8', flag: 'r' })
        .split('\n')
        .map(word => word.trim().toUpperCase())
        .filter(word => {
          if (word.length < config.minWordLength) {
            return false;
          } else if (numUniqueChars(word) > config.numLetterOptions) {
            return false;
          } else if (!validCharacters.test(word)) {
            return false;
          }
          return true;
        })
    ).values())
    .map(word => {
      return {
        value: word,
        hash: digestNode(word),
        isKey: (numUniqueChars(word) === config.numLetterOptions && word.length === config.numLetterOptions) ? 1 : 0
      }
    });
    
    const insert = this.instance.prepare('INSERT INTO words (value, hash, is_key) VALUES (@value, @hash, @isKey)');
    const insertMany = this.instance.transaction((records) => {
      for (const record of records) {
        insert.run(record);
      }
    });
    insertMany(words);
  }

  #createIndices() {
    this.instance.exec(`CREATE UNIQUE INDEX idx_state_date ON game_states(date);`)
    // this.instance.exec(`CREATE UNIQUE INDEX idx_word ON words(value);`)
    // this.instance.exec(`CREATE UNIQUE INDEX idx_hash ON words(hash);`)
  }

  #defineFunctions() {
    this.instance.function('regexp', function(characters, input) {
      return new RegExp(`^[${characters}]+$`, 'i').test(input) ? 1 : 0;
    });
  }

  static run(dbPath) {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.info('\x1b[33m%s\x1b[0m', `❌  DELETED EXISTING DATABASE AT: ${dbPath}\n`);
    }
    
    new DatabaseInitializer(dbPath);

    console.info('\x1b[33m%s\x1b[0m', `✅  CREATED NEW DATABASE AT: ${dbPath}\n`);
  }
}

module.exports = (path) => {
  return DatabaseInitializer.run(path);
};
