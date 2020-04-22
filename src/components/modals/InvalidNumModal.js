// @flow
import React from 'react';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
  Modal,
  Backdrop,
  Paper,
  Button
} from '@material-ui/core';

// Overriding Material UI styles
const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: '1000',
    transform: `translate(${-50}%, ${-50}%)`
  }
});

const theme = createMuiTheme({
  overrides: {
    // Button
    MuiButton: {
      root: {
        fontSize: 16,
        textTransform: 'capitalize'
      },
      textSecondary: {
        'color': '#ff7600',
        '&:hover': {
          color: '#f9b072',
          backgroundColor: '#ffd6b37e'
        }
      }
    },
    // Paper
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

type Method = Function; // flow type

// Component InvalidNumModal
const InvalidNumModal = ({ onApply }: Method) => {
  const paperStyles = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={true}
        onClose={onApply}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Paper classes={{ root: paperStyles.root }}>
          <h5 className='modal__title'>Invalid Number!</h5>
          <p className='modal__text'>
            Number has to be a number between 1 and 99
          </p>
          <Button color='secondary' onClick={onApply}>
            Okay
          </Button>
        </Paper>
      </Modal>
    </ThemeProvider>
  );
};

export default InvalidNumModal;
