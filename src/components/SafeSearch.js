import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import web3 from '~/services/web3';
import core from '~/services/core';
import useStyles from '~/styles';

const SafeSearch = (props) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoResults, setIsNoResults] = useState(false);
  const classes = useStyles();

  const handleInput = async (event) => {
    const { value } = event.target;

    if (value.length === 0) {
      setResults([]);
      setIsNoResults(false);
    } else if (web3.utils.isAddress(value)) {
      props.onSafeSelected(web3.utils.toChecksumAddress(value));
      setResults([]);
      setIsNoResults(false);
    } else {
      setIsLoading(true);
      const response = await core.user.search(event.target.value);
      setResults(response.data.slice(0, 5));
      setIsNoResults(response.data.length === 0);
    }

    setIsLoading(false);
  };

  const handleSelect = (safeAddress) => {
    props.onSafeSelected(safeAddress);
  };

  return (
    <Box>
      <div>
        <form autoComplete="off" className={classes.root} noValidate>
          <TextField label="Enter username or address" onChange={handleInput} />
        </form>
      </div>

      {isLoading && <CircularProgress />}
      {isNoResults && <p>No results</p>}

      <List>
        <SafeSearchResults
          results={results}
          selectedSafeAddress={props.selectedSafeAddress}
          onSelect={handleSelect}
        />
      </List>
    </Box>
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
        <ListItemText primary={result.username} />
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
