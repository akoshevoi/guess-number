// @flow
import {
  Button,
  createMuiTheme,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Paper,
  TextField,
  ThemeProvider
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import React, { useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../firebase';

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
    // TextField component
    MuiInputBase: {
      input: {
        width: 150,
        minWidth: 'none'
      }
    },
    // Paper component
    MuiPaper: {
      root: {
        margin: '20px auto',
        padding: 20
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
  changeInput: Function,
  changeState: Function,
  changeError: Function
};

const SignUp = ({
  firebase,
  history,
  changeInput,
  changeState,
  changeError
}: Props) => {
  const passwordOneValue: Object = useRef();

  const classes = useStyles();

  const regExpEmail = /^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/;
  /* eslint-disable max-len */
  const regExpPassword = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{7,}/;

  /* eslint-enable max-len */
  const errorMessages = {
    emptyUsername: 'Please enter name',
    emptyPassword: 'Please enter password',
    notEqualPasswords: 'Passwords not equal',
    invalidEmail: 'Email is invalid.Please enter correct email.',
    invalidPassword: `Password must contain 7 characters, 
    at least one uppercase letter and one number.`
  };

  /**
   * Status of showing / hiding passwords, highlighting inputs,
   * disabling / enabling the registration button, contents of auxiliary texts
   */
  const [isEmptyUsername, setEmptyUsername] = useState(false);
  const [textEmptyUsername, setTextEmptyUsername] = useState('');

  const [isGlowErrorEmail, setGlowErrorEmail] = useState(false);
  const [errorTextEmail, setErrorTextEmail] = useState('');

  const [isGlowErrorPassword, setGlowErrorPassword] = useState(false);
  const [errorTextPassword, setErrorTextPassword] = useState('');
  const [isGlowEqualPasswords, setGlowEqualPasswords] = useState(false);
  const [equalTextPasswords, setEqualTextPasswords] = useState('');

  const [isShowPasswordOne, setShowPasswordOne] = useState(false);
  const [isShowPasswordTwo, setShowPasswordTwo] = useState(false);

  const [isDisableSignUpButton, setDisableSignUpButton] = useState(false);

  // SignUp functions
  const onChange = event => {
    changeInput(event);
  };

  const checkEmptyUsername = event => {
    if (event.target.value === '') {
      setEmptyUsername(true);
      setTextEmptyUsername(errorMessages.emptyUsername);
      setDisableSignUpButton(true);
    } else {
      setEmptyUsername(false);
      setTextEmptyUsername('');
      setDisableSignUpButton(false);
    }
  };

  const checkEmptyValue = (value, setGlow, setText, setDisableBtn, text) => {
    if (value === '') {
      setGlow(true);
      setText(`Please enter ${text}`);
      setDisableBtn(true);
    } else {
      setGlow(false);
      setText('');
      setDisableBtn(false);
    }
  };

  const checkValidityValue = (
    value,
    regExp,
    setGlow,
    setText,
    setDisableBtn,
    text
  ) => {
    const isValidValue = regExp.test(value);

    if (!isValidValue) {
      setGlow(true);
      setText(`${text}`);
      setDisableBtn(true);
    } else {
      setGlow(false);
      setText('');
      setDisableBtn(false);
    }
  };

  const checkCorrectEmail = ({ target }) => {
    const email = target.value;

    if (email === '') {
      checkEmptyValue(
        email,
        setGlowErrorEmail,
        setErrorTextEmail,
        setDisableSignUpButton,
        'email'
      );
    } else {
      checkValidityValue(
        email,
        regExpEmail,
        setGlowErrorEmail,
        setErrorTextEmail,
        setDisableSignUpButton,
        errorMessages.invalidEmail
      );
    }
  };

  const checkCorrectPassword = ({ target }) => {
    const password = target.value;

    if (password === '') {
      checkEmptyValue(
        password,
        setGlowErrorPassword,
        setErrorTextPassword,
        setDisableSignUpButton,
        'password'
      );
    } else {
      checkValidityValue(
        password,
        regExpPassword,
        setGlowErrorPassword,
        setErrorTextPassword,
        setDisableSignUpButton,
        errorMessages.invalidPassword
      );
    }
  };

  const checkEqualityPasswords = ({ target }) => {
    const passwordOne = passwordOneValue.current.childNodes[0].value;
    const passwordTwo = target.value;

    if (passwordOne !== passwordTwo) {
      setGlowEqualPasswords(true);
      setEqualTextPasswords(errorMessages.notEqualPasswords);
      setDisableSignUpButton(true);
    } else {
      setGlowEqualPasswords(false);
      setEqualTextPasswords('');
      setDisableSignUpButton(false);
    }
  };

  const showPasswordOne = () => {
    setShowPasswordOne(!isShowPasswordOne);
  };

  const showPasswordTwo = () => {
    setShowPasswordTwo(!isShowPasswordTwo);
  };

  const createUser = (email, password, username) => {
    firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        firebase.user(authUser.user.uid);
        authUser.user
          .updateProfile({
            displayName: username
          })
          .then(() => {
            firebase
              .doCreateUser(authUser.user.uid, username, email, password)
              .then(() => {
                changeState();
                history.push('/enter-number');
              });
          });
      })
      .catch(error => {
        changeError(error);
        if (error) {
          setGlowErrorEmail(true);
          setErrorTextEmail(error.message);
          setDisableSignUpButton(true);
        } else {
          setGlowErrorEmail(true);
          setErrorTextEmail('');
          setDisableSignUpButton(false);
        }
      });
  };

  const onSubmit = event => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.passwordOne.value;
    const passwordConfirm = event.target.passwordTwo.value;

    if (password !== passwordConfirm) {
      setGlowEqualPasswords(true);
      setEqualTextPasswords(errorMessages.notEqualPasswords);
      setDisableSignUpButton(true);
    } else if (password === '' || passwordConfirm === '') {
      setGlowEqualPasswords(true);
      setEqualTextPasswords(errorMessages.emptyPassword);
      setDisableSignUpButton(true);
    } else {
      setGlowEqualPasswords(false);
      setEqualTextPasswords('');
      setDisableSignUpButton(false);
      createUser(email, password, username);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* SignUp form container */}
      <div className='auth'>
        {/* Card with box-shadow */}
        <Paper>
          {/* SignUp form */}
          <form onSubmit={onSubmit}>
            {/* Username */}
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                type='text'
                name='username'
                label='Enter name'
                variant='outlined'
                onChange={onChange}
                onBlur={checkEmptyUsername}
                error={isEmptyUsername}
                helperText={textEmptyUsername}
              />
            </FormControl>
            {/* Email */}
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                type='email'
                name='email'
                label='Enter email'
                variant='outlined'
                onChange={onChange}
                onBlur={checkCorrectEmail}
                error={isGlowErrorEmail}
                helperText={errorTextEmail}
              />
            </FormControl>
            {/* Password */}
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant='outlined'
            >
              <InputLabel
                style={isGlowErrorPassword ? { color: 'red' } : null}
                htmlFor='standard-adornment-passwordOne'
              >
                Enter password
              </InputLabel>
              <OutlinedInput
                type={isShowPasswordOne ? 'text' : 'password'}
                name='passwordOne'
                id='passwordOne'
                onChange={onChange}
                onBlur={checkCorrectPassword}
                error={isGlowErrorPassword}
                ref={passwordOneValue}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      edge='end'
                      onClick={showPasswordOne}
                    >
                      {isShowPasswordOne ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={110}
              />
              <FormHelperText style={{ color: 'red' }}>
                {errorTextPassword}
              </FormHelperText>
            </FormControl>
            {/* Confirm Password */}
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant='outlined'
            >
              <InputLabel
                style={isGlowEqualPasswords ? { color: 'red' } : null}
                htmlFor='standard-adornment-passwordTwo'
              >
                Confirm password
              </InputLabel>
              <OutlinedInput
                type={isShowPasswordTwo ? 'text' : 'password'}
                name='passwordTwo'
                id='passwordTwo'
                onChange={onChange}
                onBlur={checkEqualityPasswords}
                error={isGlowEqualPasswords}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      edge='end'
                      onClick={showPasswordTwo}
                    >
                      {isShowPasswordTwo ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={130}
              />
              <FormHelperText style={{ color: 'red' }}>
                {equalTextPasswords}
              </FormHelperText>
            </FormControl>
            {/* SignUp Button */}
            <FormControl className={clsx(classes.margin)}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={isDisableSignUpButton}
              >
                Sign Up
              </Button>
            </FormControl>
          </form>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default compose(withRouter, withFirebase)(SignUp);
