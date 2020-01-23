import PropTypes from 'prop-types';
import React from 'react';

const HealthViewerField = props => {
  return (
    <div>
      <strong>{props.label}</strong>
      {props.children}
    </div>
  );
};

HealthViewerField.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

export default HealthViewerField;
