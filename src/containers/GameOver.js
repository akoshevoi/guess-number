// @flow
import React from 'react';

type digit = Number;
type method = Function;

const GameOver = ({ guessNumber, dataOpponents, resetState } : { guessNumber : digit, dataOpponents : digit, resetState : method }) => (
  <div className="game-over">
    <div className="game-over-title">The Game is Over!</div>
    <div className="game-over-banner"></div>
    <div className="game-over-content">
      <div className="game-over-rounds">Number of rounds:  {dataOpponents}</div>
      <div className="game-over-number">Number was:  {guessNumber}</div>
      <button className="btn  btn--blue" onClick={resetState}>New Game</button>
    </div>
  </div>
);

export default GameOver;
