import ActionTypes from '~/store/analysis/types';
import analysis, { setAnalysisData } from '~/services/analysis';

export function checkAnalysisState() {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.analysis.isLoading) {
      return;
    }

    dispatch({
      type: ActionTypes.ANALYSIS_UPDATE,
    });

    try {
      const [hubTransfers, transfers, trusts, velocity] = await Promise.all([
        analysis.getTransitive(),
        analysis.getTransfers(),
        analysis.getTrusts(),
        analysis.getVelocity(),
      ]);

      setAnalysisData({
        hubTransfers,
        transfers,
        trusts,
        velocity,
      });

      dispatch({
        type: ActionTypes.ANALYSIS_UPDATE_SUCCESS,
        meta: {
          updatedAt: Date.now(),
        },
      });
    } catch {
      dispatch({
        type: ActionTypes.ANALYSIS_UPDATE_ERROR,
      });
    }
  };
}
