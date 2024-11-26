export enum Chain {
  CRONOS_EVM = 'Cronos EVM Mainnet',
  CRONOS_EVM_TESTNET = 'Cronos EVM Testnet',
  CRONOS_ZKEVM = 'Cronos ZK EVM Mainnet',
  CRONOS_ZKEVM_TESTNET = 'Cronos ZK EVM Testnet',
}

export const CHAIN: Record<number, Chain> = {
  25: Chain.CRONOS_EVM,
  338: Chain.CRONOS_EVM_TESTNET,
  388: Chain.CRONOS_ZKEVM,
  240: Chain.CRONOS_ZKEVM_TESTNET,
};

export const EXPLORER_URLS: Record<Chain, string> = {
  [Chain.CRONOS_EVM]: 'https://explorer-api.cronos.org/mainnet',
  [Chain.CRONOS_EVM_TESTNET]: 'https://explorer-api.cronos.org/testnet',
  [Chain.CRONOS_ZKEVM]: 'https://explorer-api.zkevm.cronos.org',
  [Chain.CRONOS_ZKEVM_TESTNET]: 'https://explorer-api.testnet.zkevm.cronos.org',
};

export const DEFAULT_RPC_URLS: Record<Chain, string> = {
  [Chain.CRONOS_EVM]: 'https://evm.cronos.org',
  [Chain.CRONOS_EVM_TESTNET]: 'https://evm-t3.cronos.org',
  [Chain.CRONOS_ZKEVM]: 'https://mainnet.zkevm.cronos.org',
  [Chain.CRONOS_ZKEVM_TESTNET]: 'https://testnet.zkevm.cronos.org',
};

export interface ChainInfo {
  id: number;
  chain: Chain;
  explorerUrl: string;
  rpcUrl: string;
}

export const CHAIN_INFO: Record<Chain, ChainInfo> = {
  [Chain.CRONOS_EVM]: {
    id: 25,
    chain: Chain.CRONOS_EVM,
    explorerUrl: EXPLORER_URLS[Chain.CRONOS_EVM],
    rpcUrl: DEFAULT_RPC_URLS[Chain.CRONOS_EVM],
  },
  [Chain.CRONOS_EVM_TESTNET]: {
    id: 338,
    chain: Chain.CRONOS_EVM_TESTNET,
    explorerUrl: EXPLORER_URLS[Chain.CRONOS_EVM_TESTNET],
    rpcUrl: DEFAULT_RPC_URLS[Chain.CRONOS_EVM_TESTNET],
  },
  [Chain.CRONOS_ZKEVM]: {
    id: 388,
    chain: Chain.CRONOS_ZKEVM,
    explorerUrl: EXPLORER_URLS[Chain.CRONOS_ZKEVM],
    rpcUrl: DEFAULT_RPC_URLS[Chain.CRONOS_ZKEVM],
  },
  [Chain.CRONOS_ZKEVM_TESTNET]: {
    id: 240,
    chain: Chain.CRONOS_ZKEVM_TESTNET,
    explorerUrl: EXPLORER_URLS[Chain.CRONOS_ZKEVM_TESTNET],
    rpcUrl: DEFAULT_RPC_URLS[Chain.CRONOS_ZKEVM_TESTNET],
  },
};
