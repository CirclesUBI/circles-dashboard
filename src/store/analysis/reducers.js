import update from 'immutability-helper';

import ActionTypes from '~/store/analysis/types';

const initialState = {
  isLoading: false,
  isReady: false,
  updatedAt: 0,
};

const analysisReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ANALYSIS_UPDATE:
      return update(state, {
        isLoading: { $set: true },
      });
    case ActionTypes.ANALYSIS_UPDATE_SUCCESS:
      return update(state, {
        isLoading: { $set: false },
        isReady: { $set: true },
        updatedAt: { $set: action.meta.updatedAt },
      });
    case ActionTypes.ANALYSIS_UPDATE_ERROR:
      return update(state, {
        isLoading: { $set: false },
      });
    default:
      return state;
  }
};

export default analysisReducer;
