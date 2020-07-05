import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useDebouncedCallback } from 'use-debounce';

import core from '~/services/core';
import resolveSafeAddress from '~/utils/resolveUsers';
import web3 from '~/services/web3';

const SEARCH_DEBOUNCE = 500;
const MAX_RESULTS = 5;

const SafeSearch = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [results, setResults] = useState([]);

  const [debouncedSearch, cancelSearch] = useDebouncedCallback(
    async (query) => {
      const response = web3.utils.isAddress(query)
        ? await resolveSafeAddress(query)
        : await core.user.search(query);

      setResults(response.data.slice(0, MAX_RESULTS));
      setIsLoading(false);
    },
    SEARCH_DEBOUNCE,
  );

  const handleInput = async (event) => {
    const { value: query } = event.target;
    const isEmpty = query.length === 0;

    setResults([]);
    setIsQueryEmpty(isEmpty);
    cancelSearch();

    if (isEmpty) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch(query);
  };

  const handleSelect = (safeAddress) => {
    props.onSafeSelected(safeAddress);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField label="Username or address" onChange={handleInput} />
      </Grid>

      {isLoading || results.length === 0 ? (
        <Grid item xs={12}>
          {isLoading && <CircularProgress />}
          {!isLoading && results.length === 0 && !isQueryEmpty && (
            <Typography>No results found</Typography>
          )}
        </Grid>
      ) : null}

      {!isLoading && results.length > 0 && !isQueryEmpty ? (
        <Grid item xs={12}>
          <List>
            <ListSubheader>Results</ListSubheader>

            <SafeSearchResults
              results={results}
              selectedSafeAddress={props.selectedSafeAddress}
              onSelect={handleSelect}
            />
          </List>
        </Grid>
      ) : null}
    </Grid>
  );
};

const SafeSearchResults = (props) => {
  return props.results.map((result) => {
    const handleClick = () => {
      props.onSelect(result.safeAddress);
    };

    return (
      <ListItem
        key={result.safeAddress}
        selected={result.safeAddress === props.selectedSafeAddress}
        onClick={handleClick}
      >
        <ListItemText
          primary={result.username || `${result.safeAddress.slice(0, 16)} ...`}
        />
      </ListItem>
    );
  });
};

SafeSearch.propTypes = {
  onSafeSelected: PropTypes.func.isRequired,
  selectedSafeAddress: PropTypes.string,
};

SafeSearchResults.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedSafeAddress: PropTypes.string,
};

export default SafeSearch;
