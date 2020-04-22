// @flow
import React, { useState, useEffect, useRef } from 'react';
import { SubHeader } from '../components/subHeader';
import { useHistory } from 'react-router-dom';
import { withAuthorization } from '../components/session';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
  Paper,
  Button
} from '@material-ui/core';
import { getMarkupOrNull } from '../utils/helpers';
import { WrongGuessModal } from '../components/modals';
import '../assets/sass/style.scss';

// Overriding Material UI styles
const useStyles = makeStyles({
  root: {
    minWidth: 76,
    margin: '10px 24px',
    fontSize: 21,
    borderRadius: 30
  },
  containedSecondary: {
    backgroundColor: '#ff4eab'
  }
});

const theme = createMuiTheme({
  overrides: {
    // Grid component
    MuiGrid: {
      container: {
        margin: '5px 0'
      },
      item: {
        margin: 5
      }
    },
    // Paper component
    MuiPaper: {
      root: {
        margin: '20px auto',
        padding: 10,
        textAlign: 'center'
      },
      elevation1: {
        boxShadow: '0px 0px 3px 3px rgba(0,0,0,0.2)'
      }
    }
  }
});

// Flow type
type Props = {
  guessNumber: number,
  generateRandomNumber: Function,
  setGameOver: Function,
  setDataOpponents: Function
};

// Component OpponentGuess
const OpponentGuess = ({
  guessNumber,
  generateRandomNumber,
  setGameOver,
  setDataOpponents
}: Props) => {
  // Initializing shortid library for generate random id
  const shortid = require('shortid');

  // Variable with history of routings
  let history = useHistory();

  // Initial call generateRandomNumber function
  const initialGuess = generateRandomNumber(1, 100, guessNumber);

  // Styles for buttons '+', '-'
  const buttonStyles = useStyles();

  // useState Hooks

  // State of WrongGuessModal
  const [wrongGuessModalEnabled, setWrongGuessModalEnabled] = useState(false);

  // State of current GuessNumber
  const [currentGuess, setCurrentGuess] = useState(initialGuess);

  // State of array GuessNumbers
  const [pastGuesses, setPastGuesses] = useState([
    {
      index: 1,
      number: initialGuess.toString(),
      id: shortid.generate()
    }
  ]);

  // useRef

  // Minimum value of the range of guessed numbers
  const currentLow = useRef(1);

  // Maximum value of the range of guessed numbers
  const currentHigh = useRef(100);

  /* useEffect.
   * Called when guessNumber equal OpponetNumber.
   * Passes array of GuessNumbers to Component GameOver
   */

  useEffect(() => {
    if (currentGuess === guessNumber) {
      setGameOver(true);
      setDataOpponents(pastGuesses);
      history.push('/game-over');
    }
  }, [
    currentGuess,
    guessNumber,
    setGameOver,
    setDataOpponents,
    pastGuesses,
    history
  ]);

  // A function that set value of visibility WrongGuessModal in state
  const setWrongGuessModalVisibility = bool => setWrongGuessModalEnabled(bool);

  // A function that check what button clicked
  const getDirection = event => {
    const valueBtn = event.target.textContent;
    const direction = valueBtn === '-' ? 'lower' : 'greater';
    return direction;
  };

  // A function that check cheating Player
  const cheatingPlayer = direction => {
    const isWrongGusessCondition =
      (direction === 'lower' && currentGuess < guessNumber) ||
      (direction === 'greater' && currentGuess > guessNumber);
    return isWrongGusessCondition;
  };

  // A function that change range of guessed numbers
  const changeRangeNumbers = direction => {
    if (direction === 'lower') {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
  };

  /*
   * A function that generate new random number
   * and write a new random number in array
   */
  const statisticGueses = event => {
    // Call function that check what button clicked
    const direction = getDirection(event);

    // Call function that check cheating Player
    const condition = cheatingPlayer(direction);

    // Checking condition of cheating Player
    if (condition) {
      setWrongGuessModalVisibility(true);
    } else {
      changeRangeNumbers(direction);

      // Generate new random number
      const nextNumber = generateRandomNumber(
        currentLow.current,
        currentHigh.current,
        currentGuess
      );
      setCurrentGuess(nextNumber); // write a new random number

      // Write new number in array
      const newItem = {
        index: pastGuesses.length + 1,
        number: nextNumber.toString(),
        id: shortid.generate()
      };
      setPastGuesses(curPastGuesses => [newItem, ...curPastGuesses]);
    }
  };

  // A component that appear if the number is invalid (InvalidNumModal)
  const getWrongGuessModal = () => (
    <WrongGuessModal
      onCloseWrongGuessModal={() => setWrongGuessModalEnabled(false)}
    />
  );

  /*
   * A helper function that shows the WrongGuessModal component
   * depending on whether the player is cheating
   */
  const wrongGuessModal = getMarkupOrNull(
    getWrongGuessModal,
    wrongGuessModalEnabled
  );

  /*
   * A piece of the markup that contains the attempt sequence number
   * and the randomly generated number
   */
  const elements = pastGuesses.map(({ index, number, id }) => (
    <div key={id} className='opponent-guess__item'>
      <div className='opponent-guess__element'>#{index}</div>
      <div className='opponent-guess__element'>{number}</div>
    </div>
  ));

  return (
    <div className='app'>
      <SubHeader />
      <div className='opponent-guess__title'>Opponent's Guess</div>
      <div className='opponent-guess__number'>{currentGuess}</div>
      <ThemeProvider theme={theme}>
        <Paper>
          <Button
            variant='contained'
            color='secondary'
            onClick={statisticGueses}
            classes={{ root: buttonStyles.root }}
          >
            -
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={statisticGueses}
            classes={{ root: buttonStyles.root }}
          >
            +
          </Button>
        </Paper>
      </ThemeProvider>
      <div className='opponent-guess__list'>{elements}</div>
      {wrongGuessModal}
    </div>
  );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(OpponentGuess);
