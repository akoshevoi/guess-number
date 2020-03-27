// @flow
import React from "react";

import { Header } from "../components/header";
import { InvalidNumModal } from "../components/modals";
import { WrongGuessModal } from "../components/modals";
import OpponentGuess from "./OpponentGuess";
import GameOver from "./GameOver";

import { getMarkupOrNull } from "../utils/helpers";
import "../assets/sass/style.scss";

const INITIAL_STATE = {
  guessNumber: 0,
  isValidNum: false,
  invalidNumModalEnabled: false,
  isGameStarted: false,
  opponentNumber: 0,
  whoseNumberBigger: "",
  valueBtn: "",
  wrongGuessModalEnabled: false,
  dataOpponents: [],
  isGameOver: false
};

export default class EnterNum extends React.Component {
  clicks = 1;
  arrayOpponentsNumbers = [];
  state = { ...INITIAL_STATE };

  resetState = () => {
    this.clicks = 1;
    this.arrayOpponentsNumbers = [];
    this.setState({ ...INITIAL_STATE });
  };

  setGuessNumber = ({ target }) => {
    const validNumber = target.value.replace(/[^0-9]/g, "");
    this.setState({ guessNumber: +validNumber });
  };

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
    const biggerNumber =
      guessNumber > opponentNumber ? "player" : "computer";
      this.setState({
      isGameStarted: true,
      opponentNumber,
      whoseNumberBigger: biggerNumber
    });
  };

  setWrongGuessModalEnabled = () => {
    this.setState({ wrongGuessModalEnabled: true });
  };


  generateRandomNumber(min, max, value) {
    const { arrayOpponentsNumbers } = this;
    
    if (value === 'minus') {
      let diffMaxMin = ((max - min) <= 0) ? 0 : (max - min);
      console.log('diffMaxMin: ' + diffMaxMin);
      let coefficient = Math.ceil(diffMaxMin / 8);
      console.log('coefficient: ' + coefficient)
      min = (Math.ceil(min - coefficient) <= 0) ? 1 : Math.ceil(min - coefficient);
      max = Math.floor(max);
      console.log('min: ' + min);
      console.log('max: ' + max);
      } else {
        let diffMaxMin = ((max - min) <= 0) ? 0 : (max - min);
        console.log('diffMaxMin: ' + diffMaxMin);
        let coefficient = Math.ceil(diffMaxMin / 8);
        console.log('coefficient: ' + coefficient);
        min = Math.ceil(min);
        max = (Math.floor(max + coefficient) >= 99) ? 99 : Math.floor(max + coefficient)
        console.log('min: ' + min);
        console.log('max: ' + max);
    }
   
    let rndNum = Math.floor(Math.random() * (max - min)) + min;

    console.log(rndNum);
    console.log(arrayOpponentsNumbers);
  
    if (arrayOpponentsNumbers.length === 0) {
      arrayOpponentsNumbers.push(rndNum);
    } else {
      if (arrayOpponentsNumbers.indexOf(rndNum) === -1) {
        arrayOpponentsNumbers.push(rndNum);
      } 
      else {
        //this.generateRandomNumber();
        rndNum = Math.floor(Math.random() * ((max + 7) - (min - 5))) + (min - 3);
      } 
    }
    console.log(arrayOpponentsNumbers);
    return arrayOpponentsNumbers[arrayOpponentsNumbers.length - 1];
  }

  addArrayNumberItem = number => {
    const newItem = {
      index: this.clicks++,
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
    
    if (value === "minus") {

     console.log(value);
      console.log('guessNumber: ' + this.state.guessNumber);
      console.log('opponentNumber: ' + this.state.opponentNumber);
      const randomNumber = this.generateRandomNumber(this.state.guessNumber, this.state.opponentNumber, 'minus');
      console.log(randomNumber);
      this.addArrayNumberItem(randomNumber);
      if (randomNumber === this.state.guessNumber) {
        this.setState({ isGameOver: true });
      }
    } else {

     console.log(value);
      console.log('guessNumber: ' + this.state.guessNumber);
      console.log('opponentNumber: ' + this.state.opponentNumber);
      const randomNumber = this.generateRandomNumber(this.state.opponentNumber, this.state.guessNumber, 'plus');
      console.log(randomNumber);
      this.addArrayNumberItem(randomNumber);
      if (randomNumber === this.state.guessNumber) {
        this.setState({ isGameOver: true });
      }
    }
  };

  onCloseWrongGuessModal = () => {
    this.setState(state => {
      return { wrongGuessModalEnabled: !state.wrongGuessModalEnabled };
    });
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

  getResetButton = () => (
    <button 
      className="btn btn--pink" 
      type="reset" 
      onClick={this.resetState}
    > 
      Reset 
    </button>
  );

  getCheckButton = () => (
    <button
      className="btn btn--pink"
      type="submit"
      onClick={this.checkValidNum}
    >
      Confirm
    </button>
  );

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
      dataOpponents={this.state.dataOpponents}
      resetState={this.resetState}
    />
  );

  render() {
    const {
      guessNumber,
      isValidNum,
      invalidNumModalEnabled,
      isGameStarted,
      opponentNumber,
      whoseNumberBigger,
      valueBtn,
      wrongGuessModalEnabled,
      dataOpponents,
      isGameOver
    } = this.state;

    const label = this.getLabel();
    const input = this.getInput();

    const resetButton = this.getResetButton();
    const checkButton = this.getCheckButton();

    const startGameBlock = getMarkupOrNull(this.getStartGameBlock, isValidNum);
    const invalidNumModal = getMarkupOrNull(this.getInvalidNumModal, invalidNumModalEnabled);

    const opponentGuess = getMarkupOrNull(this.getOpponentGuess, isGameStarted);
    const wrongGuessModal = getMarkupOrNull(this.getWrongGuessModal, wrongGuessModalEnabled);
    const gameOver = getMarkupOrNull(this.getGameOver, isGameOver)

    return (
      <div className="app">
        <Header />
        <div className="select-number">
          <form>
            {label}
            {input}
            {resetButton}
            {checkButton}
          </form>
          {startGameBlock}
          {invalidNumModal}
          {opponentGuess}
          {wrongGuessModal} 
          {gameOver}
        </div>
      </div>
    );
  }
}