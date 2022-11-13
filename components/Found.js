import React from 'react';
import Image from 'next/image';
import { gameConfig } from '../core/gameConfig';
import { numUniqueChars } from '../utils/numUniqueChars'; 
import styles from '../styles/Found.module.scss'

export default class Found extends React.Component {
  constructor(props) {
    super(props);
  }

  calcScore() {
    const score = this.props.words.reduce(
      (prev, curr) => {
        const numUnique = numUniqueChars(curr);
        const multiplier = numUnique === gameConfig.numLetterOptions ? 2*numUnique : numUnique;
        return prev + (multiplier * numUniqueChars(curr)) + curr.length
      },
      0
    );
    return score;
  }

  numFoundMessage() {
    const numFound = this.props.words.length;
    if (numFound === 0) {
      return <span>Start guessing to find words.</span>
    } else if (numFound === this.props.numSolutions) {
      return <span>Well done! You found all the words!</span>
    } else {
      return <span><b>{numFound}</b> orð fundin.</span>
    }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <div>
              <b>{this.calcScore()}</b> stig.
            </div>
            <div>
              {this.numFoundMessage()}
            </div>
          </div>               
          <div>
            <button
              type="button"
              onClick={this.props.handleSort}
              disabled={this.props.words.length < 2}
              className={this.props.alphabeticSort ? 'active' : ''}
            >
              <Image
                src="/icons/arrow-down-a-z-solid.svg"
                alt="Toggle alphabetic sort"
                width={50}
                height={0.68*50}
                color={'white'}
              />
            </button>
          </div>          
        </div>
        <div className={styles.list}>
          {
            this.props.words.map(word => {
              const usesAllLetters = numUniqueChars(word) === gameConfig.numLetterOptions
              return (
                <div key={word} className={usesAllLetters ? styles.pangram : ''}>
                  {word}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}