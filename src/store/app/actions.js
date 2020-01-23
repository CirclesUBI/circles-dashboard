import ActionTypes from '~/store/app/types';
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
