import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import SyncIcon from '@material-ui/icons/Sync';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector, useDispatch } from 'react-redux';

import AnalysisGeneral from '~/components/AnalysisGeneral';
import AnalysisVelocity from '~/components/AnalysisVelocity';
import { checkAnalysisState } from '~/store/analysis/actions';

const Statistics = () => {
  const { isLoading } = useSelector((state) => state.analysis);
  const dispatch = useDispatch();

  const handleSync = () => {
    dispatch(checkAnalysisState());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Tooltip arrow title="Sync with latest data">
          <span>
            <Fab
              color="secondary"
              disabled={isLoading}
              size="small"
              onClick={handleSync}
            >
              <SyncIcon />
            </Fab>
          </span>
        </Tooltip>
      </Grid>

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
