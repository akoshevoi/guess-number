// @flow
import React from "react";

const InvalidNumModal = ({ onApply }) => (
  <div className="overlay">
    <div className="modal">
      <h5 className="modal-title">Invalid Number!</h5>
      <p className="modal-text">Number has to be a number between 1 and 99</p>
      <button className="btn  btn--orange" onClick={onApply}>
        Okay
      </button>
    </div>
  </div>
);

export default InvalidNumModal;
