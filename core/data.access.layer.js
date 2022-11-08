import Database from 'better-sqlite3';
import { today } from '../utils/dates';
import NodeCache from 'node-cache';

class DataAccessLayer {
  constructor() {
    const options = {
      readonly: false,
      fileMustExist: true,
      timeout: 2000,
      //verbose: console.log
    };
    this.instance = new Database(process.env.DB_PATH, options);
    this.instance.function('regexp', function(characters, input) {
      return new RegExp(`^[${characters}]+$`, 'i').test(input) ? 1 : 0;
    });
    this.cache = new NodeCache({ stdTTL: 259200, checkperiod: 86400, useClones: false });
  }

  getCurrent() {
    const dateToday = today().getTime();
    const cacheResponse = this.cache.get(dateToday);
    if (cacheResponse) {
      return cacheResponse;
    }
    const activeState = this.getGameState(dateToday);
    if (!activeState) {
      return activeState;
    }
    const answers = this.getStateAnswers(activeState.letters);
    const response = { ...activeState, hashes: answers.map(el => el.hash)/*, words: answers.map(el => el.value) */};
    this.cache.set(dateToday, response);
    return response;
  }

  getGameState(date) {
    const state = this.instance
      .prepare(`SELECT date, value letters FROM game_states WHERE date=${date}`)
      .get();

    if (!state) {
      return state;
    }

    state.letters = JSON.parse(state.letters);
    return state;
  }

  stateExists(state) {
    const numStates = this.instance
      .prepare(`SELECT COUNT(*) FROM game_states WHERE value='${JSON.stringify(state)}'`)
      .pluck()
      .get();
    return numStates > 0;
  }

  getNextAvailableStateDate() {
    const latestDate = this.instance
      .prepare(`SELECT date FROM game_states ORDER BY date DESC`)
      .pluck()
      .get();

    if(!latestDate) {
      return latestDate;
    }
    const nextDate = new Date(latestDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
  }

  getStateAnswers(state) {
    const allLetters = state.optional.concat(state.required).join('');
    return this.instance
      .prepare(
        `SELECT
          value, hash
        FROM words
        WHERE regexp('${allLetters}', value) AND value LIKE '%${state.required}%'`
      )
      .all();
  }

  getStateAnswersCount(state) {
    const allLetters = state.optional.concat(state.required).join('');
    return this.instance
      .prepare(
        `SELECT
          COUNT(*)
        FROM words
        WHERE regexp('${allLetters}', value) AND value LIKE '%${state.required}%'`
      )
      .pluck()
      .get();
  }

  insertGameState(date, state) {
    const insert = this.instance.prepare(`INSERT INTO game_states(date, value) VALUES (?, ?)`);
    insert.run(date.getTime(), JSON.stringify(state));
  }
}

export default new DataAccessLayer();
