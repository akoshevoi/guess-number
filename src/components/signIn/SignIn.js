// @flow
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../firebase';

import clsx from 'clsx';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
  Paper,
  Button,
  TextField,
  OutlinedInput,
  InputLabel,
  FormControl,
  IconButton,
  InputAdornment,
  FormHelperText
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// Overriding Material UI styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
  }
}));

const theme = createMuiTheme({
  overrides: {
    // Paper component
    MuiPaper: {
      root: {
        margin: '20px auto',
        padding: 10
      },
      elevation1: {
        boxShadow: '0px 0px 3px 3px rgba(0,0,0,0.2)'
      }
    }
  }
});

// Flow type
type Props = {
  firebase: Object,
  history: Object,
  email: string,
  passwordOne: string,
  changeInput: Function,
  changeState: Function,
  changeError: Function
};

// Component SignIn
const SignIn = ({
  firebase,
  history,
  email,
  passwordOne,
  changeInput,
  changeState,
  changeError
}: Props) => {
  // Hooks useState

  // A state of showing/hiding of password
  const [isShowPassword, showPassword] = useState(false);

  // Email input highlight status
  const [isErrorEmail, setIsErrorEmail] = useState(false);

  // Password input highlight status
  const [isErrorPassword, seIsErrorPassword] = useState(false);

  // Password input helper text contents
  const [errorTextPassword, setErrorTextPassword] = useState('');

  // A function that write in state value of input. Called by change input
  const onChange = event => {
    changeInput(event);
  };

  /*
   * A function that colors email addresses and passwords in red
   * and displays an error message. Called by clickin button 'Sign In'.
   */
  const showError = error => {
    if (error) {
      setIsErrorEmail(true);
      seIsErrorPassword(true);
      setErrorTextPassword(error);
    } else {
      setIsErrorEmail(false);
      seIsErrorPassword(false);
      setErrorTextPassword('');
    }
  };

  // Classes for hiding or showing password
  const classes = useStyles();

  // A function that show/hide password
  const handleClickShowPassword = () => {
    showPassword(!isShowPassword);
  };

  /*
   * A function that logs in via password, email
   * and jumps to the game start screen or
   * colors email addresses and passwords in red
   * and displays an error message.
   * Called by function onSubmit
   */
  const logIn = () => {
    firebase
      .doSignInWithEmailAndPassword(email, passwordOne)
      .then(() => {
        changeState();
        history.push('/enter-number');
      })
      .catch(error => {
        changeError(error);
        if (error) {
          showError(error.message);
        }
      });
  };

  /*
   * A function that doing same actions that function logIn.
   * Called by clicking button SignIn
   */
  const onSubmit = event => {
    event.preventDefault();
    logIn();
  };

  /*
   * A fuction that jumps to the sign up screen.
   * Called by clicking Sign Un button
   */
  const signUp = () => {
    history.push('/sign-up');
  };

  return (
    <ThemeProvider theme={theme}>
      {' '}
      {/* Change styles of MUI component */}
      <div className='auth'>
        {/* Card with box-shadow */}
        <Paper>
          <form onSubmit={onSubmit}>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                type='text'
                name='email'
                value={email}
                label='Enter email'
                variant='outlined'
                onChange={onChange}
                error={isErrorEmail}
              />
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant='outlined'
            >
              <InputLabel
                style={isErrorPassword ? { color: 'red' } : null}
                htmlFor='standard-adornment-password'
              >
                Enter password
              </InputLabel>
              <OutlinedInput
                type={isShowPassword ? 'text' : 'password'}
                name='passwordOne'
                value={passwordOne}
                id='standard-adornment-password'
                onChange={onChange}
                error={isErrorPassword}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                    >
                      {isShowPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={110}
              />
              <FormHelperText style={{ color: 'red' }}>
                {errorTextPassword}
              </FormHelperText>
            </FormControl>
            <FormControl className={clsx(classes.margin)}>
              <Button type='submit' variant='contained' color='primary'>
                Sign In
              </Button>
            </FormControl>
            {/* Sign Up button */}
            <p>
              Don't have an account?
              <Button color='primary' onClick={signUp}>
                Sign Up
              </Button>
            </p>
          </form>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default compose(withRouter, withFirebase)(SignIn);
