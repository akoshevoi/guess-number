// @flow
import React from 'react';

import { Header } from '../components/header';
import { InvalidNumModal, WrongGuessModal } from '../components/modals';

import OpponentGuess from './OpponentGuess';
import GameOver from './GameOver';
import { ErrorBoundary } from '../error-boundary';

import { getMarkupOrNull } from '../utils/helpers';
import '../assets/sass/style.scss';

type digit = Number;
type logic = Boolean;
type method = Function;
type line = String;


const INITIAL_STATE = {
  guessNumber: 0,
  isValidNum: false,
  invalidNumModalEnabled: false,
  isGameStarted: false,
  opponentNumber: 0,
  whoseNumberBigger: '',
  valueBtn: '',
  dataOpponents: [],
  isGameOver: false
};

export default class EnterNum extends React.Component {
  countReplay = 0;

  indexOpponentsNumbers = 1;

  arrayOpponentsNumbers = [];

  state = { ...INITIAL_STATE };

  resetState = () => {
    this.indexOpponentsNumbers = 1;
    this.countReplay = 0;
    this.arrayOpponentsNumbers = [];
    this.setState({ ...INITIAL_STATE });
  };

  setGuessNumber = ({ target } : { target : line }) => {
    const validNumber = target.value.replace(/[^0-9]/g, '');
    this.setState({ guessNumber: +validNumber });
  };

  /*
  * Если так подключить, то не работает, может ты знаешь как надо
  *
  setIsValidNum = ({ bool } : {bool : logic}) => {
    this.setState({ isValidNum: bool });
  };

  setInvalidNumModalEnabled = ({ bool } : {bool : logic}) => {
    this.setState({ invalidNumModalEnabled: bool });
  };
  */

  setIsValidNum = bool => {
    this.setState({ isValidNum: bool });
  };

  setInvalidNumModalEnabled = bool => {
    this.setState({ invalidNumModalEnabled: bool });
  };

  checkValidNum = e => {
    e.preventDefault();
    const { guessNumber } = this.state;
    const isValidNum = guessNumber >= 1 && guessNumber <= 99;
    if (isValidNum) {
      this.setIsValidNum(true);
    } else {
      this.setInvalidNumModalEnabled(true);
    }
  };

  setRandomOpponentNumber = maxNumber => {
    const { guessNumber } = this.state;
    let randomNumber = Math.floor(Math.random() * maxNumber + 1);
    if (randomNumber === guessNumber) {
      randomNumber = Math.floor(Math.random() * maxNumber + 1);
    }
    return randomNumber;
  };

  setStartGameData = () => {
    const { guessNumber } = this.state;
    const opponentNumber = this.setRandomOpponentNumber(99);
    const biggerNumber = guessNumber > opponentNumber ? 'player' : 'computer';
      this.setState({
      isGameStarted: true,
      opponentNumber,
      whoseNumberBigger: biggerNumber
    });
  };

  /*
  * тут здесь прикреплю ф-ю из приложения по угадыванию - можт она
  * поможет оптимизировать отгадывание, сам вникать не буду - голова уже не варит
  *
  *
  *
 generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};
*/

