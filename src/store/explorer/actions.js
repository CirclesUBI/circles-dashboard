import ActionTypes from '~/store/explorer/types';
import graphRequest from '~/services/graphql';
import web3 from '~/services/web3';
import { addEvents } from '~/services/events';

function addMilliseconds(time) {
  return parseInt(`${time}000`, 10);
}

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

    try {
      const endpoint = `${process.env.GRAPH_NODE_EXTERNAL}/subgraphs/name/${process.env.SUBGRAPH_NAME}`;

      const filter = `
        orderBy: time,
        where: {
          time_gt: ${explorer.updatedAt},
          type: "TRUST",
        }
      `;

      const query = `{
        notifications(${filter}) {
          id
          transactionHash
          safe {
            id
          }
          type
          time
          trust {
            user
            canSendTo
            limitPercentage
          }
          transfer {
            from
            to
            amount
          }
          ownership {
            adds
            removes
          }
        }
      }`;

      const { notifications } = await graphRequest(endpoint, query);

      if (notifications.length === 0) {
        return;
      }

      const updatedAt = notifications[notifications.length - 1].time;

      const events = notifications.reduce((acc, notification) => {
        if (notification.trust.user === notification.trust.canSendTo) {
          return acc;
        }

        acc.push({
          id: notification.id,
          timestamp: addMilliseconds(notification.time),
          transactionHash: notification.transactionHash,
          data: {
            limitPercentage: notification.trust.limitPercentage,
            user: convertAddress(notification.trust.user),
            canSendTo: convertAddress(notification.trust.canSendTo),
          },
        });

        return acc;
      }, []);

      addEvents(events);

      dispatch({
        type: ActionTypes.EXPLORER_UPDATE_SUCCESS,
        meta: {
          updatedAt,
        },
      });
    } catch {
      dispatch({
        type: ActionTypes.EXPLORER_UPDATE_ERROR,
      });
    }
  };
}
