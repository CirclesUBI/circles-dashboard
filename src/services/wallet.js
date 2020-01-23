import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

import web3 from '~/services/web3';

const PRIVATE_KEY_NAME = 'privateKey';

export function generatePrivateKey() {
  const { privateKey } = web3.eth.accounts.create();
  return privateKey;
}

export function getPrivateKey() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasItem(PRIVATE_KEY_NAME)) {
    return getItem(PRIVATE_KEY_NAME);
  } else {
    const privateKey = generatePrivateKey();
    setPrivateKey(privateKey);
    return privateKey;
  }
}

export function setPrivateKey(privateKey) {
  setItem(PRIVATE_KEY_NAME, privateKey);
}

export function removePrivateKey() {
  removeItem(PRIVATE_KEY_NAME);
}

export function getPublicAddress() {
  const privateKey = getPrivateKey();

  if (privateKey && !web3.utils.isHexStrict(privateKey)) {
    throw new Error('Invalid private key');
  }

  const { address } = web3.eth.accounts.privateKeyToAccount(privateKey);

  return address;
}

export function getAccount() {
  const privateKey = getPrivateKey();

  return web3.eth.accounts.privateKeyToAccount(privateKey);
}
