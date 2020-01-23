import update from 'immutability-helper';

import ActionTypes from '~/store/app/types';

const initialState = {
  isReady: false,
  walletAddress: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.APP_INITIALIZE:
      return update(state, {
        isReady: { $set: false },
      });
    case ActionTypes.APP_INITIALIZE_SUCCESS:
      return update(state, {
        isReady: { $set: true },
        walletAddress: { $set: action.meta.walletAddress },
      });
    case ActionTypes.APP_INITIALIZE_ERROR:
      return update(state, {
        isError: { $set: true },
      });
    default:
      return state;
  }
};

export default appReducer;
