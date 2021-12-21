import ActionTypes from '~/store/health/types';
import graphRequest from '~/services/graphql';
import isServiceReachable from '~/services/health';
import web3 from '~/services/web3';

function checkGraphHealth() {
  return async (dispatch) => {
    try {
      const endpoint = `${process.env.GRAPH_NODE_EXTERNAL}/subgraphs/name/${process.env.SUBGRAPH_NAME}`;
      // Get status from the current subgraph
      const query = `{
        _meta {
          block {
            number
          }
          hasIndexingErrors
        }
      }`;

      const data = await graphRequest(endpoint, query);
      const { block, hasIndexingErrors } = data._meta;

      const ethBlock = await web3.eth.getBlock('latest');

      dispatch({
        type: ActionTypes.HEALTH_UPDATE_SERVICE,
        meta: {
          serviceName: 'graph',
          state: {
            isReachable: true,
            isFailed: hasIndexingErrors,
            isSynced: ethBlock.number === block.number,
            latestEthereumBlockNumber: block.number,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.HEALTH_UPDATE_SERVICE,
        meta: {
          serviceName: 'graph',
          state: {
            isReachable: false,
          },
        },
      });
    }
  };
}

function checkRelayHealth() {
  const endpoint = process.env.RELAY_SERVICE_EXTERNAL;

  return async (dispatch) => {
    const isReachable = await isServiceReachable(endpoint);

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'relay',
        state: {
          isReachable,
        },
      },
    });

    if (!isReachable) {
      return;
    }

    const currentBalanceFunder = await web3.eth.getBalance(
      process.env.RELAY_FUNDER_ADDRESS,
    );

    const currentBalanceSender = await web3.eth.getBalance(
      process.env.RELAY_SENDER_ADDRESS,
    );

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'relay',
        state: {
          currentBalanceFunder,
          currentBalanceSender,
        },
      },
    });
  };
}

function checkApiHealth() {
  const endpoint = `${process.env.API_SERVICE_EXTERNAL}/api`;

  return async (dispatch) => {
    const isReachable = await isServiceReachable(endpoint);

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'api',
        state: {
          isReachable,
        },
      },
    });
  };
}

function checkEthereumNodeHealth() {
  return async (dispatch) => {
    const isReachable = await web3.eth.net.isListening();

    const block = await web3.eth.getBlock('latest');

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'ethereum',
        state: {
          isReachable,
          currentBlockHeight: block.number,
        },
      },
    });
  };
}

export function checkHealthState() {
  return async (dispatch, getState) => {
    const { health } = getState();

    if (health.isLoading) {
      return;
    }

    dispatch({
      type: ActionTypes.HEALTH_UPDATE,
    });

    await Promise.all([
      dispatch(checkApiHealth()),
      dispatch(checkEthereumNodeHealth()),
      dispatch(checkGraphHealth()),
      dispatch(checkRelayHealth()),
    ]);

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SUCCESS,
    });
  };
}
