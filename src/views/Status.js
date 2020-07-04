import BubbleChartRoundedIcon from '@material-ui/icons/BubbleChartRounded';
import CheckIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import GrainIcon from '@material-ui/icons/Grain';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PaymentIcon from '@material-ui/icons/Payment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import useStyles from '~/styles';
import web3 from '~/services/web3';

const Status = () => {
  const health = useSelector((state) => state.health);

  return (
    <Grid container spacing={3}>
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
          label={`${health.graph.latestEthereumBlockNumber} / ${health.graph.totalEthereumBlocksCount} blocks`}
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
          label={`${web3.utils.fromWei(health.relay.currentBalance)} ETH`}
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
        isReachable={health.app.isReachable}
        isReady={health.app.isReady}
        title="Client Website"
      >
        <StatusChip
          isActive={health.app.isReachable}
          label={health.app.isReachable ? 'Online' : 'Offline'}
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
      <Paper className={clsx(classes.paper, classes.chipGroup)}>
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