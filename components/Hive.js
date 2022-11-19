import React from 'react';
import Image from 'next/image';
import { Stage, Layer, Text, RegularPolygon, Group } from 'react-konva';
import { Konva } from 'konva';
import Input from './Input';
import styles from '../styles/Hive.module.scss'
import { gameConfig } from '../core/gameConfig';
import shuffle from '../utils/shuffle';
import hasProp from '../utils/hasProp';

export default class Hive extends React.Component {
  state = {
    optional: this.props.letters.optional,
    input: [],
    formLocked: false,
  }
  constructor(props) {
    super(props);
    this.requiredLetter = this.props.letters.required;
    this.radius = 50;
    this.center = { x: 3 * this.radius, y: 3 * this.radius };
    const diagonal = Math.sqrt(3) * this.radius;
    this.positions = [
      { x: 0,          y: -2 * this.radius },
      { x: +diagonal,  y: -this.radius },
      { x: +diagonal,  y: +this.radius },
      { x: 0,          y: +2 * this.radius },
      { x: -diagonal,  y: +this.radius },
      { x: -diagonal,  y: -this.radius },
      { x: 0, y: 0 }
    ];
    this.wrappers = {};
  }

  updateWrapper() {
    const letters = this.getLetters();
    letters.forEach((letter, idx) => {
      const propExists = hasProp.call(this.wrappers, letter);
      if (propExists) {
        this.wrappers[letter].position = idx;
      } else {
        this.wrappers[letter] = {
          isRequired: letters.length - 1 === idx,
          position: idx,
          groupRef: null,
          textRef: null,
          polygonRef: null
        };
      }
    });
  }

  getLetters() {
    return this.state.optional.concat(this.requiredLetter);
  }

  onShuffle() {
    this.setState({ formLocked: true });
    const copy = [...this.state.optional];
    const shuffled = shuffle(copy);
    this.shuffleAnimation();
    this.setState({ optional: shuffled });
  }

