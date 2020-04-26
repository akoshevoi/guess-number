// @flow
import {
  Backdrop,
  Button,
  createMuiTheme,
  makeStyles,
  Modal,
  Paper,
  ThemeProvider
} from '@material-ui/core';
import React from 'react';

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

const WrongGuessModal = ({ onCloseWrongGuessModal }: Function) => {
  const paperStyles = useStyles();

  const getModalContent = () => (
    <Paper classes={{ root: paperStyles.root }}>
      <h5 className='modal__title'>Don't Lie!</h5>
      <p className='modal__text'>You know that is wrong...</p>
      <Button color='primary' onClick={onCloseWrongGuessModal}>
        Okay
      </Button>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={true}
        onClose={onCloseWrongGuessModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        {getModalContent()}
      </Modal>
    </ThemeProvider>
  );
};

export default WrongGuessModal;
