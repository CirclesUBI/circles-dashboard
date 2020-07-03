import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const HealthViewerField = (props) => {
  return (
    <HealthViewerFieldStyle>
      <strong>{props.label}</strong>
      {props.children}
    </HealthViewerFieldStyle>
  );
};

HealthViewerField.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

const HealthViewerFieldStyle = styled.div`
  display: flex;

  margin-bottom: 10px;

  align-items: center;
  justify-content: space-between;
`;

export default HealthViewerField;
