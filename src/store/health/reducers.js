import update from 'immutability-helper';

import ActionTypes from '~/store/health/types';

const initialServiceState = {
  isReachable: false,
  isReady: false,
};

const initialState = {
  isLoading: false,
  api: {
    ...initialServiceState,
  },
  ethereum: {
    ...initialServiceState,
    currentBlockHeight: '0',
  },
  graph: {
    ...initialServiceState,
    entityCount: '0',
    isFailed: false,
    isSynced: false,
    latestEthereumBlockNumber: '0',
  },
  relay: {
    ...initialServiceState,
    currentBalanceFunder: '0',
    currentBalanceSender: '0',
  },
};

const healthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.HEALTH_UPDATE:
      return update(state, {
        isLoading: { $set: true },
      });
    case ActionTypes.HEALTH_UPDATE_SERVICE:
      return update(state, {
        [action.meta.serviceName]: {
          $set: Object.assign(
            {},
            state[action.meta.serviceName],
            action.meta.state,
            {
              isReady: true,
            },
          ),
        },
      });
    case ActionTypes.HEALTH_UPDATE_SUCCESS:
      return update(state, {
        isLoading: { $set: false },
      });
    default:
      return state;
  }
};

export default healthReducer;
