// @flow
import { makeStyles } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import { withFirebase } from '../firebase';
import { AuthUserContext } from '../session';
import SignOutButton from '../signOut';

// Overriding Material UI styles
const useStyles = makeStyles({
  root: {
    color: 'white',
    width: '1.5em',
    height: '1.5em'
  }
});

const Header = ({ firebase }) => {
  let user = firebase.currentUser();
  let userName = user ? user.displayName : null;
  
  return (
    <div>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <HeaderAuth userName={userName} /> : <HeaderNonAuth />
        }
      </AuthUserContext.Consumer>
    </div>
  );
};

const HeaderAuth = ({ userName }) => {
  const iconStyles = useStyles(); 

  return (
    <div className='header  header--auth'>
      <div className='container'>
        <div className='header__inner'>
          <div className='header__user'>
            <div className='header__icon'>
              <PersonIcon classes={{ root: iconStyles.root }} />
            </div>
            <div className='header__email'>
              <p>{userName}</p>
            </div>
          </div>
          <div className='header__btn'>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderNonAuth = () => (
  <div className='header'>
    <div className='container'>
      <div className='header__title'>Guess a Number</div>
    </div>
  </div>
);

export default withFirebase(Header);
