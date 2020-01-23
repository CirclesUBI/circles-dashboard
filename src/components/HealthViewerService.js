import PropTypes from 'prop-types';
import React from 'react';

const HealthViewerService = props => {
  return (
    <div>
      <h3>{props.label}</h3>
      {props.isActive ? 'active' : 'inactive'}
      {props.children}
    </div>
  );
};

HealthViewerService.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default HealthViewerService;