  generateRandomNumber(min, max, value) {
    const { arrayOpponentsNumbers } = this;
    const { guessNumber, opponentNumber } = this.state;

    if (value === 'minus') {
      const diffMaxMin = ((max - min) <= 0) ? 0 : (max - min);
      console.log(`diffMaxMin: ${diffMaxMin}`);
      const coefficient = Math.ceil(diffMaxMin / 4);
      console.log(`coefficient: ${coefficient}`);
      if (diffMaxMin <= 3) {
        min = (Math.ceil(min - coefficient) <= 0) ? 1 : Math.ceil(min - 3);
        max = Math.floor(max);
        console.log(`min: ${min}`);
        console.log(`max: ${max}`);
      } else if (min <= 10 || max >= 90 || guessNumber <= 10 || opponentNumber >= 90) {
        min = (Math.ceil(min - coefficient) <= 0) ? 1 : Math.ceil(1);
        max = Math.floor(max);
        console.log(`min: ${min}`);
        console.log(`max: ${max}`);
      } else {
        min = (Math.ceil(min - coefficient) <= 0) ? 1 : Math.ceil(min - coefficient);
        max = Math.floor(max);
        console.log(`min: ${min}`);
        console.log(`max: ${max}`);
      }
    } else {
        const diffMaxMin = ((max - min) <= 0) ? 0 : (max - min);
        console.log(`diffMaxMin: ${diffMaxMin}`);
        const coefficient = Math.ceil(diffMaxMin / 8);
        console.log(`coefficient: ${coefficient}`);
        if (diffMaxMin <= 3) {
          min = Math.ceil(min);
          max = (Math.floor(max + coefficient) >= 99) ? 99 : Math.floor(max + 3);
          console.log(`min: ${min}`);
          console.log(`max: ${max}`);
        } else if (min <= 10 || max >= 90 || guessNumber <= 10 || opponentNumber >= 90) {
          min = Math.ceil(min);
          max = (Math.floor(max + coefficient) >= 99) ? 99 : Math.floor(99);
          console.log(`min: ${min}`);
          console.log(`max: ${max}`);
        } else {
          min = Math.ceil(min);
          max = (Math.floor(max + coefficient) >= 99) ? 99 : Math.floor(max + coefficient);
          console.log(`min: ${min}`);
          console.log(`max: ${max}`);
        }
    }

    let rndNum = Math.floor(min + Math.random() * (max + 1 - min));

    if (rndNum === opponentNumber) {
      console.log('EQUAL');
      rndNum = Math.round(min - 0.5 + Math.random() * (max - min + 1));
      if (rndNum === opponentNumber) {
        arrayOpponentsNumbers.push(guessNumber);
      }
    }

    const prevArray = arrayOpponentsNumbers;

    console.log(`random number: ${rndNum}`);
    console.log(`prev array: ${prevArray}`);

    if (arrayOpponentsNumbers.length === 0) {
      arrayOpponentsNumbers.push(rndNum);
    }

    if (arrayOpponentsNumbers.length !== 0) {
      if ((
        value === 'minus'
        && rndNum < arrayOpponentsNumbers[arrayOpponentsNumbers.length - 1]
        && arrayOpponentsNumbers.indexOf(rndNum) === -1)
        || (
        value === 'plus'
        && rndNum > arrayOpponentsNumbers[arrayOpponentsNumbers.length - 1]
        && arrayOpponentsNumbers.indexOf(rndNum) === -1
        )) {
          arrayOpponentsNumbers.push(rndNum);
        } else if (arrayOpponentsNumbers.indexOf(rndNum) > -1) {
          rndNum = Math.round(min - 0.5 + Math.random() * (max - min + 1));
        }
    }

    const currentArray = arrayOpponentsNumbers;

    console.log(`current array: ${currentArray}`);
    console.log(`guess number: ${guessNumber}`);
    console.log(`opponent number: ${opponentNumber}`);

    console.log(`indexOpponentsNumbers: ${this.countReplay}`);
    console.log(`array length: ${currentArray.length}`);

    if (this.countReplay !== currentArray.length) {
      console.log('WARNING');
      arrayOpponentsNumbers.push(guessNumber);
    }

    return arrayOpponentsNumbers[arrayOpponentsNumbers.length - 1];
  }

  addArrayNumberItem = number => {
    const newItem = {
      index: this.indexOpponentsNumbers += 1,
      number,
      id: Math.random()
        .toString(36)
        .substr(2, 9)
    };
    const oldArray = this.state.dataOpponents;
    const newArray = [newItem, ...oldArray];
    this.setState({
      opponentNumber: number,
      dataOpponents: newArray
    });
  };

  opponentNumberChange = value => {
    if (value === 'minus') {
      this.countReplay += 1;
      const randomNumber = this.generateRandomNumber(this.state.guessNumber, this.state.opponentNumber, 'minus');
      this.addArrayNumberItem(randomNumber);
      if (randomNumber === this.state.guessNumber) {
        this.setState({ isGameOver: true });
      }
    } else {
      this.countReplay += 1;
      const randomNumber = this.generateRandomNumber(this.state.opponentNumber, this.state.guessNumber, 'plus');
      this.addArrayNumberItem(randomNumber);
      if (randomNumber === this.state.guessNumber) {
        this.setState({ isGameOver: true });
      }
    }
  };

  getLabel = () => (
      <div className="form-control">
        <label className="select-number-label" htmlFor="input">
          Select a Number
        </label>
      </div>
  );

  getInput = () => (
    <div className="form-control">
      <input
        className="select-number-input"
        onChange={this.setGuessNumber}
        value={this.state.guessNumber}
        id="input"
      />
    </div>
  );

  getButtonGroup = () => (
    <div className="select-number-btn-group">
      <button
      className="btn btn--pink"
      type="reset"
      onClick={this.resetState}
    >
      Reset
    </button>
    <button
      className="btn btn--pink"
      type="submit"
      onClick={this.checkValidNum}
    >
      Confirm
    </button>
    </div>
  )

  getStartGameBlock = () => (
    <div className="start-game">
      <h5 className="start-game-title">You selected</h5>
      <div className="start-game-number">{this.state.guessNumber}</div>
      <button className="btn  btn--blue" onClick={this.setStartGameData}>
        Start Game
      </button>
    </div>
  );

  getInvalidNumModal = () => <InvalidNumModal onApply={this.resetState} />;

