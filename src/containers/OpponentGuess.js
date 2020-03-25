// @flow
import React from "react";

import { WrongGuessModal } from "../components/modals";
import { getMarkupOrNull } from "../utils/helpers";

/*
 * перенести сюда в локальный стейт логику отображения и скрытия WrongGuessModal
 */

const OpponentGuess = ({
  opponentNumber,//
  wrongGuessModalEnabled,//
  setWrongGuessModalEnabled,
  guessNumber,//
  opponentNumberChange,//
  dataOpponents,//
  onCloseWrongGuessModal//
}) => {
  const checkBtn = e => {
    const className = e.target.className;
    const valueBtn = className.indexOf("minus") > -1 ? "minus" : "plus";
    const biggerNumber = guessNumber > opponentNumber ? "player" : "computer";

    if (
      (valueBtn === "plus" && biggerNumber === "computer") ||
      (valueBtn === "minus" && biggerNumber === "player")
    ) {
      setWrongGuessModalEnabled();
    } else {
      opponentNumberChange(valueBtn);
    }
  };

  const elements = dataOpponents.map(({ index, number, id }) => {
    return (
      <div key={id} className="opponent-guess-item">
        <div className="opponent-guess-element">#{index}</div>
        <div className="opponent-guess-element">{number}</div>
      </div>
    );
  });
/*
  function getWrongGuessModal() {
    return <WrongGuessModal onCloseWrongGuessModal={onCloseWrongGuessModal} />
  };

  const wrongGuessModal = getMarkupOrNull(getWrongGuessModal, wrongGuessModalEnabled);
*/
  return (
    <div>
      <div className="opponent-guess-title">Opponent's Guess</div>
      <div className="opponent-guess-number">{opponentNumber}</div>
      <div className="opponent-guess-btn-group">
        <button className="btn  btn--number minus" onClick={checkBtn}>
          -
        </button>
        <button className="btn  btn--number plus" onClick={checkBtn}>
          +
        </button>
      </div>
      <div className="opponent-guess-list">{elements}</div>
       {/* {wrongGuessModal}  */}
    </div>
  );
};

export default OpponentGuess;