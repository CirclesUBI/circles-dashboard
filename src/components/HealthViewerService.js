import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const HealthViewerService = props => {
  return (
    <HealthViewerServiceStyle isActive={props.isActive}>
      <h3>{props.label}</h3>
      <hr />
      {props.children}
    </HealthViewerServiceStyle>
  );
};

HealthViewerService.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

const HealthViewerServiceStyle = styled.div`
  margin: 10px;
  padding: 10px;

  border: 2px solid black;

  background-color: ${props => {
    return props.isActive ? 'lightgreen' : 'red';
  }};

  flex: 1;
`;

export default HealthViewerService;
