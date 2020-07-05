import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import analysis from '~/services/analysis';
import { ZERO_ADDRESS } from '~/services/web3';
import useStyles from '~/styles';

const AnalysisGeneral = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const { avg, pick, avgBN, weiToCircles, count } = analysis.utils;

    const fetchData = async () => {
      setIsLoading(true);

      const results = [];

      try {
        const hubTransfers = await analysis.getTransitive();

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

        const transfers = await analysis.getTransfers();

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

        const trusts = await analysis.getTrusts();

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
          value: Math.max(
            ...Object.values(count(createdTrusts).canSendToAddress),
          ),
        });

        setData(results);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Paper className={classes.paper}>
      <Typography color="primary" component="h2" gutterBottom variant="h6">
        General
      </Typography>

      {isLoading && <CircularProgress />}

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
    </Paper>
  );
};

export default AnalysisGeneral;
