import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dashboard from '~/views/Dashboard';
import { initializeApp, checkAppState } from '~/store/app/actions';

const CHECK_APP_FREQUENCY = 10 * 1000;

const App = () => {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  const onAppStart = () => {
    const initialize = async () => {
      await dispatch(initializeApp());
      await dispatch(checkAppState());
    };

    initialize();

    window.setInterval(async () => {
      await dispatch(checkAppState());
    }, CHECK_APP_FREQUENCY);
  };

  useEffect(onAppStart, []);

  if (!app.isReady) {
    return <p>Connecting ...</p>;
  }

  return <Dashboard />;
};

export default App;
