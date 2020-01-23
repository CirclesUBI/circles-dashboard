import { combineReducers } from 'redux';

import appReducer from '~/store/app/reducers';

const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;
