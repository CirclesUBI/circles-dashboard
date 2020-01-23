import { combineReducers } from 'redux';

import appReducer from '~/store/app/reducers';
import explorerReducer from '~/store/explorer/reducers';
import healthReducer from '~/store/health/reducers';

const rootReducer = combineReducers({
  app: appReducer,
  explorer: explorerReducer,
  health: healthReducer,
});

export default rootReducer;
