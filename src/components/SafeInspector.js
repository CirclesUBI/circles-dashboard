import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AdjustIcon from '@material-ui/icons/Adjust';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoneyIcon from '@material-ui/icons/Money';
import MuiAlert from '@material-ui/lab/Alert';
import PaymentIcon from '@material-ui/icons/Payment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import core from '~/services/core';
import resolveSafeAddress from '~/utils/resolveUsers';
import useStyles from '~/styles';
import web3 from '~/services/web3';

const SafeInspector = ({ selectedSafeAddress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const update = async () => {
      try {
        const balance = await core.token.getBalance(selectedSafeAddress);
        const tokenAddress = await core.token.getAddress(selectedSafeAddress);
        const user = await resolveSafeAddress(selectedSafeAddress);

        setDetails({
          balance: web3.utils.fromWei(balance),
          tokenAddress,
          username: user.data.length > 0 ? user.data[0].username : null,
        });
      } catch (error) {
        console.error(error);
        setDetails(null);
      }

      setIsLoading(false);
    };

    if (selectedSafeAddress) {
      setIsLoading(true);
      setDetails(null);
      update();
    }
  }, [selectedSafeAddress]);

  if (!selectedSafeAddress) {
    return null;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!details) {
    return (
      <MuiAlert elevation={2} severity="error" variant="filled">
        Could not find anything about node &quot;
        {selectedSafeAddress.slice(0, 16)} ...&quot; Are you sure it exists?
      </MuiAlert>
    );
  }

  return (
    <div className={classes.chipGroup}>
      <Tooltip arrow title="Public address">
        <Chip
          color="secondary"
          icon={<AdjustIcon />}
          label={selectedSafeAddress}
        />
      </Tooltip>

      {details.username ? (
        <Tooltip arrow title="Username">
          <Chip icon={<AccountCircleIcon />} label={details.username} />
        </Tooltip>
      ) : null}

      <Tooltip arrow title="Token address">
        <Chip
          icon={<MoneyIcon />}
          label={
            details.tokenAddress ? details.tokenAddress : 'No Token available'
          }
        />
      </Tooltip>

      <Tooltip arrow title="Token balance">
        <Chip icon={<PaymentIcon />} label={details.balance} />
      </Tooltip>
    </div>
  );
};

SafeInspector.propTypes = {
  selectedSafeAddress: PropTypes.string,
};

export default SafeInspector;