  onSubmitInput() {
    this.props.submitGuess(this.state.input);
    this.onClearInput(0);
  }

  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      if (this.state.formLocked) {
        return;
      }
      const char = e.key.toUpperCase();
      switch(char) {
        case 'ENTER':
          this.onSubmitInput();
          break;
        case 'BACKSPACE':
          this.onRemoveLastInput();
          break;
        default:
          this.onAddLetter(char);
          if (hasProp.call(this.wrappers, char)) {
            const targets = this.wrappers[char].groupRef?.children;
            targets.forEach(child => {
              child.to({
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 0.08
              });
            });
          }
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      const char = e.key.toUpperCase();
      if (hasProp.call(this.wrappers, char)) {
        const targets = this.wrappers[char].groupRef.children;
        targets.forEach(child => {
          child.to({
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 0.08
          });
        });
      }
    });
  }

  clickAndHold = (btnEl) => {
    let timerId;
    const DURATION = 200;

    //handle when clicking down
    const onMouseDown = () => {
      timerId = setInterval(() => {
        btnEl && btnEl.click();
      }, DURATION);
    };

    //stop or clear interval
    const clearTimer = () => {
      timerId && clearInterval(timerId);
    };

    //handle when mouse is clicked
    btnEl.addEventListener("mousedown", onMouseDown);
    //handle when mouse is raised
    btnEl.addEventListener("mouseup", clearTimer);
    //handle mouse leaving the clicked button
    btnEl.addEventListener("mouseout", clearTimer);

    // a callback function to remove listeners useful in libs like react
    // when component or element is unmounted
    return () => {
      btnEl.removeEventListener("mousedown", onMouseDown);
      btnEl.removeEventListener("mouseup", clearTimer);
      btnEl.removeEventListener("mouseout", clearTimer);
    };
  };

  onAddLetter(letter) {
    if(letter.length > 1) {
      return;
    }
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      if (this.isValidLetter(letter)) {
        this.setState({ input: [letter] });
      } else {
        //console.log(`Letter "${letter} is not eligible."`);
        this.setState({ input: [] });
      }
      return;
    }
    if (!this.isValidLetter(letter)) {
      //console.log(`Letter "${letter} is not eligible."`);
      return;
    }
    if (this.state.input.length > gameConfig.maxWordLength) {
      //console.log('This word is too long!');
      this.onClearInput();
      return;
    }
    this.setState({ input: this.state.input.concat(letter) });
  }

  onRemoveLastInput() {
    this.setState({ input: this.state.input.slice(0, -1) });
  }

  onClearInput(delay = 1000) {
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.setState({ input: [] });
    }, delay);
  }

  isValidLetter(letter) {
    return this.getLetters().includes(letter)
  }

  merge(posRef, letter, type) {
    return {
      text: letter,
      type: type,
      posRef,
    }
  }

  shuffleAnimation = (e) => {
    const totalDuration = 0.7;
    const inOutRatio = 0.25;
    const [durationIn, durationOut] = [ inOutRatio * totalDuration, (1.0 - inOutRatio) * totalDuration ];
    const optionalLetters = this.props.letters.optional;
    const requiredGroup = this.wrappers[this.props.letters.required].groupRef;
    const durationOutPerLetter = durationOut / optionalLetters.length;
    requiredGroup.to({
      scaleX: 1.15,
      scaleY: 1.15,
      duration: durationIn,
      onFinish: () => {
          requiredGroup.to({
            //sides: 6,
            scaleX: 1,
            scaleY: 1,
            duration: durationOut
          });
      }
    });
    optionalLetters.forEach((letter, idx) => {
      const wrapper = this.wrappers[letter];
      wrapper.groupRef.to({
          offsetX: 0,
          offsetY: 0,
          scaleX: 0.1,
          scaleY: 0.1,
          duration: durationIn,
          easing: Konva.Easings.EaseIn,
          onFinish: () => {
            setTimeout(() => {
              wrapper.groupRef.to({
                scaleX: 1.0,
                scaleY: 1.0,
                offsetX: this.positions[wrapper.position].x,
                offsetY: this.positions[wrapper.position].y,
                duration: durationOutPerLetter,
                easing: Konva.Easings.EaseOut,
              });
            }, 1000.0 * durationOutPerLetter * wrapper.position);
          }
      });
    });
    setTimeout(() => {
      this.setState({ formLocked: false });
    }, 1000.0 * totalDuration);
  }

  onCellHoverOn(target) {
    const parent = target.getParent();
    const polygon = parent.children.find(child => child.className === 'RegularPolygon');
    polygon.to({
      fill: polygon.name() === 'required' ? '#13172C' : '#25283C',
      duration: 0.1
    });

    const text = parent.children.find(child => child.className === 'Text');
    if (text.name() === 'required') {
      text.to({
        fill: '#fff8f0',
        duration: 0.1
      });
    }
    
    const container = polygon.getStage().container();
    container.style.cursor = 'pointer';
  }

  onCellHoverOff(target) {
    const parent = target.getParent();
    const polygon = parent.children.find(child => child.className === 'RegularPolygon');
    polygon.to({
      fill: polygon.name() === 'required' ? '#a69cac' : '#36384C',
      duration: 0.1
    });

    const text = parent.children.find(child => child.className === 'Text');
    if (text.name() === 'required') {
      text.to({
        fill: '#13172C',
        duration: 0.1
      });
    }
      
    this.onCellClickOff(polygon);
    const container = polygon.getStage().container();
    container.style.cursor = 'default';
  }

  onCellClickOn(target) {
    target.getParent().children.forEach(child => {
      child.to({
        scaleX: 0.93,
        scaleY: 0.93,
        duration: 0.08
      });
    });
  }

  onCellClickOff(target) {
    target.getParent().children.forEach(child => {
      child.to({
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 0.08
      });
    });
  }

  render() {
    this.updateWrapper();
    const letters = Object.keys(this.wrappers);
    const [width, height] = [2 * this.center.x, 2 * this.center.y];
    return (
      <div className={`${styles.wrapper} hive`}>
      <Input
        letters={this.state.input}
        required={this.props.letters.required}
        containerWidth={width}
      />
      <Stage width={width} height={height}>
        <Layer>
          {letters.map((letter, idx) => {
            const wrapper = this.wrappers[letter];
            const position = this.positions[wrapper.position]
            return (
              <Group
                key={`grp-${letter}`}
                x={this.center.x}
                y={this.center.y}
                offsetX={position.x}
                offsetY={position.y}
                rotation={0}
                ref={(node) => {
                  wrapper.groupRef = node;
                }}
                onMouseEnter={e => this.onCellHoverOn(e.target)}
                onMouseLeave={e => this.onCellHoverOff(e.target)}
                onPointerDown={e => this.onCellClickOn(e.target)}
                onPointerUp={e => this.onCellClickOff(e.target)}
                onClick={e => this.onAddLetter(letter)}
                onTap={e => this.onAddLetter(letter)}
              >
                <RegularPolygon
                  ref={(node) => {
                    wrapper.polygonRef = node;
                  }}
                  name={wrapper.isRequired ? 'required' : 'optional'}
                  x={0}
                  y={0}
                  sides={6}
                  radius={this.radius}
                  fill={wrapper.isRequired ? '#a69cac' : '#36384C'}
                  stroke={wrapper.isRequired ? '#36384C' : '#a1a1a1'}
                  strokeWidth={2}
                  rotation={30}
                />
                <Text
                  ref={(node) => {
                    wrapper.textRef = node;
                    //node.cache({drawBorder: true});
                  }}
                  name={wrapper.isRequired ? 'required' : 'optional'}
                  text={letter}
                  fill={wrapper.isRequired ? '#13172C' : '#FFF8F0'}
                  fontSize={40}
                  align={'center'}
                  verticalAlign={'middle'}
                  fontStyle={wrapper.isRequired ? 'bold' : 'normal'}
                  width={2*this.radius}
                  height={2*this.radius}
                  offsetX={this.radius-2}
                  offsetY={this.radius-5}
                  rotation={0}
                />
              </Group>
            )
          })}
        </Layer>
      </Stage>
      <div className={styles.action}>
        <button type="button" onMouseDown={() => this.onRemoveLastInput()} disabled={this.state.input.length === 0 || this.state.formLocked}> 
          <Image src="/icons/delete-left-solid.svg" alt="Delete last character" width={40} height={0.68*40} color={'white'} onContextMenu={() => false}/>
        </button>
        <button type="button" onClick={() => this.onShuffle()} disabled={this.state.formLocked}>
          Stokka
        </button>
        <button type="button" onClick={() => this.onSubmitInput()} disabled={this.state.input.length === 0 || this.state.formLocked}>
          <Image src="/icons/check-solid.svg" alt="Enter guess" width={40} height={0.68*40} color={'white'} />
        </button>
      </div>
      </div>
    );
  }
}