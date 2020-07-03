import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StatusIndicator = (props) => {
  return <StatusIndicatorStyle isActive={props.isActive} />;
};

StatusIndicator.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

const StatusIndicatorStyle = styled.div`
  width: 20px;
  height: 20px;

  border: 2px solid black;

  background-color: ${(props) => {
    return props.isActive ? 'green' : 'red';
  }};
`;

export default StatusIndicator;
