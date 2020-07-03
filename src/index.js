import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import normalize from 'styled-normalize';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

import App from '~/App';
import store from '~/configureStore';

const Root = (props) => (
  <Provider store={props.store}>
    <GlobalStyle />
    <App />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

const GlobalStyle = createGlobalStyle`
  ${normalize}
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    &,
    &::before,
    &::after {
      box-sizing: border-box;
      text-rendering: optimizeLegibility;
    }
  }

  h1 {
    text-align: center;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 0;
  }

  body {
    font-family: Arial, sans-serif;
  }

  hr {
    border: 0;
    border-bottom: 2px solid black;
  }
`;

ReactDOM.render(<Root store={store} />, document.getElementById('app'));
