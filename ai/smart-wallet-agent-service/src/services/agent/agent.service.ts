import {
  Block,
  Client,
  Contract,
  CronosZkEvm,
  Token,
  Transaction,
  Wallet,
} from '@crypto.com/developer-platform-client';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.js';
import { validateFunctionArgs } from '../../helpers/agent.helpers.js';
import { logger } from '../../helpers/logger.helper.js';
import { BaseError } from '../../lib/errors/base.error.js';
import { OpenAIModelError, OpenAIUnauthorizedError } from '../../lib/errors/service.errors.js';
import { CONTENT, TOOLS } from './agent.constants.js';
import {
  AIMessageResponse,
  BlockchainFunction,
  FunctionArgs,
  FunctionCallResponse,
  Options,
  QueryContext,
  Role,
  Status,
} from './agent.interfaces.js';
import TokenService from '../token/token.service.js';
import { WalletService } from '../smartwallet/smartwallet.service.js';

/**
 * Initialize Developer Platform SDK
 */
Client.init({
  chain: CronosZkEvm.Testnet,
  apiKey: process.env.EXPLORER_API_KEY!,
  provider: 'http://localhost:5173',
});

/**
 * AIAgentService class handles Chain AI operations.
 *
 * @class AIAgentService
 */
export class AIAgentService {
  private options: Options;
  private client: OpenAI;
  private tokenService: TokenService;
  private walletService: WalletService;

  /**
   * @param {Options} options - Configuration options including chain details.
   */
  constructor(options: Options) {
    this.options = options;
    this.client = new OpenAI({ apiKey: options.openAI.apiKey });
    this.tokenService = new TokenService(process.env.RPC_URL!, process.env.PRIVATE_KEY!);
    this.walletService = new WalletService();
  }

  /**
   * Interprets a user's query using AI to determine appropriate function calls.
   *
   * @async
   * @param {string} query - The user's query to interpret.
   * @param {QueryContext[]} context - The conversation context.
   * @returns {Promise<ChatCompletion>} - A Promise resolving to the AI's interpretation and suggested function calls.
   * @memberof AIAgentService
   */
  public async interpretUserQuery(query: string, context: QueryContext[]): Promise<AIMessageResponse> {
    try {
      const messages: Array<ChatCompletionMessageParam> = [
        {
          role: Role.System,
          content: CONTENT,
        },
        ...context,
        { role: Role.User, content: query },
      ];
      const chatCompletion = await this.client.chat.completions.create({
        model: this.options.openAI.model || 'gpt-4-turbo',
        messages: messages,
        tools: TOOLS,
        tool_choice: 'auto',
      });
      return chatCompletion.choices[0].message as AIMessageResponse;
    } catch (e) {
      if (e instanceof Error && e.message.includes('Incorrect API key provided')) {
        throw new OpenAIUnauthorizedError(`OpenAI API key is invalid. ${e.message}`);
      }
      if (e instanceof Error && e.message.includes('The model') && e.message.includes('does not exist')) {
        throw new OpenAIModelError(`${e.message}`);
      }
      logger.error('Unknown error while interpreting user query: ', e);
      throw e;
    }
  }

  /**
   * Process AI's interpretation of the user's query, and returns a list of function responses.
   *
   * @async
   * @param {AIMessageResponse} interpretation - The AI's interpretation of the user's query.
   * @returns {Promise<FunctionCallResponse[]>} - A Promise resolving to the processed blockchain function responses.
   * @memberof AIAgentService
   */
  public async processInterpretation(interpretation: AIMessageResponse): Promise<FunctionCallResponse[]> {
    let functionResponses: FunctionCallResponse[] = [];
    const functionsToExecute = interpretation.tool_calls;

    if (functionsToExecute) {
      functionResponses = await Promise.all(
        functionsToExecute.map(async (toolCall) => {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          return await this.executeFunction(functionName, functionArgs);
        })
      );
    } else {
      functionResponses.push({
        status: Status.Failed,
        data: { content: JSON.stringify(interpretation.content) },
      });
    }
    return functionResponses;
  }

