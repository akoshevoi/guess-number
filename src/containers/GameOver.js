// @flow
import React from 'react';
import { SubHeader } from '../components/subHeader';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';
import { withAuthorization } from '../components/session';

// Overriding Material UI styles
const useStyles = makeStyles({
  root: {
    fontSize: 16
  }
});

// Flow type
type Props = {
  guessNumber: number,
  dataOpponents: number,
  resetState: Function
};

// Component GameOver
const GameOver = ({ guessNumber, dataOpponents, resetState }: Props) => {
  const buttonStyles = useStyles(); // styles for button 'NEW GAME'

  let history = useHistory(); // variable with history of routings

  /*
   * A function that returns to the start screen and starts the game again.
   * Called by clickin button 'New Game'
   */
  const startNewGame = () => {
    resetState();
    history.push('/enter-number');
  };

  return (
    <div className='app'>
      <SubHeader />
      <div className='game-over'>
        <div className='game-over__title'>The Game is Over!</div>
        <div className='game-over__banner'></div>
        <div className='game-over__content'>
          <div className='game-over__rounds'>
            Number of rounds: {dataOpponents}
          </div>
          <div className='game-over__number'>Number was: {guessNumber}</div>
          <Button
            color='primary'
            onClick={startNewGame}
            classes={{ root: buttonStyles.root }}
          >
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(GameOver);
