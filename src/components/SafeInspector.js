import Chip from '@material-ui/core/Chip';
import PaymentIcon from '@material-ui/icons/Payment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import core from '~/services/core';
import web3 from '~/services/web3';
import useStyles from '~/styles';

const SafeInspector = (props) => {
  const [balance, setBalance] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    const updateDetails = async () => {
      const currentBalance = await core.token.getBalance(
        props.selectedSafeAddress,
      );

      setBalance(web3.utils.fromWei(currentBalance));
    };

    if (props.selectedSafeAddress) {
      updateDetails();
      setBalance(0);
    }
  }, [props.selectedSafeAddress]);

  if (!props.selectedSafeAddress) {
    return <p>Please select a Safe to inspect</p>;
  }

  return (
    <div className={classes.chipGroup}>
      <Chip
        color="primary"
        icon={<PaymentIcon />}
        label={`${props.selectedSafeAddress}`}
      />

      <Chip icon={<PaymentIcon />} label={`${balance} Circles`} />
    </div>
  );
};

SafeInspector.propTypes = {
  selectedSafeAddress: PropTypes.string,
};

export default SafeInspector;
