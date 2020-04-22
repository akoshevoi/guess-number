// @flow

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Firebase import
import SignUp from '../components/signUp';
import SignIn from '../components/signIn';
import { withAuthentication } from '../components/session';

// Component import
import { Header } from '../components/header';
import ErrorBoundary from '../components/errorBoundary/ErrorBoundary';
import OpponentGuess from '../containers/OpponentGuess';
import NotFound from '../components/notFound/NotFound';
import EnterNum from '../containers/EnterNum';
import GameOver from '../containers/GameOver';

import '../assets/sass/style.scss';

// Flow type
type State = {
  username: string,
  email: string,
  passwordOne: string,
  passwordTwo: string,
  user: Object,
  error: Object,
  guessNumber: number,
  opponentNumber: number,
  invalidNumModalEnabled: boolean,
  isValidNum: boolean,
  isGameStarted: boolean,
  isGameOver: boolean,
  dataOpponents: Array<mixed>
};

// Component App

/*
 * В данном случае у компонента App нету пропсов.Но такой тип как
 * React.Component<Props, State> требует чтобы на первом месте был
 * Props, как обязательный аргумент, а State, как дополнительный аргумент,
 * на втором месте.
 * Я сделал так поставил вместо Props - null.
 * Не уверен что это корректный вариант.
 */

class App extends React.Component<null, State> {
  state = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    user: null,
    error: null,
    guessNumber: 0,
    opponentNumber: 0,
    invalidNumModalEnabled: false,
    isValidNum: false,
    isGameStarted: false,
    isGameOver: false,
    dataOpponents: []
  };

  //=== Firebase methods ===//
  changeInput = (event: Object) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeState = (email, passwordOne, passwordTwo, user, error) => {
    this.setState({
      email,
      passwordOne,
      passwordTwo,
      user,
      error
    });
  };

  changeError = (error: Object) => {
    this.setState({ error });
  };

  //=== Component methods ===//
  // A function that reset state. Called by clicking button 'Reset', 'New Game'
  resetState = () => {
    this.setState({
      guessNumber: 0,
      opponentNumber: 0,
      invalidNumModalEnabled: false,
      isValidNum: false,
      isGameStarted: false,
      isGameOver: false,
      dataOpponents: []
    });
  };

  // A function that write entered number. Called by change input
  setGuessNumber = ({ target }: Object) => {
    const validNumber = target.value.replace(/[^0-9]/g, '');
    this.setState({ guessNumber: +validNumber });
  };

  /*
   * A function that sets the validity of the entered number to a state.
   * Called by function checkValidNum
   */
  setIsValidNum = (bool: boolean) => {
    this.setState({ isValidNum: bool });
  };

  /*
   * A function that sets the visibility state of a modal window.
   * Called by function checkValidNum
   */
  setInvalidNumModalEnabled = (bool: boolean) => {
    this.setState({ invalidNumModalEnabled: bool });
  };

  /*
   * A function that checking the validity of the entered number.
   * Called by clicking button 'Confirm'
   */
  checkValidNum = (event: Object) => {
    event.preventDefault();
    const { guessNumber } = this.state;
    const isValidNum = guessNumber >= 1 && guessNumber <= 99;

    if (isValidNum) {
      this.setIsValidNum(true);
    } else {
      this.setInvalidNumModalEnabled(true);
    }
  };

  /*
   * A function that generate random number except entered number.
   * Called by function setStartGameData
   */

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

  /*
   * A function that call generate random number
   * and sets the state of start game.
   * Called by clicking button 'Start game'
   */
  setStartGameData = () => {
    const { guessNumber } = this.state;
    const opponentNumber = this.generateRandomNumber(1, 100, guessNumber);

    this.setState({
      isGameStarted: true,
      opponentNumber
    });
  };

  /*
   * A function that sets the state of end game.
   * Called if entered number equal random generated number
   */
  setGameOver = (bool: boolean) => {
    this.setState({ isGameOver: bool });
  };

  /*
   * A function that sets an array from the index of a randomly generated
   * number, a randomly generated number, id of a randomly generated number
   * into state.
   * Called if entered number equal random generated number
   */
  setDataOpponents = (array: Array<mixed>) => {
    this.setState({ dataOpponents: array });
  };

  render() {
    const {
      guessNumber,
      isValidNum,
      invalidNumModalEnabled,
      dataOpponents
    } = this.state;

    return (
      <ErrorBoundary>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              {/* Route to SignIn component */}
              <Route exact path='/'>
                <SignIn
                  email={this.state.email}
                  passwordOne={this.state.passwordOne}
                  changeInput={this.changeInput}
                  changeState={this.changeState}
                  changeError={this.changeError}
                />
              </Route>
              {/* Route to SignUp component */}
              <Route exact path='/sign-up'>
                <SignUp
                  email={this.state.email}
                  username={this.state.username}
                  passwordOne={this.state.passwordOne}
                  passwordTwo={this.state.passwordTwo}
                  changeInput={this.changeInput}
                  changeState={this.changeState}
                  changeError={this.changeError}
                />
              </Route>
              {/* Route to the enter number component */}
              <Route path='/enter-number'>
                <EnterNum
                  guessNumber={guessNumber}
                  invalidNumModalEnabled={invalidNumModalEnabled}
                  isValidNum={isValidNum}
                  resetState={this.resetState}
                  setGuessNumber={this.setGuessNumber}
                  checkValidNum={this.checkValidNum}
                  setStartGameData={this.setStartGameData}
                />
              </Route>
              {/* Route to the opponent guess component */}
              <Route path='/opponent-guess'>
                <OpponentGuess
                  guessNumber={guessNumber}
                  generateRandomNumber={this.generateRandomNumber}
                  setGameOver={this.setGameOver}
                  setDataOpponents={this.setDataOpponents}
                />
              </Route>
              {/* Route to the game over component */}
              <Route path='/game-over'>
                <GameOver
                  guessNumber={guessNumber}
                  dataOpponents={dataOpponents.length}
                  resetState={this.resetState}
                />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default withAuthentication(App);
