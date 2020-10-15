import ActionTypes from '~/store/explorer/types';
import graphRequest from '~/services/graphql';
import web3 from '~/services/web3';
import { setEvents } from '~/services/events';

const PAGE_SIZE = 100;

function convertAddress(address) {
  return web3.utils.toChecksumAddress(address);
}

export function checkExplorerState() {
  return async (dispatch, getState) => {
    const { explorer } = getState();

    if (explorer.isLoading) {
      return;
    }

    dispatch({
      type: ActionTypes.EXPLORER_UPDATE,
    });

    const connections = [];
    let index = 0;

    try {
      const endpoint = `${process.env.GRAPH_NODE_EXTERNAL}/subgraphs/name/${process.env.SUBGRAPH_NAME}`;

      let isEmpty = false;

      while (!isEmpty) {
        const filter = `
          orderBy: id,
          first: ${PAGE_SIZE},
          skip: ${index * PAGE_SIZE},
        `;

        const query = `{
          trusts(${filter}) {
            id
            limit
            limitPercentage
            userAddress
            canSendToAddress
          }
        }`;

        const { trusts } = await graphRequest(endpoint, query);

        if (trusts.length === 0) {
          isEmpty = true;
        }

        trusts.forEach((connection) => {
          if (connection.userAddress === connection.canSendToAddress) {
            return;
          }

          connections.push({
            id: connection.id,
            data: {
              limitPercentage: connection.limitPercentage,
              limit: connection.limit,
              user: convertAddress(connection.userAddress),
              canSendTo: convertAddress(connection.canSendToAddress),
            },
          });
        });

        index += 1;
      }

      index = 0;
      isEmpty = false;

      while (!isEmpty) {
        const filter = `
          orderBy: id,
          first: ${PAGE_SIZE},
          skip: ${index * PAGE_SIZE},
        `;

        const query = `{
          safes(${filter}) {
            id
            balances {
              amount
              token {
                owner {
                  id
                }
              }
            }
          }
        }`;

        const { safes } = await graphRequest(endpoint, query);

        if (safes.length === 0) {
          isEmpty = true;
        }

        safes.forEach((safe) => {
          safe.balances.forEach(({ token, amount }) => {
            if (safe.id === token.owner.id) {
              return;
            }

            connections.push({
              id: `${safe.id}-${token.owner.id}`,
              data: {
                limitPercentage: 100,
                limit: amount,
                user: convertAddress(safe.id),
                canSendTo: convertAddress(token.owner.id),
              },
            });
          });
        });

        index += 1;
      }

      setEvents(connections);

      dispatch({
        type: ActionTypes.EXPLORER_UPDATE_SUCCESS,
        meta: {
          updatedAt: Date.now(),
        },
      });
    } catch {
      dispatch({
        type: ActionTypes.EXPLORER_UPDATE_ERROR,
      });
    }
  };
}
