// @flow
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  guessNumber: number,
  setStartGameData: Function
};

const StartGame = ({ guessNumber, setStartGameData }: Props) => (
  <div className='start-game'>
    <h5 className='start-game-title'>You selected</h5>
    <div className='start-game-number'>{guessNumber}</div>
    <Link
      to='opponent-guess'
      className='btn  btn--blue'
      onClick={setStartGameData}
    >
      Start Game
    </Link>
  </div>
);

export default StartGame;
