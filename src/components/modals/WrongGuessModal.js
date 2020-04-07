// @flow
import React from 'react';

type Method = Function;

const WrongGuessModal = ({ onCloseWrongGuessModal }: Method) => (
	<div className='overlay' onClick={onCloseWrongGuessModal}>
		<div className='modal'>
			<h5 className='modal-title'>Don't Lie!</h5>
			<p className='modal-text'>You know that is wrong...</p>
			<button className='btn  btn--blue' onClick={onCloseWrongGuessModal}>
				Sorry!
			</button>
		</div>
	</div>
);

export default WrongGuessModal;
