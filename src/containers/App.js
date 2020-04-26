// @flow

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../assets/sass/style.scss';
import ErrorBoundary from '../components/errorBoundary/ErrorBoundary';
// Component import
import { Header } from '../components/header';
import NotFound from '../components/notFound/NotFound';
import { withAuthentication } from '../components/session';
import SignIn from '../components/signIn';
// Firebase import
import SignUp from '../components/signUp';
import EnterNum from '../containers/EnterNum';
import GameOver from '../containers/GameOver';
import OpponentGuess from '../containers/OpponentGuess';

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

const INITIAL_STATE = {
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

class App extends React.Component<{}, State> {
  state = { ...INITIAL_STATE };

  // ***  Firebase methods *** //
  changeInput = ({ target }: Object) => {
    this.setState({ [target.name]: target.value });
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

  // *** Components methods *** //
  resetState = () => {
    this.setState(() => ({ ...INITIAL_STATE }));
  };

  setGuessNumber = ({ target }: Object) => {
    const validNumber = target.value.replace(/[^0-9]/g, '');
    this.setState({ guessNumber: +validNumber });
  };

  setIsValidNum = (bool: boolean) => {
    this.setState({ isValidNum: bool });
  };

  setInvalidNumModalEnabled = (bool: boolean) => {
    this.setState({ invalidNumModalEnabled: bool });
  };

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

    this.setState({
      isGameStarted: true,
      opponentNumber
    });
  };

  setGameOver = (bool: boolean) => {
    this.setState({ isGameOver: bool });
  };

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
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default withAuthentication(App);
