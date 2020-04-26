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

const InvalidNumModal = ({ onApply }: Function) => {
  const paperStyles = useStyles();

  const getModalContent = () => (
    <Paper classes={{ root: paperStyles.root }}>
      <h5 className='modal__title'>Invalid Number!</h5>
      <p className='modal__text'>Number has to be a number between 1 and 99</p>
      <Button color='secondary' onClick={onApply}>
        Okay
      </Button>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        onClose={onApply}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        {getModalContent()}
      </Modal>
    </ThemeProvider>
  );
};

export default InvalidNumModal;
