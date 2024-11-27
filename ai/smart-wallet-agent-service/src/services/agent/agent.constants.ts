import OpenAI from 'openai';
import {
  SwapTokenParameters,
  accceptRequest,
  accountRequestParameters,
  createWalletParameters,
  getBalanceParameters,
  getBlockByTagParameters,
  getContractAbiParameters,
  getCurrentTimeParameters,
  getLatestBlockParameters,
  getTransactionByHash,
  getTransactionStatusParameters,
  getTransactionsByAddressParameters,
  initCopyTradeParameters,
  sendTransactionParameters,
  wrapTokenParameters,
} from '../../helpers/chain-ai.helpers.js';
import { BlockchainFunction } from './agent.interfaces.js';

export const CONTENT: string =
  "You are an AI assistant that helps users interact with Ethereum and Cronos blockchains. You can use multiple functions if needed to fulfill the user's request.";

export const TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: BlockchainFunction.TransferToken,
      description: 'Transfer native token or a token (specified by its contract address) to a recipient address',
      parameters: sendTransactionParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetBalance,
      description: 'Get the current balance of specified  wallet addresses',
      parameters: getBalanceParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetLatestBlock,
      description: 'Get the latest block height from the Cronos blockchain',
      parameters: getLatestBlockParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetTransactionsByAddress,
      description: 'Get the list of transactions for a specified Cronos address',
      parameters: getTransactionsByAddressParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetContractABI,
      description: 'Get the ABI of a verified smart contract',
      parameters: getContractAbiParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetTransactionByHash,
      description: 'Get the details of a transaction by its hash',
      parameters: getTransactionByHash,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetBlockByTag,
      description: 'Get information about block by its number or tag (e.g. "latest", "earliest", "pending")',
      parameters: getBlockByTagParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetTransactionStatus,
      description: 'Get the status of a transaction by its hash',
      parameters: getTransactionStatusParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.CreateWallet,
      description: 'Create a new random wallet',
      parameters: createWalletParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetPrivateKey,
      description: 'Get private key',
      parameters: createWalletParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.AcceptRequest,
      description: 'Asls for acceptance confirmation',
      parameters: accceptRequest,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.AccountRequest,
      description: 'Asks for account address',
      parameters: accountRequestParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.InitcopyTrade,
      description:
        'This function is called after a user provides his ethereum wallet address starting with 0x. After approving and providing an account, will initiate the copy trading',
      parameters: initCopyTradeParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.WrapToken,
      description: 'Wrap a token',
      parameters: wrapTokenParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.SwapToken,
      description: 'Swap a token from `fromContractAddress` to `toContractAddress`',
      parameters: SwapTokenParameters,
    },
  },
  {
    type: 'function',
    function: {
      name: BlockchainFunction.GetCurrentTime,
      description: 'Get the current local and UTC time',
      parameters: getCurrentTimeParameters,
    },
  },
];

// Hi, can you help me to diversify my portfolio based on the most profitable accounts in Cronos zkEvm?

// Sure, I will copy trade from now on the transaction from the top accounts on Cronos zkEvm. Do you accept?

// Yes please

// AI reply I will generate a wallet to perform the operation can you authorize this address to send transactions from your account. What is your account?

// here is my account.
