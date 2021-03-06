import CirclesCore from '@circles/core';

import web3 from '~/services/web3';
import { getAccount } from '~/services/wallet';

const core = new CirclesCore(web3, {
  apiServiceEndpoint: process.env.API_SERVICE_EXTERNAL,
  graphNodeEndpoint: process.env.GRAPH_NODE_EXTERNAL,
  hubAddress: process.env.HUB_ADDRESS,
  proxyFactoryAddress: process.env.PROXY_FACTORY_ADDRESS,
  relayServiceEndpoint: process.env.RELAY_SERVICE_EXTERNAL,
  safeMasterAddress: process.env.SAFE_ADDRESS,
  subgraphName: process.env.SUBGRAPH_NAME,
});

async function requestCore(moduleName, method, options) {
  return await core[moduleName][method](getAccount(), options);
}

// Safe module

const safe = {
  getOwners: async (safeAddress) => {
    return await requestCore('safe', 'getOwners', {
      safeAddress,
    });
  },

  getAddress: async (ownerAddress) => {
    return await requestCore('safe', 'getAddress', {
      ownerAddress,
    });
  },
};

// User module

const user = {
  resolve: async (addresses) => {
    return await requestCore('user', 'resolve', {
      addresses,
    });
  },

  search: async (query) => {
    return await requestCore('user', 'search', {
      query,
    });
  },
};

// Trust module

const trust = {
  getNetwork: async (safeAddress) => {
    return await requestCore('trust', 'getNetwork', {
      safeAddress,
    });
  },
};

// Token module

const token = {
  getBalance: async (safeAddress) => {
    return await requestCore('token', 'getBalance', {
      safeAddress,
    });
  },

  getAddress: async (safeAddress) => {
    return await requestCore('token', 'getAddress', {
      safeAddress,
    });
  },

  findTransitiveTransfer: async (from, to, value) => {
    return await requestCore('token', 'findTransitiveTransfer', {
      from,
      to,
      value,
    });
  },
};

// Activity module

const activity = {
  ActivityTypes: core.activity.ActivityTypes,

  getLatest: async (safeAddress, timestamp) => {
    return await requestCore('activity', 'getLatest', {
      safeAddress,
      timestamp,
    });
  },
};

// Utils module

const { fromFreckles, toFreckles, requestGraph, requestAPI } = core.utils;

const utils = {
  fromFreckles,
  toFreckles,
  requestGraph,
  requestAPI,
};

// Errors

const { CoreError, TransferError, RequestError } = core;

const errors = {
  CoreError,
  TransferError,
  RequestError,
};

export default {
  activity,
  errors,
  safe,
  token,
  trust,
  user,
  utils,
};
