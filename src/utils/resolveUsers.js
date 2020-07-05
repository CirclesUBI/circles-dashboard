import core from '~/services/core';

export default async function resolveSafeAddress(safeAddress) {
  const response = await core.user.resolve([safeAddress]);

  // Return a "fake" result when username can not be resolved as there might be
  // nodes in the network which don't have a registered username.
  if (response.data.length === 0) {
    return {
      data: [
        {
          safeAddress,
        },
      ],
    };
  }

  return response;
}