  /**
   * Execute a function. Returns a BlockchainFunctionResponse regardless of the function execution status.
   * @async
   * @param {BlockchainFunction} functionName - The blockchain function to execute.
   * @param {FunctionArgs} functionArgs - The arguments required for the function.
   * @returns {Promise<FunctionCallResponse>} - A Promise resolving to the blockchain function response.
   * @memberof AIAgentService
   */
  private async executeFunction(
    functionName: BlockchainFunction,
    functionArgs: FunctionArgs
  ): Promise<FunctionCallResponse> {
    try {
      validateFunctionArgs(functionArgs);
      let now: Date;
      switch (functionName) {
        case BlockchainFunction.GetBalance:
          return await Wallet.balance(functionArgs.address);
        case BlockchainFunction.GetLatestBlock:
          return await Block.getBlockByTag('latest');
        case BlockchainFunction.GetTransactionsByAddress:
          return await Transaction.getTransactionsByAddress(
            functionArgs.address,
            functionArgs.session,
            functionArgs.limit
          );
        case BlockchainFunction.GetContractABI:
          return await Contract.getContractABI(functionArgs.address);
        case BlockchainFunction.GetTransactionByHash:
          return await Transaction.getTransactionByHash(functionArgs.txHash);
        case BlockchainFunction.GetBlockByTag:
          return await Block.getBlockByTag(functionArgs.blockTag);
        case BlockchainFunction.GetTransactionStatus:
          return await Transaction.getTransactionStatus(functionArgs.txHash);
        case BlockchainFunction.CreateWallet:
          return this.walletService.authorizeWallet();
        case BlockchainFunction.GetPrivateKey:
          return this.walletService.getPrivateKey();
        case BlockchainFunction.TransferToken:
          return await this.tokenService.transfer(
            functionArgs.to,
            functionArgs.amount.toString(),
            functionArgs.contractAddress
          );
        /**
        @HACKATHON BlockchainFunction.CopyTransaction:
          return await this.smartWallet.copyTransactions(functionArgs.from); */
        /**
        @EXPERIMENTAL This example is for demonstration purposes only. 
        USE AT YOUR OWN RISK and DO NOT use it in a production environment. 
        DO NOT send any mainnet tokens to the accounts involved, as this may result in the loss of funds. 
        We are not responsible for any loss of digital assets.
        It is risky and unsafe to have private key in cleartext in the machine.

        To use this feature, 
        - replace the case below with the the values above for BlockchainFunction.TransferToken
        - uncomment line 54, 46, and 27
        - add relevant env
        - sample query: "transfer 1 native token to 0x1cA1304F2cA3e5A1e45fD2b64EcD83EB58a420Ab",

        case BlockchainFunction.TransferToken:
          return await this.tokenService.transfer(
            functionArgs.to,
            functionArgs.amount.toString(),
            functionArgs.contractAddress
          );
        */
        case BlockchainFunction.WrapToken:
          return await Token.wrap({
            amount: functionArgs.amount,
          });
        case BlockchainFunction.SwapToken:
          return await Token.swap({
            fromContractAddress: functionArgs.fromContractAddress,
            toContractAddress: functionArgs.toContractAddress,
            amount: functionArgs.amount,
          });
        case BlockchainFunction.GetCurrentTime:
          now = new Date();
          return {
            status: Status.Success,
            data: {
              localTime: now.toLocaleString(),
              utcTime: now.toUTCString(),
            },
          };
        default:
          return {
            status: Status.Failed,
            data: {
              message: `Received unknown function: ${functionName}`,
            },
          };
      }
    } catch (e) {
      if (e instanceof BaseError) {
        return {
          status: Status.Failed,
          data: {
            message: `Error during execution: ${e.message}`,
          },
        };
      }
      logger.error('Unknown error during execution: ', e);
      return {
        status: Status.Failed,
        data: {
          message: `Unknown error during execution: ${e}`,
        },
      };
    }
  }

  /**
   * Updates the conversation context with the user's query and the AI's response.
   *
   * @async
   * @param {QueryContext[]} context - The current conversation context.
   * @param {string} query - The user's query.
   * @param {string} response - Stringified JSON response from the AI.
   * @returns {QueryContext} - The updated context.
   * @memberof AIAgentService
   */
  public updateContext(context: QueryContext[], query: string, response: string): QueryContext[] {
    context.push({ role: Role.User, content: query });
    context.push({ role: Role.Assistant, content: JSON.parse(response) });
    if (context.length > 10) context.shift();
    return context;
  }
}
