import React from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h2>
          {this.props.value}
        </h2>
      </div>
    );
  }
}