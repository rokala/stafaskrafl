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
      return;
    } else if (numFound === this.props.numSolutions) {
      return <span>Þú fannst öll <b>{numFound}</b> orðin!</span>
    } else {
      return <span>Orð fundin: <b>{numFound}</b></span>
    }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <button
              type="button"
              onClick={this.props.handleSort}
              disabled={this.props.words.length < 2}
              className={`${styles.toggleSort} ${this.props.alphabeticSort ? styles.active : ''}`}
              title="Toggle sort alphabetically"
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
          <div>
            {this.numFoundMessage()}
          </div>  
          <div>
            Stig: <b>{this.calcScore()}</b>
          </div>       
        </div>
        <div className={`${styles.compact} found-accordion`}>
          <div className={styles.header}>
            <div className={`${styles.horizontal} horizontal`}>
            {
              this.props.words.map(word => {
                const usesAllLetters = numUniqueChars(word) === gameConfig.numLetterOptions
                return (
                  <span key={word} className={usesAllLetters ? styles.pangram : ''}>
                    {word}
                  </span>
                );
              })
            }
            </div>
            <button
              className={`${styles.expand} button-expand`}
              onClick={() => this.props.handleExpand()}
            >
              <Image src="/icons/caret-down-solid.svg" alt="Expand" width={1.6667*40} height={40} color={'white'} />
            </button>
          </div>
          <div className={`${styles.vertical} vertical`}>
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