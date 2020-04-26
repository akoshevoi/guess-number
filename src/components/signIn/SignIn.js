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

const SignIn = ({
  firebase,
  history,
  email,
  passwordOne,
  changeInput,
  changeState,
  changeError
}: Props) => {
  const classes = useStyles();

   /**
   * Status of showing / hiding password, highlighting inputs, 
   * contents of auxiliary texts
   */
  const [isGlowErrorEmail, setGlowErrorEmail] = useState(false);
  const [isGlowErrorPassword, setGlowErrorPassword] = useState(false);

  const [errorTextPassword, setErrorTextPassword] = useState('');

  const [isShowPassword, setShowPassword] = useState(false);

  // SignIn functions
  const onChange = event => {
    changeInput(event);
  };

  const showError = error => {
    if (error) {
      setGlowErrorEmail(true);
      setGlowErrorPassword(true);
      setErrorTextPassword(error);
    } else {
      setGlowErrorEmail(false);
      setGlowErrorPassword(false);
      setErrorTextPassword('');
    }
  };

  const showPassword = () => {
    setShowPassword(!isShowPassword);
  };

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

  const onSubmit = event => {
    event.preventDefault();
    logIn();
  };

  const signIn = () => {
    history.push('/sign-up');
  };

  return (
    <ThemeProvider theme={theme}>
      {/* SignIn form container */}
      <div className='auth'>
        {/* Card with box-shadow */}
        <Paper>
          <form onSubmit={onSubmit}>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                type='text'
                name='email'
                label='Enter email'
                variant='outlined'
                onChange={onChange}
                error={isGlowErrorEmail}
              />
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant='outlined'
            >
              <InputLabel
                style={isGlowErrorPassword ? { color: 'red' } : null}
                htmlFor='standard-adornment-password'
              >
                Enter password
              </InputLabel>
              <OutlinedInput
                type={isShowPassword ? 'text' : 'password'}
                name='passwordOne'
                id='standard-adornment-password'
                onChange={onChange}
                error={isGlowErrorPassword}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={showPassword}
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
              <span className='auth__question'>Don't have an account?</span> 
              <Button color='primary' onClick={signIn}>
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
