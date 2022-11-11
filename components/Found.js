import React from 'react';
import { gameConfig } from '../core/gameConfig';
import { numUniqueChars } from '../utils/numUniqueChars'; 
import styles from '../styles/Found.module.scss'

export default class Hive extends React.Component {
  constructor(props) {
    super(props);
  }

  calcProgress() {
    return Math.ceil(1000 * this.props.words.length / this.props.numSolutions);
  }

  /*
  calcScore() {
    return this.props.words.reduce((prev, curr) => prev + numUniqueChars(curr) * curr.length, 0);
  }

  calcScore2() {
    return this.props.words.reduce((prev, curr) => prev + 2 * numUniqueChars(curr) + curr.length, 0);
  }
  */
  getStatusMessage() {
    const numFound = this.props.words.length;
    if (numFound === 0) {
      return 'Start guessing to find words';
    } else if (numFound === this.props.numSolutions) {
      return 'Well done! You found all the words!';
    } else {
      return `${numFound} words found so far`;
    }
  }

  render() {
    return (
      <div className={styles.found}>
        <div className={styles.header}>
          <div>
            <div>Points: {this.calcProgress()} / 1000</div>
            <div>{this.getStatusMessage()}</div>
          </div>   
          {
            this.props.words.length > 0 &&
            (        
            <div>
              <label htmlFor="sort-alphabetically">
              <input
                type="checkbox"
                id="sort-alphabetically"
                name="sort-alphabetically"
                defaultChecked={false}
                onChange={this.props.handleChange}
              />
                A→Ö
              </label>
            </div>
            )
          }
        </div>
        <div className={styles.outer}>
          <div className={styles.inner}>
            {
              this.props.words.map(word => {
                const usesAllLetters = numUniqueChars(word) === gameConfig.numLetterOptions
                return <div key={word}>{word}</div>
              })
            }
          </div>
        </div>
      </div>
    );
  }
}