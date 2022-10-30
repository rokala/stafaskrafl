import React from 'react';

export default class Hive extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <label htmlFor="sort-alphabetically">
          <input
            type="checkbox"
            id="sort-alphabetically"
            name="sort-alphabetically"
            //value={this.state.alphabetic}
            defaultChecked={false}
            //checked={false}
            onChange={this.props.handleChange}
          />
          Sort alphabetically
        </label>
        <h4>
          {
            this.props.words.length > 0
            ? <>{this.props.words.length} <span style={{fontWeight:"normal"}}>words found so far</span></>
            : <>Words you find will appear here</>
          }
        </h4>
        <ul>
          {
            this.props.words.map(word => {
              return <li key={word}>{word}</li>
            })
          }
        </ul>
      </div>
    );
  }
}