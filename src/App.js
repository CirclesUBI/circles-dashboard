import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dashboard from '~/views/Dashboard';
import { initializeApp } from '~/store/app/actions';

const App = () => {
  const dispatch = useDispatch();
  const app = useSelector(state => state.app);

  const onAppStart = () => {
    const initialize = async () => {
      await dispatch(initializeApp());
    };

    initialize();
  };

  useEffect(onAppStart, []);

  if (!app.isReady) {
    return <p>Connecting ...</p>;
  }

  return <Dashboard />;
};

export default App;
