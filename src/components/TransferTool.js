import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import PaymentIcon from '@material-ui/icons/Payment';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import SendIcon from '@material-ui/icons/Send';

import core from '~/services/core';
import web3 from '~/services/web3';

const TransferTool = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const ref = useRef();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogText('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(ref.current);
    const data = ['from', 'to', 'value'].reduce((acc, name) => {
      acc[name] = formData.get(name);
      return acc;
    }, {});

    try {
      if (!data.value || parseInt(data.value, 10) <= 0) {
        throw new Error('"value" is missing or invalid');
      }

      const transfer = await core.token.findTransitiveTransfer(
        web3.utils.toChecksumAddress(data.from),
        web3.utils.toChecksumAddress(data.to),
        web3.utils.toBN(web3.utils.toWei(data.value, 'ether')),
      );

      props.onPathFound(transfer);
    } catch (error) {
      setDialogText(error.message);
      setIsDialogOpen(true);
    }

    setIsLoading(false);
  };

  return (
    <form autoComplete="off" noValidate ref={ref}>
      {isLoading && <CircularProgress />}

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Transitive transfer failed</DialogTitle>

        <DialogContent>
          <DialogContentText>{dialogText}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button autoFocus color="primary" onClick={handleDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel htmlFor="from">Sender address</InputLabel>

            <Input
              disabled={isLoading}
              id="from"
              name="from"
              required
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl>
            <InputLabel htmlFor="from">Receiver address</InputLabel>

            <Input
              disabled={isLoading}
              id="to"
              name="to"
              required
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl>
            <InputLabel htmlFor="from">Value</InputLabel>

            <Input
              disabled={isLoading}
              id="value"
              name="value"
              required
              startAdornment={
                <InputAdornment position="start">
                  <PaymentIcon />
                </InputAdornment>
              }
              type="number"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            color="primary"
            disabled={isLoading}
            startIcon={<SendIcon />}
            type="submit"
            variant="contained"
            onClick={handleSubmit}
          >
            Simulate transfer
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

TransferTool.propTypes = {
  onPathFound: PropTypes.func.isRequired,
};

export default TransferTool;
