import React from 'react';
import Grid from '@material-ui/core/Grid';

import AnalysisGeneral from '~/components/AnalysisGeneral';
import AnalysisVelocity from '~/components/AnalysisVelocity';

const Statistics = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AnalysisGeneral />
      </Grid>

      <Grid item xs={12}>
        <AnalysisVelocity />
      </Grid>
    </Grid>
  );
};

export default Statistics;
