import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

import Explorer from '~/components/Explorer';
import SafeInspector from '~/components/SafeInspector';
import SafeSearch from '~/components/SafeSearch';
import useStyles from '~/styles';

const Network = () => {
  const classes = useStyles();
  const [selectedSafeAddress, setSelectedSafeAddress] = useState(false);

  const handleSafeSelected = (safeAddress) => {
    setSelectedSafeAddress(safeAddress);
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <Paper className={classes.paperNetwork}>
          <Explorer
            selectedSafeAddress={selectedSafeAddress}
            onSafeSelected={handleSafeSelected}
          />
        </Paper>
      </Grid>

      <Grid item md={4} xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="primary" component="h4" variant="h6">
              Search
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <SafeSearch
              selectedSafeAddress={selectedSafeAddress}
              onSafeSelected={handleSafeSelected}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="primary" component="h4" variant="h6">
              Inspect
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <SafeInspector selectedSafeAddress={selectedSafeAddress} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="primary" component="h4" variant="h6">
              Transfer
            </Typography>
          </AccordionSummary>

          <AccordionDetails></AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default Network;
