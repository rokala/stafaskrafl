import React from 'react';
import Head from 'next/head';
//import Image from 'next/image';
import dynamic from "next/dynamic";
//import Link from 'next/link';
import Found from '../components/Found';
import styles from '../styles/Home.module.scss';
import DAL from '../core/data.access.layer';
import { gameConfig } from '../core/gameConfig';
import { digestBrowser } from '../utils/digest';
import hasProp from '../utils/hasProp';
import { compareIcelandic, compareNone } from '../utils/alphabetSort';
import tryParseJSONObject from '../utils/tryParseJsonObject';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HiveDynamic = dynamic(() => import('../components/Hive'), {
  ssr: false,
  loading: () => <p>...</p>,
});

export default class Home extends React.Component {
  state = {
    found: [],
    foundIsExpanded: false,
    sortAlphabetically: false,
  }

  constructor(props) {
    super(props);
    this.timeoutId = null;
    this.gameId = props.id;
  }

  componentDidMount() {
    const storage = tryParseJSONObject(localStorage.getItem('skrafl_state'));
    const hasValidId = storage && hasProp.call(storage, 'id') && parseInt(storage.id) === this.gameId;
    const hasWordArray = storage && hasProp.call(storage, 'words') && Array.isArray(storage.words) && storage.words.length > 0;
    if(hasValidId && hasWordArray) {
      const asyncFilter = async (arr, predicate) => Promise.all(arr.map(predicate))
        .then((results) => arr.filter((_v, index) => results[index]));
      
      asyncFilter(storage.words, async (word) => typeof word === 'string' && await this.isValidWord(word))
      .then(validWords => {
        const uniqueWords = Array.from(new Set(validWords));
        this.setState({ found: uniqueWords });
        this.saveProgress(uniqueWords);
      });
    } else {
      localStorage.removeItem('skrafl_state');
    }
  }

  async isValidWord(word) {
    const hex = await digestBrowser(word);
    return this.props.hashes.includes(hex);
  }

  saveProgress(words = null) {
    const json = JSON.stringify({
      id: this.gameId,
      words: words ?? this.props.found
    });
    try {
      localStorage.setItem('skrafl_state', json)
    } catch {
      console.error('Could not save game status, clients local storage is probably full.');
    }
  }

  onToggleExpand = () => {
    this.setState({ foundIsExpanded: !this.state.foundIsExpanded });
  }

  onChangeSort = (e) => {
    this.setState({ sortAlphabetically: !this.state.sortAlphabetically });
  }

  onSubmitGuess = (word) => {
    if(word.length === 0) {
      return false;
    }
    if (word.length < gameConfig.minWordLength) {
      toast(`??? Of stutt, l??gmark 4 b??kstafir.`);
      return false;
    }
    if (!word.includes(this.props.letters.required)) {
      toast(`??? Or??i?? ver??ur a?? innihalda "${this.props.letters.required}"`);
      return false;
    }
    const wordVal = word.join('');
    this.isValidWord(wordVal)
      .then(isValid => {
        if (isValid) {
          if (this.state.found.includes(wordVal)) {
            toast(`???? "${wordVal}" er n?? ??egar fundi??.`);
            return false;
          } else {
            toast(`?????? "${wordVal}" fannst, vel gert!`);
            const found = [wordVal].concat(this.state.found);
            this.setState({ found: found });
            this.saveProgress(found);
            return true;
          }
        } else {
          toast(`??? "${wordVal}" finnst ekki.`);
        }
      });
  }

  render() {
    return (
      <div className={`${styles.game} ${this.state.foundIsExpanded ? 'expand' : ''}`}>
        <ToastContainer
          position="top-center"
          hideProgressBar
          autoClose={1500}
          closeOnClick={false}
          theme="dark"
        />
        <Head>
          <title>Stafasett</title>
          <meta name="description" content="Finndu eins m??rg or?? og ???? getur me?? ??essum 7 b??kst??fum." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <HiveDynamic
          letters={this.props.letters}
          submitGuess={this.onSubmitGuess}
        />
        <Found
          words={[...this.state.found].sort(this.state.sortAlphabetically ? compareIcelandic : compareNone)}
          alphabeticSort={this.state.sortAlphabetically}
          handleSort={this.onChangeSort}
          numSolutions={this.props.hashes.length}
          handleExpand={this.onToggleExpand}
        />
      </div>
    )
  }
}

export async function getStaticProps (context) {
  const gameState = DAL.getCurrent();
  return {
    props: {
      id: gameState.date,
      hashes: gameState.hashes,
      letters: gameState.letters,
      input: ''
    }
  };
}
