import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AdjustIcon from '@material-ui/icons/Adjust';
import Box from '@material-ui/core/Box';
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
import web3, { ZERO_ADDRESS } from '~/services/web3';

const resolveSilently = async (method, args) => {
  return await new Promise((resolve) => {
    method(args)
      .then(resolve)
      .catch(() => {
        // Silently fail ..
        resolve(null);
      });
  });
};

const SafeInspector = ({ selectedSafeAddress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const update = async () => {
      try {
        const balance = await resolveSilently(
          core.token.getBalance,
          selectedSafeAddress,
        );

        const user = await resolveSafeAddress(selectedSafeAddress);

        const tokenAddress = await resolveSilently(
          core.token.getAddress,
          selectedSafeAddress,
        );

        setDetails({
          balance: balance ? web3.utils.fromWei(balance) : null,
          tokenAddress,
          username:
            user.data && user.data.length > 0 ? user.data[0].username : null,
        });
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
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
        {selectedSafeAddress.slice(0, 16)} ...&quot; Maybe this account is not
        deployed yet?
      </MuiAlert>
    );
  }

  return (
    <Box className={classes.chipGroup}>
      <Tooltip arrow title="Public address">
        <Chip
          color="secondary"
          icon={<AdjustIcon />}
          label={selectedSafeAddress}
        />
      </Tooltip>

      {details.username && (
        <Tooltip arrow title="Username">
          <Chip icon={<AccountCircleIcon />} label={details.username} />
        </Tooltip>
      )}

      <Tooltip arrow title="Token address">
        <Chip
          icon={<MoneyIcon />}
          label={
            details.tokenAddress && details.tokenAddress !== ZERO_ADDRESS
              ? details.tokenAddress
              : 'No Token available'
          }
        />
      </Tooltip>

      {details.balance && (
        <Tooltip arrow title="Token balance">
          <Chip icon={<PaymentIcon />} label={details.balance} />
        </Tooltip>
      )}
    </Box>
  );
};

SafeInspector.propTypes = {
  selectedSafeAddress: PropTypes.string,
};

export default SafeInspector;
