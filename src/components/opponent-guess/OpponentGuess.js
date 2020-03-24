// @flow
import React from 'react';

function OpponentGuess({ opponentNumber, setWrongGuessModalEnabled, guessNumber, opponentNumberChange, arrayOpponentNumbers}) {
  function checkBtn(e) {
    const className = e.target.className
    const valueBtn = (className.indexOf('minus') > -1) ? 'minus' : 'plus';
    const biggerNumber = (guessNumber > opponentNumber) ? 'player' : 'computer';
    if ((valueBtn === 'plus' && biggerNumber === 'computer') || (valueBtn === 'minus' && biggerNumber === 'player')) {
      setWrongGuessModalEnabled();
    } else {
      opponentNumberChange(valueBtn);
    }
  }

  const elements = arrayOpponentNumbers.map(({ index, number, id}) => {
    return (
      <div key={id} className="opponent-guess-item">
        <div className="opponent-guess-element">#{index}</div>
        <div className="opponent-guess-element">{number}</div>
      </div>
    )
  })

  return (
    <div>
      <div className="opponent-guess-title">Opponent's Guess</div>
      <div className="opponent-guess-number">{opponentNumber}</div>
      <div className="opponent-guess-btn-group">
        <button className="btn  btn--number minus" 
        onClick={checkBtn}>-</button>
        <button className="btn  btn--number plus"
        onClick={checkBtn}>+</button>
      </div>
      <div className="opponent-guess-list">{elements}</div>
    </div>
  )
}

export default OpponentGuess