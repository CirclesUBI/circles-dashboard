import ActionTypes from '~/store/health/types';
import core from '~/services/core';
import graphRequest from '~/services/graphql';
import isServiceReachable from '~/services/health';
import web3 from '~/services/web3';

function isOfficialNode() {
  return process.env.GRAPH_NODE_EXTERNAL.includes('api.thegraph.com');
}

function checkAppHealth() {
  const endpoint = process.env.BASE_PATH;

  return async (dispatch) => {
    const isReachable = await isServiceReachable(endpoint);

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'app',
        state: {
          isReachable,
        },
      },
    });
  };
}

function checkGraphHealth() {
  return async (dispatch) => {
    try {
      if (!isOfficialNode()) {
        const endpoint = `${process.env.GRAPH_NODE_EXTERNAL}/subgraphs`;

        // Get status from the current subgraph
        const query = `{
          subgraphs {
            currentVersion {
              deployment {
                synced
                failed
                latestEthereumBlockNumber
                entityCount
              }
            }
          }
        }`;

        const data = await graphRequest(endpoint, query);

        const {
          entityCount,
          failed,
          synced,
          latestEthereumBlockNumber,
          totalEthereumBlocksCount,
        } = data.subgraphs[0].currentVersion.deployment;

        dispatch({
          type: ActionTypes.HEALTH_UPDATE_SERVICE,
          meta: {
            serviceName: 'graph',
            state: {
              isReachable: true,
              entityCount,
              isFailed: failed,
              isSynced: synced,
              latestEthereumBlockNumber,
              totalEthereumBlocksCount,
            },
          },
        });
      } else {
        const endpoint = `${process.env.GRAPH_NODE_EXTERNAL}/index-node/graphql`;
        const subgraphName = process.env.SUBGRAPH_NAME;

        const query = `{
          indexingStatusForCurrentVersion(subgraphName: "${subgraphName}") {
            synced
            health
            fatalError {
              message
              block {
                number
                hash
              }
              handler
            }
            chains {
              chainHeadBlock {
                number
              }
              latestBlock {
                number
              }
            }
          }
        }`;

        const data = await graphRequest(endpoint, query);

        const {
          fatalError,
          synced,
          chains,
        } = data.indexingStatusForCurrentVersion;

        dispatch({
          type: ActionTypes.HEALTH_UPDATE_SERVICE,
          meta: {
            serviceName: 'graph',
            state: {
              isReachable: true,
              isFailed: fatalError ? true : false,
              isSynced: synced,
              latestEthereumBlockNumber: chains[0].latestBlock.number,
            },
          },
        });
      }
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

    const currentBalance = await web3.eth.getBalance(
      process.env.SAFE_FUNDER_ADDRESS,
    );

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'relay',
        state: {
          currentBalance,
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

function checkApiWorkerHealth() {
  return async (dispatch) => {
    const { data } = await core.utils.requestAPI({
      path: ['transfers', 'status'],
    });

    const {
      countEdges,
      countSafes,
      countTokens,
      lastBlockNumber,
      lastUpdateAt,
      lastUpdateDuration,
    } = data;

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'worker',
        state: {
          countEdges,
          countSafes,
          countTokens,
          lastBlockNumber,
          lastUpdateDuration,
          lastUpdateAt,
        },
      },
    });
  };
}

function checkEthereumNodeHealth() {
  return async (dispatch) => {
    const isReachable = await web3.eth.net.isListening();

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SERVICE,
      meta: {
        serviceName: 'ethereum',
        state: {
          isReachable,
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
      dispatch(checkApiWorkerHealth()),
      dispatch(checkAppHealth()),
      dispatch(checkEthereumNodeHealth()),
      dispatch(checkGraphHealth()),
      dispatch(checkRelayHealth()),
    ]);

    dispatch({
      type: ActionTypes.HEALTH_UPDATE_SUCCESS,
    });
  };
}
