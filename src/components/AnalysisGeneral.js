import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import analysis, { getAnalysisData } from '~/services/analysis';
import useStyles from '~/styles';
import { ZERO_ADDRESS } from '~/services/web3';

const AnalysisGeneral = () => {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const { isReady, updatedAt } = useSelector((state) => state.analysis);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const { avg, pick, avgBN, weiToCircles, count } = analysis.utils;
    const { hubTransfers, transfers, trusts } = getAnalysisData();
    const results = [];

    // Hub transfers

    results.push({
      label: 'Average amount',
      value: weiToCircles(avgBN(pick(hubTransfers, 'amount'))),
    });

    results.push({
      label: 'Average total received transfers per user',
      value: avg(Object.values(count(hubTransfers).from)),
    });

    results.push({
      label: 'Max total received transfers per user',
      value: Math.max(...Object.values(count(hubTransfers).to)),
    });

    // Transfers

    const ubiPayouts = transfers.filter((item) => {
      return item.from === ZERO_ADDRESS;
    });

    results.push({
      label: 'Average UBI payout amount',
      value: weiToCircles(avgBN(pick(ubiPayouts, 'amount'))),
    });

    results.push({
      label: 'UBI payouts count',
      value: ubiPayouts.length,
    });

    // Trust

    const revokedTrusts = trusts.filter((item) => {
      return item.limitPercentage === '0';
    });

    const createdTrusts = trusts.filter((item) => {
      return item.limitPercentage !== '0';
    });

    results.push({
      label: 'Created trust connections',
      value: createdTrusts.length,
    });

    results.push({
      label: 'Revoked trust connections',
      value: revokedTrusts.length,
    });

    results.push({
      label: 'Average outgoing trust connections',
      value: avg(Object.values(count(createdTrusts).canSendToAddress)),
    });

    results.push({
      label: 'Average incoming trust connections',
      value: avg(Object.values(count(createdTrusts).userAddress)),
    });

    results.push({
      label: 'Max outgoing trust connections',
      value: Math.max(...Object.values(count(createdTrusts).userAddress)),
    });

    results.push({
      label: 'Max incoming trust connections',
      value: Math.max(...Object.values(count(createdTrusts).canSendToAddress)),
    });

    setData(results);
  }, [updatedAt, isReady]);

  return (
    <Paper className={classes.paper}>
      <Typography color="primary" component="h2" gutterBottom variant="h6">
        General
      </Typography>

      {!isReady ? (
        <CircularProgress />
      ) : (
        <Box className={classes.chipGroup}>
          {data.map((item, index) => {
            return (
              <Tooltip arrow key={index} title={item.value}>
                <Chip
                  label={`${item.label}: ${item.value.toString().slice(0, 6)}`}
                />
              </Tooltip>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default AnalysisGeneral;
