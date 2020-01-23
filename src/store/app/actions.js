import ActionTypes from '~/store/app/types';
import { checkHealthState } from '~/store/health/actions';
import { getPublicAddress } from '~/services/wallet';

export function initializeApp() {
  return dispatch => {
    dispatch({
      type: ActionTypes.APP_INITIALIZE,
    });

    try {
      const walletAddress = getPublicAddress();

      if (walletAddress) {
        dispatch({
          type: ActionTypes.APP_INITIALIZE_SUCCESS,
          meta: {
            walletAddress,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.APP_INITIALIZE_ERROR,
      });

      throw error;
    }
  };
}

export function checkAppState() {
  return async (dispatch, getState) => {
    const { app } = getState();

    if (!app.isReady || app.isError) {
      return;
    }

    await dispatch(checkHealthState());
  };
}
