// @flow
import {
  Button,
  createMuiTheme,
  makeStyles,
  Paper,
  ThemeProvider
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import shortid from 'shortid';
import '../assets/sass/style.scss';
import { WrongGuessModal } from '../components/modals';
import { withAuthorization } from '../components/session';
import { SubHeader } from '../components/subHeader';
import { getMarkupOrNull } from '../utils/helpers';


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

const OpponentGuess = ({
  guessNumber,
  generateRandomNumber,
  setGameOver,
  setDataOpponents
}: Props) => {

  let history = useHistory();
  const buttonStyles = useStyles();

  /**
   * Initial call generateRandomNumber function
   * Status of showing / hiding wrong guess modal; current guess number, 
   * array of guessable numbers, guessable range of numbers
   */
  const initialGuess = generateRandomNumber(1, 100, guessNumber);
  const [wrongGuessModalEnabled, setWrongGuessModalEnabled] = useState(false);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([
    {
      index: 1,
      number: initialGuess.toString(),
      id: shortid.generate()
    }
  ]);
  const currentLow = useRef(1);
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

  const setWrongGuessModalVisibility = bool => setWrongGuessModalEnabled(bool);

  // *** Components methods *** //
  const getValueBtn = event => {
    const valueBtn = event.target.textContent;
    const directionGuesses = valueBtn === '-' ? 'lower' : 'greater';
    return directionGuesses;
  };

  const checkCheatingPlayer = directionGuesses => {
    const isWrongGusessCondition =
      (directionGuesses === 'lower' && currentGuess < guessNumber) ||
      (directionGuesses === 'greater' && currentGuess > guessNumber);
    return isWrongGusessCondition;
  };

  const changeRangeNumbers = directionGuesses => {
    if (directionGuesses === 'lower') {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
  };

  const statisticGuesses = event => {
    const trendGuesses = getValueBtn(event);
    const wrongGuessCondition = checkCheatingPlayer(trendGuesses);

    if (wrongGuessCondition) {
      setWrongGuessModalVisibility(true);
    } else {
      changeRangeNumbers(trendGuesses);

      const nextNumber = generateRandomNumber(
        currentLow.current,
        currentHigh.current,
        currentGuess
      );
      setCurrentGuess(nextNumber); 

      const newItem = {
        index: pastGuesses.length + 1,
        number: nextNumber.toString(),
        id: shortid.generate()
      };
      setPastGuesses(curPastGuesses => [newItem, ...curPastGuesses]);
    }
  };

  const getWrongGuessModal = () => (
    <WrongGuessModal
      onCloseWrongGuessModal={() => setWrongGuessModalEnabled(false)}
    />
  );

  const wrongGuessModal = getMarkupOrNull(
    getWrongGuessModal,
    wrongGuessModalEnabled
  );

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
        {/* Card with box-shadow */}
        <Paper>
          {/* Button minus */}
          <Button
            variant='contained'
            color='secondary'
            onClick={statisticGuesses}
            classes={{ root: buttonStyles.root }}
          >
            -
          </Button>
          {/* Button plus */}
          <Button
            variant='contained'
            color='secondary'
            onClick={statisticGuesses}
            classes={{ root: buttonStyles.root }}
          >
            +
          </Button>
        </Paper>
      </ThemeProvider>
      <div className='opponent-guess__list'>{elements}</div>
      {/* A piece of markup that appear if the player is cheating */}
      {wrongGuessModal}
    </div>
  );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(OpponentGuess);
