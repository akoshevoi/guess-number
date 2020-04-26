// @flow
import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../assets/sass/style.scss';

// Overriding Material UI styles
const useStyles = makeStyles({
  root: {
    fontSize: 16
  }
});

const NotFound = () => {
  const buttonStyles = useStyles(); 
  let history = useHistory(); 

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
