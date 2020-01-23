import PropTypes from 'prop-types';
import React from 'react';

const StatusIndicator = props => {
  if (props.isActive) {
    return <p>Ja</p>;
  }

  return <p>Nee</p>;
};

StatusIndicator.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default StatusIndicator;
