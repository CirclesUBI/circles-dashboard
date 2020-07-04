import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import App from '~/App';
import store from '~/configureStore';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff9933',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#cc1e66',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const Root = (props) => (
  <Provider store={props.store}>
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <App />
      </Router>
    </ThemeProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

ReactDOM.render(<Root store={store} />, document.getElementById('app'));
