// @flow

import React from 'react';
import { getMarkupOrNull } from '../utils/helpers';
import { InvalidNumModal } from '../components/modals';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import StartGame from '../components/StartGame/StartGame';
import OpponentGuess from './OpponentGuess';
import { Header } from '../components/header';
import GameOver from './GameOver';
import { withRouter, Link, Route } from 'react-router-dom';
import '../assets/sass/style.scss';

type Props = {
  history: Object
};

type State = {
  guessNumber: number,
  opponentNumber: number,
  invalidNumModalEnabled: boolean,
  isValidNum: boolean,
  isGameStarted: boolean,
  isGameOver: boolean,
  dataOpponents: Array<mixed>
};

class EnterNum extends React.Component<Props, State> {
  countReplay = 0;

  indexOpponentsNumbers = 1;

  arrayOpponentsNumbers = [];

  static defaultProps = {
    history: {}
  };

  state = {
    guessNumber: 0,
    opponentNumber: 0,
    invalidNumModalEnabled: false,
    isValidNum: false,
    isGameStarted: false,
    isGameOver: false,
    dataOpponents: []
  };

  resetState = () => {
    this.indexOpponentsNumbers = 1;
    this.countReplay = 0;
    this.arrayOpponentsNumbers = [];
    this.setState(
      {
        guessNumber: 0,
        opponentNumber: 0,
        invalidNumModalEnabled: false,
        isValidNum: false,
        isGameStarted: false,
        isGameOver: false,
        dataOpponents: []
      },
      this.props.history.push('/')
    );
  };

  setGuessNumber = ({ target }: Object) => {
    const validNumber = target.value.replace(/[^0-9]/g, '');
    this.setState({ guessNumber: +validNumber });
  };

  setIsValidNum = (bool: boolean) => {
    this.setState({ isValidNum: bool }, this.props.history.push('/start-game'));
  };

  setInvalidNumModalEnabled = (bool: boolean) => {
    this.setState(
      { invalidNumModalEnabled: bool },
      this.props.history.push('/invalid-number')
    );
  };

  checkValidNum = (e: Object) => {
    e.preventDefault();
    const { guessNumber } = this.state;
    const isValidNum = guessNumber >= 1 && guessNumber <= 99;

    if (isValidNum) {
      this.setIsValidNum(true);
    } else {
      this.setInvalidNumModalEnabled(true);
    }
  };

  generateRandomNumber = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min)) + min;
    if (rndNum === exclude) {
      return this.generateRandomNumber(min, max, exclude);
    } else {
      return rndNum;
    }
  };

  setStartGameData = () => {
    const { guessNumber } = this.state;
    const opponentNumber = this.generateRandomNumber(1, 100, guessNumber);

    this.setState(
      {
        isGameStarted: true,
        opponentNumber
      },
      this.props.history.push('/opponent-guess')
    );
  };

  setGameOver = (bool: boolean) => {
    this.setState({ isGameOver: bool });
  };

  setDataOpponents = (array: Array<mixed>) => {
    this.setState({ dataOpponents: array });
  };

  getLabel = () => (
    <div className='form-control'>
      <label className='select-number-label' htmlFor='input'>
        Select a Number
      </label>
    </div>
  );

  getInput = () => (
    <div className='form-control'>
      <input
        className='select-number-input'
        onChange={this.setGuessNumber}
        value={this.state.guessNumber}
        id='input'
      />
    </div>
  );

  getButtonGroup = () => (
    <div className='select-number-btn-group'>
      <button className='btn btn--pink' type='reset' onClick={this.resetState}>
        Reset
      </button>
      <Link
        to='/check-number'
        className='btn btn--pink'
        onClick={this.checkValidNum}
      >
        Confirm
      </Link>
    </div>
  );

  getInvalidNumModal = () => <InvalidNumModal onApply={this.resetState} />;

  getGameOver = () => (
    <GameOver
      guessNumber={this.state.guessNumber}
      dataOpponents={this.state.dataOpponents.length}
      resetState={this.resetState}
    />
  );

  render() {
    const {
      guessNumber,
      isValidNum,
      invalidNumModalEnabled,
      opponentNumber,
      isGameOver
    } = this.state;

    const label = this.getLabel();
    const input = this.getInput();
    const buttonGroup = this.getButtonGroup();
    const gameOver = getMarkupOrNull(this.getGameOver, isGameOver);

    return (
      <div className='app'>
        <ErrorBoundary>
          <Header />
          <div className='select-number'>
            <form>
              {label}
              {input}
              {buttonGroup}
            </form>
          </div>
          <Route
            path='/check-number'
            children={() => {
              if (isValidNum) {
                return (
                  <StartGame
                    guessNumber={guessNumber}
                    setStartGameData={this.setStartGameData}
                  />
                );
              } else if (invalidNumModalEnabled) {
                return <InvalidNumModal onApply={this.resetState} />;
              }
            }}
          />
          <Route path='/opponent-guess'>
            <OpponentGuess
              opponentNumber={opponentNumber}
              guessNumber={guessNumber}
              generateRandomNumber={this.generateRandomNumber}
              setGameOver={this.setGameOver}
              setDataOpponents={this.setDataOpponents}
            />
          </Route>
          {gameOver}
        </ErrorBoundary>
      </div>
    );
  }
}

export default withRouter(EnterNum);
