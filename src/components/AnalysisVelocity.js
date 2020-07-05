import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { ResponsiveLine } from '@nivo/line';

import analysis from '~/services/analysis';
import web3 from '~/services/web3';
import useStyles, { colors } from '~/styles';

const AnalysisVelocity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const velocity = await analysis.getVelocity();

        setData([
          {
            id: 'velocity',
            data: velocity.map((datum) => {
              return {
                x: datum.date,
                y: parseFloat(web3.utils.fromWei(datum.amount, 'ether'), 10),
              };
            }),
          },
        ]);
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
        Velocity (Circles / Day)
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box style={{ height: '20em' }}>
          <ResponsiveLine
            animate
            axisBottom={{
              format: '%B',
              tickValues: 'every 1 month',
            }}
            axisLeft={{
              tickValues: 5,
            }}
            colors={colors.secondary}
            curve={'monotoneX'}
            data={data}
            enableArea={true}
            enablePointLabel={true}
            enablePoints={false}
            enableSlices={false}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            useMesh={true}
            xFormat="time:%d.%m.%Y"
            xScale={{
              type: 'time',
              format: '%Y/%m/%d',
              useUTC: false,
              precision: 'day',
            }}
            yFormat={(value) =>
              `${Number(value).toLocaleString('en', {
                minimumFractionDigits: 2,
              })} Circles`
            }
            yScale={{
              type: 'linear',
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default AnalysisVelocity;
