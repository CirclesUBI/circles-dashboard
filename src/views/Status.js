import BubbleChartRoundedIcon from '@material-ui/icons/BubbleChartRounded';
import CheckIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import Fab from '@material-ui/core/Fab';
import GrainIcon from '@material-ui/icons/Grain';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PaymentIcon from '@material-ui/icons/Payment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PropTypes from 'prop-types';
import React from 'react';
import SyncIcon from '@material-ui/icons/Sync';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';

import useStyles from '~/styles';
import web3 from '~/services/web3';
import { checkHealthState } from '~/store/health/actions';

const Status = () => {
  const health = useSelector((state) => state.health);
  const dispatch = useDispatch();

  const handleSync = () => {
    dispatch(checkHealthState());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Tooltip arrow title="Sync with latest data">
          <span>
            <Fab
              color="secondary"
              disabled={health.isLoading}
              size="small"
              onClick={handleSync}
            >
              <SyncIcon />
            </Fab>
          </span>
        </Tooltip>
      </Grid>

      <StatusContainer isReady={health.graph.isReady} title="Graph Node">
        <StatusChip
          isActive={health.graph.isReachable}
          label={health.graph.isReachable ? 'Online' : 'Offline'}
        />

        <StatusChip
          isActive={health.graph.isSynced}
          label={health.graph.isSynced ? 'Synced' : 'Out of sync'}
        />

        <StatusChip
          icon={<BubbleChartRoundedIcon />}
          isActive={!health.graph.isFailed}
          label={
            health.graph.isFailed ? 'Errors detected' : 'No errors detected'
          }
        />

        <Chip
          icon={<GrainIcon />}
          label={`${health.graph.entityCount} entities`}
        />

        <Chip
          icon={<PlaylistAddCheckIcon />}
          label={`${health.graph.latestEthereumBlockNumber} block height`}
        />
      </StatusContainer>

      <StatusContainer
        isReachable={health.relay.isReachable}
        isReady={health.relay.isReady}
        title="Relayer Service"
      >
        <StatusChip
          isActive={health.relay.isReachable}
          label={health.relay.isReachable ? 'Online' : 'Offline'}
        />

        <Chip
          icon={<PaymentIcon />}
          label={`${web3.utils.fromWei(
            health.relay.currentBalanceFunder,
          )} ETH Funder`}
        />

        <Chip
          icon={<PaymentIcon />}
          label={`${web3.utils.fromWei(
            health.relay.currentBalanceSender,
          )} ETH Sender`}
        />
      </StatusContainer>

      <StatusContainer
        isReachable={health.api.isReachable}
        isReady={health.api.isReady}
        title="API"
      >
        <StatusChip
          isActive={health.api.isReachable}
          label={health.api.isReachable ? 'Online' : 'Offline'}
        />
      </StatusContainer>

      <StatusContainer
        isReachable={health.ethereum.isReachable}
        isReady={health.ethereum.isReady}
        title="Ethereum Node"
      >
        <StatusChip
          isActive={health.ethereum.isReachable}
          label={health.ethereum.isReachable ? 'Online' : 'Offline'}
        />

        <Chip
          icon={<PlaylistAddCheckIcon />}
          label={`${health.ethereum.currentBlockHeight} block height`}
        />
      </StatusContainer>
    </Grid>
  );
};

const StatusTitle = (props) => {
  return (
    <Typography color="primary" component="h2" gutterBottom variant="h6">
      {props.children}
    </Typography>
  );
};

const StatusContainer = (props) => {
  const classes = useStyles();

  return (
    <Grid item lg={4} md={6} xs={12}>
      <Paper
        className={clsx(classes.paper, classes.chipGroup)}
        style={{ minHeight: '20em' }}
      >
        <StatusTitle>{props.title}</StatusTitle>
        {props.isReady ? props.children : <CircularProgress />}
      </Paper>
    </Grid>
  );
};

const StatusChip = (props) => {
  return (
    <Chip
      color={props.isActive ? 'primary' : 'secondary'}
      icon={props.isActive ? <CheckIcon /> : <ErrorIcon />}
      label={props.label}
    />
  );
};

StatusTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

StatusContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isReady: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

StatusChip.propTypes = {
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default Status;
