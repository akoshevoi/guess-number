// @flow
import React from 'react';

type Props = {
  guessNumber: number,
  dataOpponents: number,
  resetState: Function
};

const GameOver = ({ guessNumber, dataOpponents, resetState }: Props) => (
  <div className='game-over'>
    <div className='game-over-title'>The Game is Over!</div>
    <div className='game-over-banner'></div>
    <div className='game-over-content'>
      <div className='game-over-rounds'>Number of rounds: {dataOpponents}</div>
      <div className='game-over-number'>Number was: {guessNumber}</div>
      <button className='btn  btn--blue' onClick={resetState}>
        New Game
      </button>
    </div>
  </div>
);

export default GameOver;
