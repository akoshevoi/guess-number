// @flow
import React from "react";

import Header from '../components/header';
import { InvalidNumModal } from "../components/modals";
import { WrongGuessModal } from "../components/modals";
import OpponentGuess from "../components/opponent-guess";
import GameOver from '../components/game-over';

import '../assets/sass/style.scss';

const INITIAL_STATE = {
  guessNumber: 0,
  isValidNum: false,
  invalidNumModalEnabled: false,
  isStartGame: false,
  opponentNumber: 0,
  whoseNumberBigger: '',
  valueBtn: '',
  wrongGuessModalEnabled: false,
  arrayOpponentNumbers: [],
  isGameOver: false
};

export default class EnterNum extends React.Component {
  clicks = 1;
  state = { ...INITIAL_STATE };

  resetState = () => {
    console.log("resetState: ");
    this.clicks = 1;
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
      /*
       * когда будет настроен роутинг и будет скрин отгадывания, то перенаправлять на него
       */
      this.setIsValidNum(true);
    } else {
      this.setInvalidNumModalEnabled(true);
    }
  };

  setRandomOpponentNumber = maxNumber => {
    const { guessNumber } = this.state;
    let randomNumber = Math.floor((Math.random()*maxNumber)+1);
    if (randomNumber === guessNumber) {
      randomNumber = Math.floor((Math.random()*maxNumber)+1);
    }
    return randomNumber;
  };

  setStartGameData = () => {
    const opponentNumber = this.setRandomOpponentNumber(99);
    const biggerNumber = (this.state.guessNumber > opponentNumber) ? 'player' : 'computer';
    this.setState({ 
      isStartGame: true, 
      opponentNumber,
      whoseNumberBigger: biggerNumber,
    }) 
  };


  setWrongGuessModalEnabled = () => {this.setState({wrongGuessModalEnabled: true})};

  addArrayNumberItem = randomNumber => {
    const newItem = {index: this.clicks++, number: randomNumber, id: Math.random().toString(36).substr(2, 9),}
    const oldArray = this.state.arrayOpponentNumbers;
    const newArray = [
      newItem,
      ...oldArray,
    ];
    this.setState({
      opponentNumber: randomNumber,
      arrayOpponentNumbers: newArray
    })
  };

  opponentNumberChange = value => {
    if (value === 'minus') {
      let randomPartNumber = Math.floor(Math.random() * 5);
      let randomNumber = Math.floor((this.state.guessNumber - randomPartNumber) + Math.random() * (this.state.opponentNumber - this.state.guessNumber));
      this.addArrayNumberItem(randomNumber);
      console.log(this.state.arrayOpponentNumbers);
      if (randomNumber === this.state.guessNumber) {
        this.setState({isGameOver: true})
      } 
    } else {
      let randomPartNumber = Math.floor(Math.random() * 5);
      let randomNumber = Math.floor((this.state.opponentNumber + randomPartNumber) + Math.random() * (this.state.guessNumber - this.state.opponentNumber));
      this.addArrayNumberItem(randomNumber);
      console.log(this.state.arrayOpponentNumbers);
      if (randomNumber === this.state.guessNumber) {
        this.setState({isGameOver: true})
      }
    }     
  };
  
  onCloseWrongGuessModal = () => {
    this.setState((state) => {
      return {wrongGuessModalEnabled: !state.wrongGuessModalEnabled}
    })
  };

  setGameOver = () => {this.setState({isGameOver: true})};

  render() {
    const { guessNumber,
            isValidNum,
            invalidNumModalEnabled,
            isStartGame,
            opponentNumber,
            whoseNumberBigger,
            valueBtn,
            wrongGuessModalEnabled,
            arrayOpponentNumbers,
            isGameOver } = this.state;
            
    return (
      <div className="app">
        <Header />
        <div className="select-number">
          <form>
            <div className="form-control">
              <label className="select-number-label" htmlFor="input">
                Select a Number
              </label>
            </div>
            <div className="form-control">
              <input
                className="select-number-input"
                onChange={this.setGuessNumber}
                value={guessNumber}
                id="input"
              />
            </div>
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
          </form>
          {isValidNum && (
            <div className="start-game">
              <h5 className="start-game-title">You selected</h5>
              <div className="start-game-number">{guessNumber}</div>
              <button className="btn  btn--blue"
                onClick={this.setStartGameData}>Start Game</button>
            </div>
          )}
          {invalidNumModalEnabled && (
            <InvalidNumModal onApply={this.resetState} />
          )}
          {isStartGame && (
            <OpponentGuess 
              opponentNumber={opponentNumber} 
              setWrongGuessModalEnabled={this.setWrongGuessModalEnabled} 
              guessNumber={guessNumber} 
              opponentNumberChange={this.opponentNumberChange} 
              arrayOpponentNumbers={arrayOpponentNumbers} />
          )}
          {wrongGuessModalEnabled && (
            <WrongGuessModal onCloseWrongGuessModal={this.onCloseWrongGuessModal} />
          )}
          {isGameOver && (
            <GameOver 
              guessNumber={guessNumber} 
              arrayOpponentNumbers={arrayOpponentNumbers} 
              resetState={this.resetState} />
          )}
        </div>
      </div>
    );
  }
}
