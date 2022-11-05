import React from 'react';
import { gameConfig } from '../core/gameConfig';
import { numUniqueChars } from '../utils/numUniqueChars'; 

export default class Hive extends React.Component {
  constructor(props) {
    super(props);
  }

  calcScore() {
    return this.props.words.reduce((prev, curr) => prev + numUniqueChars(curr) * curr.length, 0);
  }

  calcScore2() {
    return this.props.words.reduce((prev, curr) => prev + 2 * numUniqueChars(curr) + curr.length, 0);
  }

  render() {
    return (
      <div>
        {
          this.props.words.length > 0 &&
          (        <label htmlFor="sort-alphabetically">
          <input
            type="checkbox"
            id="sort-alphabetically"
            name="sort-alphabetically"
            defaultChecked={false}
            onChange={this.props.handleChange}
          />
            Sort alphabetically
          </label>
          )
        }

        <h4> Score 1: {this.calcScore()} / Score 2: {this.calcScore2()}</h4>
        <h4>
          {
            this.props.words.length > 0
            ? <>{this.props.words.length} <span style={{fontWeight:"normal"}}>words found so far</span></>
            : <>Words you find will appear here</>
          }
        </h4>
        <ol>
          {
            this.props.words.map(word => {
              const usesAllLetters = numUniqueChars(word) === gameConfig.numLetterOptions
              return <li key={word} allLetters={usesAllLetters}>{word}</li>
            })
          }
        </ol>
      </div>
    );
  }
}