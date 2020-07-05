import Web3 from 'web3';

const provider = new Web3.providers.WebsocketProvider(
  process.env.ETHEREUM_NODE_WS,
);

const web3 = new Web3(provider);

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default web3;
