// @flow
import {
  Button,
  createMuiTheme,
  Grid,
  makeStyles,
  Paper,
  TextField,
  ThemeProvider
} from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/sass/style.scss';
import { InvalidNumModal } from '../components/modals';
import { withAuthorization } from '../components/session';
import { SubHeader } from '../components/subHeader';
import { getMarkupOrNull } from '../utils/helpers';

// Overriding Material UI styles
const useStylesFontSize = makeStyles({
  root: {
    fontSize: 16
  }
});

const useStylesColors = makeStyles({
  root: {
    'fontSize': 16,
    'color': '#dc00dc',
    'textTransform': 'capitalize',
    '&:hover': {
      color: '#f120ff',
      backgroundColor: '#f020ff1a'
    }
  }
});

const theme = createMuiTheme({
  overrides: {
    // TextField component
    MuiInput: {
      formControl: {
        'label + &': {
          marginTop: 25
        }
      }
    },
    MuiFormControl: {
      root: {
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }
    },
    MuiFormLabel: {
      root: {
        width: '100%',
        color: '#000'
      }
    },
    MuiInputLabel: {
      formControl: {
        width: '100%',
        textAlign: 'center',
        transform: `translate(${0}px, ${15}px) scale(1)`
      },
      shrink: {
        fontSize: 18,
        textAlign: 'center',
        visibility: 'visible',
        position: 'absolute',
        transform: 'none'
      }
    },
    MuiInputBase: {
      input: {
        padding: 5,
        textAlign: 'center',
        fontSize: 25
      },
      root: {
        width: '20%'
      }
    },
    // Grid component
    MuiGrid: {
      container: {
        margin: '5px 0'
      },
      item: {
        margin: 5
      }
    },
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
  guessNumber: number,
  invalidNumModalEnabled: boolean,
  isValidNum: boolean,
  resetState: Function,
  setGuessNumber: Function,
  checkValidNum: Function,
  setStartGameData: Function
};


const EnterNum = ({
  guessNumber,
  invalidNumModalEnabled,
  isValidNum,
  resetState,
  setGuessNumber,
  checkValidNum,
  setStartGameData
}: Props) => {
  const blueButton = useStylesFontSize(); // styles for button 'START GAME
  const pinkButton = useStylesColors(); // styles for button 'Reset', 'Confirm'

  let history = useHistory(); 

  const goToNextScreen = () => {
    setStartGameData(); 
    history.push('/opponent-guess'); 
  };

  // A piece of markup that appear if the number is valid
  const getStartGameBlock = () => (
    <div className='start-game'>
      <h5 className='start-game__title'>You selected</h5>
      <div className='start-game__number'>{guessNumber}</div>
      <Button
        color='primary'
        classes={{ root: blueButton.root }}
        onClick={goToNextScreen}
      >
        Start Game
      </Button>
    </div>
  );

  const getInvalidNumModal = () => <InvalidNumModal onApply={resetState} />;

  const startGameBlock = getMarkupOrNull(getStartGameBlock, isValidNum);
  const invalidNumModal = getMarkupOrNull(
    getInvalidNumModal,
    invalidNumModalEnabled
  );

  return (
    <div className='app'>
      <SubHeader />
      <p className='select-number__title'>Start a New Game!</p>
      <ThemeProvider theme={theme}>
        {/* Card with box-shadow */}
        <Paper>
          <form>
            {/* Common Grid-container */}
            <Grid
              container
              direction='column'
              justify='space-between'
              alignItems='center'
            >
              {/* Input Grid-item */}
              <Grid item>
                <TextField
                  id='standard-secondary'
                  label='Select a Number'
                  color='primary'
                  onChange={setGuessNumber}
                  value={guessNumber === isValidNum ? '' : guessNumber}
                />
              </Grid>
              {/* Button Grid-container */}
              <Grid
                container
                direction='row'
                justify='space-evenly'
                alignItems='center'
              >
                {/* Button Grid-item */}
                <Grid item>
                  <Button
                    color='secondary'
                    classes={{ root: pinkButton.root }}
                    onClick={resetState}
                  >
                    Reset
                  </Button>
                </Grid>
                {/* Button Grid-item */}
                <Grid item>
                  <Button
                    color='secondary'
                    classes={{ root: pinkButton.root }}
                    onClick={checkValidNum}
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </ThemeProvider>
      {/* A piece of markup that appear if the number is invalid */}
      {invalidNumModal}
      {/* A piece of markup that appear if the number is valid */}
      {startGameBlock}
    </div>
  );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(EnterNum);
