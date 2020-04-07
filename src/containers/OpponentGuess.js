// @flow
import React, { useState, useEffect, useRef } from 'react';
import { WrongGuessModal } from '../components/modals';
import { getMarkupOrNull } from '../utils/helpers';

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
  const [wrongGuessModalEnabled, setWrongGuessModalEnabled] = useState(false);

  const getWrongGuessModal = () => (
    <WrongGuessModal
      onCloseWrongGuessModal={() => setWrongGuessModalEnabled(false)}
    />
  );
  const wrongGuessModal = getMarkupOrNull(
    getWrongGuessModal,
    wrongGuessModalEnabled
  );

  const initialGuess = generateRandomNumber(1, 100, guessNumber);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([
    {
      index: 1,
      number: initialGuess.toString(),
      id: Math.random().toString(36).substr(2, 9)
    }
  ]);
  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  useEffect(() => {
    if (currentGuess === guessNumber) {
      setGameOver(true);
      setDataOpponents(pastGuesses);
    }
  }, [currentGuess, guessNumber, setGameOver, setDataOpponents, pastGuesses]);

  function statisticGueses(e) {
    const valueBtn = e.target.className;
    const direction = valueBtn.indexOf('lower') > -1 ? 'lower' : 'greater';

    if (
      (direction === 'lower' && currentGuess < guessNumber) ||
      (direction === 'greater' && currentGuess > guessNumber)
    ) {
      setWrongGuessModalEnabled(!wrongGuessModalEnabled);
      return;
    }

    if (direction === 'lower') {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }

    const nextNumber = generateRandomNumber(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );

    setCurrentGuess(nextNumber);

    const newItem = {
      index: pastGuesses.length + 1,
      number: nextNumber.toString(),
      id: Math.random().toString(36).substr(2, 9)
    };

    setPastGuesses(curPastGuesses => [newItem, ...curPastGuesses]);
  }

  const elements = pastGuesses.map(({ index, number, id }) => {
    return (
      <div key={id} className='opponent-guess-item'>
        <div className='opponent-guess-element'>#{index}</div>
        <div className='opponent-guess-element'>{number}</div>
      </div>
    );
  });

  return (
    <div>
      <div className='opponent-guess-title'>Opponent's Guess</div>
      <div className='opponent-guess-number'>{currentGuess}</div>
      <div className='opponent-guess-btn-group'>
        <button className='btn  btn--number lower' onClick={statisticGueses}>
          -
        </button>
        <button className='btn  btn--number greater' onClick={statisticGueses}>
          +
        </button>
      </div>
      <div className='opponent-guess-list'>{elements}</div>
      {wrongGuessModal}
    </div>
  );
};

export default OpponentGuess;
