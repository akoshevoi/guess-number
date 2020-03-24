// @flow
import React from 'react';

function GameOver({ guessNumber, arrayOpponentNumbers, resetState }) {
  return (
    <div className="game-over">
      <div className="game-over-title">The Game is Over!</div>
      <div className="game-over-banner"></div>
      <div className="game-over-rounds">Number of rounds:{arrayOpponentNumbers[0].index}</div>
      <div className="game-over-number">Number was:{guessNumber}</div>
      <button className="btn  btn--blue" onClick={resetState}>New Game</button>
    </div>
  )
}

export default GameOver;