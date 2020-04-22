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
  OutlinedInput,
  TextField,
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
  email: string,
  username: string,
  passwordOne: string,
  passwordTwo: string,
  changeInput: Function,
  changeState: Function,
  changeError: Function
};

// Component SignUp
const SignUp = ({
  firebase,
  history,
  email,
  username,
  passwordOne,
  passwordTwo,
  changeInput,
  changeState,
  changeError
}: Props) => {
  // Hooks useState

  // A state of showing/hiding of first password
  const [isShowPasswordOne, showPasswordOne] = useState(false);

  // A state of showing/hiding of second password
  const [isShowPasswordTwo, showPasswordTwo] = useState(false);

  // Registration button off/on status
  const [isDisableButton, setDisableButton] = useState(false);

  // Email input highlight status
  const [isErrorEmail, setIsErrorEmail] = useState(false);

  // Email input helper text contents
  const [errorTextEmail, setErrorTextEmail] = useState('');

  // Password input highlight status
  const [isErrorPassword, seIsErrorPassword] = useState(false);

  // Password input helper text contents
  const [errorTextPassword, setErrorTextPassword] = useState('');

  // Result of password comparison. Confirm password input highlight status
  const [isEqualPasswords, setIsEqualPasswords] = useState(false);

  // Confirm password input helper text contents
  const [isEqualPasswordsBacklight, setIsEqualPasswordsBacklight] = useState(
    ''
  );

  // A function that write in state value of input.Called by change input
  const onChange = event => {
    changeInput(event);
  };

  /*
   * A function that check email input.
   * Called when the focus is outside the email input.
   */
  const checkEmail = event => {
    const email = event.target.value;
    const isValidEmail = /^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/.test(email);
    const isErrorEmail = !isValidEmail;
    setIsErrorEmail(isErrorEmail);

    if (isErrorEmail) {
      setErrorTextEmail('Email is invalid.Please enter correct email.');
      setDisableButton(true);
    } else {
      setErrorTextEmail('');
      setDisableButton(false);
    }
  };

  /*
   * A function that check password input.
   * Called when the focus is outside the password input.
   */
  const checkPassword = event => {
    const password = event.target.value;
    const isValidPassword = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{7,}/.test(
      password
    );
    const isErrorPassword = !isValidPassword;
    seIsErrorPassword(isErrorPassword);

    if (isErrorPassword) {
      setErrorTextPassword(
        `Password must contain 7 characters,
        at least one uppercase letter and one number.`
      );
      setDisableButton(true);
    } else {
      setErrorTextPassword('');
      setDisableButton(false);
    }
  };

  // A function that check equal first and second password
  const checkConfirmPassword = event => {
    const passwordOne = document.getElementById('passwordOne').value;
    /*
     * Если написать так, то flow не ругается, но тогда код не работает
     * const passwordOne =
     * (<HTMLInputElement>document.getElementById('passwordOne')).value;
     */
    const passwordTwo = event.target.value;

    if (passwordOne !== passwordTwo) {
      setIsEqualPasswords(true);
      setIsEqualPasswordsBacklight('Passwords not equal');
      setDisableButton(true);
    } else {
      setIsEqualPasswords(false);
      setIsEqualPasswordsBacklight('');
      setDisableButton(false);
    }
  };

  // Classes of hiding or showing password
  const classes = useStyles();

  // A function that show/hide first password
  const handleClickShowPasswordOne = () => {
    showPasswordOne(!isShowPasswordOne);
  };

  // A function that show/hide second password
  const handleClickShowPasswordTwo = () => {
    showPasswordTwo(!isShowPasswordTwo);
  };

  /*
   * A function that create new user
   * and jumps to the game start screen.
   * Called by function onSubmit
   */
  const createUser = (email, password, username) => {
    firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return firebase.user(authUser.user.uid).set({
          displayName: username,
          email: email,
          password: password
        });
      })
      .then(() => {
        changeState();
        history.push('/enter-number');
      })
      .catch(error => {
        changeError(error);
      });
  };

  /*
  Создал функцию для добавления в профиль пользователя имени пользователя.
  Это имя хотел потом использовать для того что-бы 
  оно появлялось вверху в синей полоске,когда игрок заходит в игру. 
  Данная функция не работает. В предыдущей функции createUser имя заноситься 
  в базу данных Realtime Database. 
  .set({
        displayName: username,
        email: email,
        password: password,
      })

  Но как это имя достать из базы данных не знаю. 
  Могу достать значение свойства displayName,
  но я не могу в это свойство записать имя

  const updateUser = username => {
    let person = firebase.currentUser();
    console.log(person);
    person.updateProfile({
      displayName: username
    })
  }
  */

  /*
   * A function that doing same actions that function createUser.
   * Called by clicking Sign Up button
   */
  const onSubmit = event => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.passwordOne.value;
    const passwordConfirm = event.target.passwordTwo.value;

    if (password !== passwordConfirm) {
      setIsEqualPasswords(true);
      setIsEqualPasswordsBacklight('Please enter correct password');
      setDisableButton(true);
    } else if (password === '' || passwordConfirm === '') {
      setIsEqualPasswords(true);
      setIsEqualPasswordsBacklight('Please enter password');
      setDisableButton(true);
    } else {
      setIsEqualPasswords(false);
      setIsEqualPasswordsBacklight('');
      setDisableButton(false);
      createUser(email, password, username);
    }

    //updateUser(username); // вызов функции, которая не работает.
    //Не работает наверно потому что это функция обновления профиля,
    // а он еще не создался.
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
                value={username}
                label='Enter name'
                variant='outlined'
                onChange={onChange}
              />
            </FormControl>
            {/* Email */}
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                type='email'
                name='email'
                value={email}
                label='Enter email'
                variant='outlined'
                onChange={onChange}
                onBlur={checkEmail}
                error={isErrorEmail}
                helperText={errorTextEmail}
              />
            </FormControl>
            {/* Password */}
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant='outlined'
            >
              <InputLabel
                style={isErrorPassword ? { color: 'red' } : null}
                htmlFor='standard-adornment-passwordOne'
              >
                Enter password
              </InputLabel>
              <OutlinedInput
                type={isShowPasswordOne ? 'text' : 'password'}
                name='passwordOne'
                value={passwordOne}
                id='passwordOne'
                onChange={onChange}
                onBlur={checkPassword}
                error={isErrorPassword}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      edge='end'
                      onClick={handleClickShowPasswordOne}
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
                style={isEqualPasswords ? { color: 'red' } : null}
                htmlFor='standard-adornment-passwordTwo'
              >
                Confirm password
              </InputLabel>
              <OutlinedInput
                type={isShowPasswordTwo ? 'text' : 'password'}
                name='passwordTwo'
                value={passwordTwo}
                id='passwordTwo'
                onChange={onChange}
                onBlur={checkConfirmPassword}
                error={isEqualPasswords}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPasswordTwo}
                    >
                      {isShowPasswordTwo ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={130}
              />
              <FormHelperText style={{ color: 'red' }}>
                {isEqualPasswordsBacklight}
              </FormHelperText>
            </FormControl>
            {/* SignUp Button */}
            <FormControl className={clsx(classes.margin)}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={isDisableButton}
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
