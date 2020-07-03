import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Header = (props) => {
  return <HeaderStyle>{props.children}</HeaderStyle>;
};

Header.propTypes = {
  children: PropTypes.node,
};

const HeaderStyle = styled.header`
  padding: 10px;

  background-color: lightblue;
`;

export default Header;
