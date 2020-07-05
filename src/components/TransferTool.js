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
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

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
    const data = ['from', 'to', 'value', 'hops'].reduce((acc, name) => {
      acc[name] = formData.get(name);
      return acc;
    }, {});

    try {
      if (!data.value || parseInt(data.value, 10) <= 0) {
        throw new Error('"value" is missing or invalid');
      }

      const {
        transactionsPath,
        maximumFlow,
      } = await core.token.calculateTransfer(
        data.from,
        data.to,
        web3.utils.toBN(web3.utils.toWei(data.value, 'ether')),
        parseInt(data.hops, 10),
      );

      props.onPathFound({
        from: data.from,
        maximumFlow: web3.utils.fromWei(maximumFlow, 'ether'),
        to: data.to,
        transactionsPath: transactionsPath.map((transaction) => {
          transaction.value = web3.utils.fromWei(transaction.value, 'ether');
          return transaction;
        }),
        value: data.value.toString(),
      });
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
          <FormControl>
            <Tooltip
              arrow
              title="How many steps will the algorithm take maximally to find the receiver in the senders trust network"
            >
              <Typography gutterBottom id="hops">
                Network hops
              </Typography>
            </Tooltip>

            <Slider
              defaultValue={3}
              disabled={isLoading}
              id="hops"
              max={10}
              min={1}
              name="hops"
              step={1}
              valueLabelDisplay="auto"
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