  getOpponentGuess = () => (
    <OpponentGuess
      opponentNumber={this.state.opponentNumber}
      wrongGuessModalEnabled={this.state.wrongGuessModalEnabled}
      setWrongGuessModalEnabled={this.setWrongGuessModalEnabled}
      guessNumber={this.state.guessNumber}
      opponentNumberChange={this.opponentNumberChange}
      dataOpponents={this.state.dataOpponents}
    />
  );

  getWrongGuessModal = () => (
    <WrongGuessModal onCloseWrongGuessModal={this.onCloseWrongGuessModal} />
  );

  getGameOver = () => (
    <GameOver
      guessNumber={this.state.guessNumber}
      dataOpponents={this.state.dataOpponents[0].index}
      resetState={this.resetState}
    />
  );


  switchShowBlocks = (
    label,
    input,
    buttonGroup,
    isValidNum,
    invalidNumModalEnabled,
    startGameBlock,
    opponentGuess,
    gameOver,
    isGameStarted,
    isGameOver,
    invalidNumModal,
) => {
    switch (true) {
      case (
        isValidNum === false
        && invalidNumModalEnabled === false
        && isGameStarted === false
        && isGameOver === false
      ): console.log('select number');
        return (
          <div>
            <div className="header-subtitle">Start a New Game!</div>
            <div className="select-number">
              <form>
                {label}
                {input}
                {buttonGroup}
              </form>
            </div>
          </div>
        );

        case (
          isValidNum === false
          && invalidNumModalEnabled === true
          && isGameStarted === false
          && isGameOver === false
        ):
          return invalidNumModal;

        case (
          isValidNum === true
          && invalidNumModalEnabled === false
          && isGameStarted === false
          && isGameOver === false
        ):
          return (
            <div>
              <div className="header-subtitle">Start a New Game!</div>
              <div className="select-number">
                <form>
                  {label}
                  {input}
                  {buttonGroup}
                </form>
              </div>
              {startGameBlock}
            </div>
          );

        case (
          isValidNum === true
          && invalidNumModalEnabled === false
          && isGameStarted === true
          && isGameOver === false
        ):
          return opponentGuess;

        case (
          isValidNum === true
          && invalidNumModalEnabled === false
          && isGameStarted === true
          && isGameOver === true
        ):
          return gameOver;
        default:
          return (
            <div>
              <div className="header-subtitle">Start a New Game!</div>
              <div className="select-number">
                <form>
                  {label}
                  {input}
                  {buttonGroup}
                </form>
              </div>
            </div>
          );
      }
  }

  render() {
    const {
      guessNumber,
      isValidNum,
      invalidNumModalEnabled,
      isGameStarted,
      opponentNumber,
      whoseNumberBigger,
      valueBtn,
      dataOpponents,
      isGameOver
    } = this.state;

    const label = this.getLabel();
    const input = this.getInput();
    const buttonGroup = this.getButtonGroup();

    const startGameBlock = getMarkupOrNull(this.getStartGameBlock, isValidNum);
    const invalidNumModal = getMarkupOrNull(this.getInvalidNumModal, invalidNumModalEnabled);

    const opponentGuess = getMarkupOrNull(this.getOpponentGuess, isGameStarted);
    const gameOver = getMarkupOrNull(this.getGameOver, isGameOver);


    const switchShowBlocks = this.switchShowBlocks(
      label,
      input,
      buttonGroup,
      isValidNum,
      invalidNumModalEnabled,
      startGameBlock,
      opponentGuess,
      gameOver,
      isGameStarted,
      isGameOver,
      invalidNumModal,
    );


    return (
        <div className="app">
          <Header />

            <ErrorBoundary>
            {switchShowBlocks}
            </ErrorBoundary>

            {/* <div className="select-number">
            <form>
              {label}
              {input}
              {buttonGroup}
            </form>
              {startGameBlock}
              {invalidNumModal}
              {opponentGuess}
              {gameOver}
          </div>   */}

        </div>
    );
  }
}

/*
 * попробуй поставить некоторые из этих модулей
 * чтобы в vscode при нажатии ctrl + shift + i
 * или какая там по дефолту комбинация
 * срабатывало автоисправление кода, который
 * подчеркнут красным, сейчас не работает
 */

/*
 * перед этим посмотри уроки 361-363 из
 * курса https://coursehunter.net/course/javascript-polnoe-rukovodstvo-2020-nachinayushchiy-prodvinutyy
 * и попробуй по ним настроить eslint
 */

// "@babel/core": "^7.4.4",
//     "@babel/runtime": "^7.4.4",
//     "babel-eslint": "8.2.3",
//     "babel-jest": "^24.8.0",
//     "eslint": "^5.3.0",
//     "eslint-config-airbnb-base": "12.1.0",
//     "eslint-plugin-import": "^2.18.0",
//     "eslint-plugin-jsx-a11y": "^6.2.1",
//     "eslint-plugin-prettier": "^3.1.0",
//     "eslint-plugin-react": "^7.14.2",
