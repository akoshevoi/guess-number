// @flow
import React from 'react';
import { Link } from 'react-router-dom';

type Method = Function;

const InvalidNumModal = ({ onApply }: Method) => (
	<div className='overlay' onClick={onApply}>
		<div className='modal'>
			<h5 className='modal-title'>Invalid Number!</h5>
			<p className='modal-text'>Number has to be a number between 1 and 99</p>
			<Link className='btn  btn--orange' onClick={onApply}>
				Okay
			</Link>
		</div>
	</div>
);

export default InvalidNumModal;
