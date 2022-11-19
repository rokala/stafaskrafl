import React from 'react';
import styles from '../styles/Input.module.scss'

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.showPlaceholder = true;
    this.element = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.letters !== this.props.letters) {
      let percentSize = 100;
      do {
        this.element.current.style.fontSize = `${percentSize--}%`;
      } while(this.element.current.offsetWidth > this.props.containerWidth);
    }
  }

  renderInput() {
    if (this.props.letters.length > 0) {
      this.showPlaceholder = false;
      return this.props.letters.map((letter, idx) => {
        return (
          <span key={`input-${idx}`} className={letter === this.props.required ? styles.required : ''}>
            {letter}
          </span>
        );
      });
    } else if (this.showPlaceholder) {
      return <span className={styles.placeholder}>Skrifaðu orð...</span>;
    }
  }
  
  render() {
    const content = this.renderInput();
    return (
      <div className={styles.input}>
        <div ref={this.element} className={`${styles.wrapper} ${this.showPlaceholder ? '' : styles.caretRight}`}>
          {content}
        </div>
      </div>
    );
  }
}