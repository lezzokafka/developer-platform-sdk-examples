export const sendTransactionParameters = {
  type: 'object',
  properties: {
    to: { type: 'string', description: "Recipient's Ethereum address" },
    amount: { type: 'number', description: 'Amount to be send' },
    symbol: {
      type: 'string',
      description: 'Type of Token to send (e.g., TCRO, ETH)',
      enum: ['TCRO', 'ETH'],
    },
  },
  required: ['to', 'amount'],
};

export const getBalanceParameters = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      description: 'Wallet address to get balance for',
    },
  },
  required: ['address'],
};

export const getLatestBlockParameters = {
  type: 'object',
  properties: {},
};

export const getTransactionsByAddressParameters = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      description: 'Cronos address to get transactions for',
    },
    session: {
      type: 'string',
      description: 'Previous page session. Leave empty for first page',
    },
    limit: {
      type: 'number',
      description: 'Page size (max 100)',
      minimum: 1,
      maximum: 100,
      default: 20,
    },
  },
  required: ['address'],
};

export const getContractAbiParameters = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      description: 'Contract address to get ABI for',
    },
  },
  required: ['address'],
};

export const getTransactionByHash = {
  type: 'object',
  properties: {
    txHash: {
      type: 'string',
      description: 'Transaction hash to get details for',
    },
  },
  required: ['txHash'],
};

export const getBlockByTagParameters = {
  type: 'object',
  properties: {
    blockTag: {
      type: 'string',
      description: 'Block number in integer, or "earliest", "latest", or "pending"',
    },
    txDetail: {
      type: 'boolean',
      description: 'If true, returns full transaction objects; if false, only transaction hashes',
      default: false,
    },
  },
  required: ['blockTag'],
};

export const getTransactionStatusParameters = {
  type: 'object',
  properties: {
    txHash: {
      type: 'string',
      description: 'Transaction hash to get status for',
    },
  },
  required: ['txHash'],
};

export const createWalletParameters = {
  type: 'object',
  properties: {},
};

export const wrapTokenParameters = {
  type: 'object',
  properties: {
    amount: {
      type: 'number',
      description: 'Amount of token to be wrapped',
    },
  },
  required: ['amount'],
};

export const SwapTokenParameters = {
  type: 'object',
  properties: {
    amount: {
      type: 'number',
      description: 'Amount of token to be swapped',
    },
  },
  required: ['amount'],
};
