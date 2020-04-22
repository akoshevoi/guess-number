// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';
import '../../assets/sass/style.scss';

// Overriding Material UI styles
const useStyles = makeStyles({
  root: {
    fontSize: 16
  }
});

// Component NotFound
const NotFound = () => {
  const buttonStyles = useStyles(); // styles for button 'START GAME'
  let history = useHistory(); // variable with history of routings

  /*
   * A function that jump to the enter number screen.
   * Called by clicking button 'START GAME'
   */
  const startGame = () => {
    history.push('/enter-number');
  };

  return (
    <div className='not-found'>
      <div className='not-found__content'>
        <p className='not-found__number'>404</p>
        <p className='not-found__text'>Page not found</p>
      </div>
      <Button
        color='primary'
        onClick={startGame}
        classes={{ root: buttonStyles.root }}
      >
        START GAME
      </Button>
    </div>
  );
};

export default NotFound;
