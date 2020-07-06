import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AdjustIcon from '@material-ui/icons/Adjust';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import MoneyIcon from '@material-ui/icons/Money';
import MuiAlert from '@material-ui/lab/Alert';
import PaymentIcon from '@material-ui/icons/Payment';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import graphRequest from '~/services/graphql';

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

const getAllTokens = async (safeAddress) => {
  try {
    const endpoint = `${process.env.GRAPH_NODE_EXTERNAL}/subgraphs/name/${process.env.SUBGRAPH_NAME}`;

    const query = `{
      safe(id: "${safeAddress.toLowerCase()}") {
        balances {
          token {
            id
            owner {
              id
            }
          }
          amount
        }
      }
    }`;

    const { safe } = await graphRequest(endpoint, query);

    return safe.balances.map((balance) => {
      return {
        balance: web3.utils.fromWei(balance.amount, 'ether').toString(),
        tokenAddress: balance.token.id,
        tokenOwnerAddress: balance.token.owner.id,
      };
    });
  } catch {
    return null;
  }
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

        const tokens = await getAllTokens(selectedSafeAddress);

        setDetails({
          tokens,
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
    <Fragment>
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

      {details.tokens && details.tokens.length > 0 && (
        <Fragment>
          <Box marginTop={2}>
            <Divider variant="middle" />
          </Box>

          <Box marginBottom={2} marginTop={2}>
            <Typography color="primary" component="h4">
              Tokens
            </Typography>
          </Box>

          <Box className={classes.chipGroup}>
            {details.tokens.map(
              ({ tokenAddress, tokenOwnerAddress, balance }) => {
                return (
                  <Tooltip
                    arrow
                    key={tokenAddress}
                    title={`Owner address: ${tokenOwnerAddress}, Token address: ${tokenAddress}`}
                  >
                    <Chip label={`${balance}: ${tokenOwnerAddress}`} />
                  </Tooltip>
                );
              },
            )}
          </Box>
        </Fragment>
      )}
    </Fragment>
  );
};

SafeInspector.propTypes = {
  selectedSafeAddress: PropTypes.string,
};

export default SafeInspector;
