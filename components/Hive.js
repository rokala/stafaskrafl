import React from 'react';
import Image from 'next/image';
import { Stage, Layer, Text, RegularPolygon, Group } from 'react-konva';
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
    this.onClearInput();
  }

  componentDidMount() {
    window.addEventListener('keydown', (e) => {
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
            const targets = this.wrappers[char]?.groupRef.children;
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
        console.log(`Letter "${letter} is not eligible."`);
        this.setState({ input: [] });
      }
      return;
    }
    if (!this.isValidLetter(letter)) {
      console.log(`Letter "${letter} is not eligible."`);
      return;
    }
    //this.onCellClickOn(e.target);
    //this.onCellClickOff(e.target);
    if (this.state.input.length > gameConfig.maxWordLength) {
      console.log('This word is too long!');
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
    const numUnits = 4;
    const unitDuration = 0.08;
    const totalDuration = unitDuration * numUnits;
    const unitRotation = 60;
    const rotation = unitRotation * numUnits;
    this.getLetters().slice(0,-1).forEach(letter => {
      const wrapper = this.wrappers[letter];
      wrapper.textRef.to({
        rotation: wrapper.textRef.rotation() - rotation,
        duration: totalDuration
      }); 
      wrapper.polygonRef.to({
        rotation: wrapper.polygonRef.rotation() + rotation,
        duration: totalDuration
      });
      wrapper.groupRef.to({
          offsetX: 0,
          offsetY: 0,
          scaleX: 0.5,
          scaleY: 0.5,
          rotation: wrapper.groupRef.rotation() + 0.5*rotation,
          duration: 0.5*totalDuration,
          onFinish: () => {
            wrapper.groupRef.to({
            rotation: wrapper.groupRef.rotation() + 0.5*rotation,
              scaleX: 1.0,
              scaleY: 1.0,
              offsetX: this.positions[wrapper.position].x,
              offsetY: this.positions[wrapper.position].y,
              duration: 0.5*totalDuration,
              onFinish: () => {
                this.setState({ formLocked: false });
              }
            });
          }
      });
    })
  };

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
        scaleX: 0.95,
        scaleY: 0.95,
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
    return (
      <div className={styles.wrapper}>
      <Input letters={this.state.input} required={this.props.letters.required}/>
      <Stage width={2*this.center.x} height={2*this.center.y}>
        <Layer>
          {letters.map((letter, idx) => {
            //const isRequired = idx === letters.length - 1;
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
                  stroke={'#a1a1a1'}
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
                  fontStyle={'bold'}
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
        <button type="button" onClick={() => this.onRemoveLastInput()} disabled={this.state.input.length === 0}> 
          <Image src="/icons/delete-left-solid.svg" alt="Delete last character" width={40} height={0.68*40} color={'white'} />
        </button>
        <button type="button" onClick={() => this.onShuffle()} disabled={this.state.formLocked}>
          Stokka
        </button>
        <button type="button" onClick={() => this.onSubmitInput()} disabled={this.state.input.length === 0}>
          <Image src="/icons/right-to-bracket-solid.svg" alt="Enter guess" width={40} height={0.68*40} color={'white'} />
        </button>
      </div>
      </div>
    );
  }
}