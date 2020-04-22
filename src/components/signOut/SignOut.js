// @flow
import React from 'react';
import { withFirebase } from '../firebase';
import { makeStyles, Button } from '@material-ui/core';

// Overriding Material UI styles
const useStylesColors = makeStyles({
  root: {
    'backgroundColor': 'white',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#ff4eab'
    }
  }
});

// Component SignOutButton
const SignOutButton = ({ firebase }: Object) => {
  const signOutButton = useStylesColors(); // styles for Sign Out button

  return (
    <div>
      <Button
        variant='contained'
        classes={{ root: signOutButton.root }}
        onClick={firebase.doSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default withFirebase(SignOutButton);
