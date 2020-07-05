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
import TransferTool from '~/components/TransferTool';
import useStyles from '~/styles';

const Network = () => {
  const classes = useStyles();
  const [selectedSafeAddress, setSelectedSafeAddress] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const handleSafeSelected = (safeAddress) => {
    setSelectedSafeAddress(safeAddress);
  };

  const handleTransferPath = (transfer) => {
    setSelectedTransfer(transfer);
  };

  const handleTransferReset = () => {
    setSelectedTransfer(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <Paper className={classes.paperNetwork}>
          <Explorer
            selectedSafeAddress={selectedSafeAddress}
            selectedTransfer={selectedTransfer}
            onSafeSelected={handleSafeSelected}
            onTransferReset={handleTransferReset}
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

          <AccordionDetails className={classes.accordionDetails}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Search for usernames by entering a query in the input below or
                  directly enter a public address and resolve its connected
                  username. After searching you can click on a result to show
                  the node in the graph.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <SafeSearch
                  selectedSafeAddress={selectedSafeAddress}
                  onSafeSelected={handleSafeSelected}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="primary" component="h4" variant="h6">
              Inspect
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Select a node by clicking on it in the network or search
                  results.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <SafeInspector selectedSafeAddress={selectedSafeAddress} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="primary" component="h4" variant="h6">
              Transfer
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Test transitive transactions in the network by visualizing a
                  potential path between two nodes.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TransferTool onPathFound={handleTransferPath} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default Network;
