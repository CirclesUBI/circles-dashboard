import { combineReducers } from 'redux';

import analysisReducer from '~/store/analysis/reducers';
import appReducer from '~/store/app/reducers';
import explorerReducer from '~/store/explorer/reducers';
import healthReducer from '~/store/health/reducers';

const rootReducer = combineReducers({
  analysis: analysisReducer,
  app: appReducer,
  explorer: explorerReducer,
  health: healthReducer,
});

export default rootReducer;
