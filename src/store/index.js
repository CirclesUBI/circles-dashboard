import { combineReducers } from 'redux';

import appReducer from '~/store/app/reducers';
import healthReducer from '~/store/health/reducers';

const rootReducer = combineReducers({
  app: appReducer,
  health: healthReducer,
});

export default rootReducer;
