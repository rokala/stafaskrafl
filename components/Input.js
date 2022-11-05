import React from 'react';
import styles from '../styles/Input.module.scss'

export default class Input extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.input}>
          {this.props.value}
      </div>
    );
  }
}