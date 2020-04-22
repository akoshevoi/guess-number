// @flow
import React from 'react';
import SignOutButton from '../signOut';
import { AuthUserContext } from '../session';
import { withFirebase } from '../firebase';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core';

// Overriding Material UI styles

const useStyles = makeStyles({
  root: {
    color: 'white',
    width: '1.5em',
    height: '1.5em'
  }
});

// Component Header
const Header = ({ firebase }) => {
  /*
   * Тут извлекаю из базы данных почту пользователя,
   * потому что не получилось извлечь имя
   */

  // Get user email
  let user = firebase.currentUser();
  let userEmail = user ? user.email : null;

  /*
   * Depending on user authorization, return
   * the header of an authorized user or an unauthorized user
   */
  return (
    <div>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <HeaderAuth userEmail={userEmail} /> : <HeaderNonAuth />
        }
      </AuthUserContext.Consumer>
    </div>
  );
};

// Header of an authorized user
const HeaderAuth = ({ userEmail }) => {
  const iconStyles = useStyles(); // styles for player icon

  return (
    <div className='header  header--auth'>
      <div className='container'>
        <div className='header__inner'>
          <div className='header__user'>
            <div className='header__icon'>
              <PersonIcon classes={{ root: iconStyles.root }} />
            </div>
            <div className='header__email'>
              <p>{userEmail}</p>
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

// Header of an unauthorized user
const HeaderNonAuth = () => (
  <div className='header'>
    <div className='container'>
      <div className='header__title'>Guess a Number</div>
    </div>
  </div>
);

export default withFirebase(Header);
