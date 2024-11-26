import { ethers } from 'ethers';
import { logger, sanitizeError } from '../../helpers/logger.helper.js';
import { FunctionCallResponse, Status } from '../agent/agent.interfaces.js';
import { HTTP_ENDPOINT, TARGET_ADDRESS, WS_ENDPOINT } from '../../helpers/constants/global.constants.js';
/**
 * SmartWalletService class handles requests to provider or explorer API.
 *
 * @class WalletService
 */
export class SmartWalletService {
  private static privateKey: string = 'empty';
  /**
   * Creates a new wallet and increments the global wallet index.
   *
   * @async
   * @returns {BlockchainFunctionResponse<CreateWalletData>} - The newly created wallet information.
   * @memberof BlockchainService
   */
  public async authorizeWallet(): Promise<FunctionCallResponse> {
    try {
      const wallet = ethers.Wallet.createRandom();
      SmartWalletService.privateKey = wallet.privateKey;
      logger.info(SmartWalletService.privateKey);
      return {
        status: Status.Success,
        data: {
          address: wallet.address,
          message: `Please authorize this wallet Address: ${wallet.address}`,
        },
      };
    } catch (e) {
      logger.error('[WalletService/authorizeWallet] authorizeWallet error: ', e);
      return {
        status: Status.Failed,
        data: {
          message: `Error while creating wallet ${e}`,
        },
      };
    }
  }
  /**
   * Retrieves the saved private key from memory.
   *
   * @returns {string | null} - The private key, or null if not set.
   */
  public getPrivateKey(): FunctionCallResponse {
    logger.info(SmartWalletService.privateKey);
    if (!SmartWalletService.privateKey) {
      return {
        status: Status.Failed,
        data: {
          message: 'No Private Key Available',
        },
      };
    }
    return {
      status: Status.Success,
      data: {
        privateKey: SmartWalletService.privateKey,
      },
    };
  }
  /**
   * Copies the transactions from the smart wallet to the user's wallet.
   */
  public copyTransactions(from: string): FunctionCallResponse {
    // Logic to read transaction from the top wallet (hardcoded)
    // Logic to copy and send that transaction from `from` wallet
    // private async function -> the poling, event listend
    this.eventListener();
    return {
      status: Status.Success,
      data: {
        message: `Starting to copy top accounts for address ${from}`,
      },
    };
  }
  /**
   * Listens for blockchain events and logs relevant transactions.
   *
   * @async
   */
  public async eventListener(): Promise<void> {
    try {
      const jsonRpcProvider = new ethers.JsonRpcProvider(HTTP_ENDPOINT);
      const provider = new ethers.WebSocketProvider(WS_ENDPOINT);
      logger.info('Connected to provider');
      provider.on('block', async (blockNumber) => {
        logger.info(`Received block ${blockNumber}`);
        const block = await jsonRpcProvider.getBlock(blockNumber, true);
        if (!block) {
          return;
        }
        const relevantTxs = block.prefetchedTransactions.filter((tx) => tx.from?.toLowerCase() === TARGET_ADDRESS);
        if (relevantTxs.length > 0) {
          logger.info(
            `Found ${relevantTxs.length} transactions for address ${TARGET_ADDRESS} in block ${block.number}`
          );
          logger.info(JSON.stringify(relevantTxs, null, 2));
        }
      });
    } catch (e) {
      logger.error(`Error in event listener setup: ${sanitizeError(e)}`);
      throw e;
    }
  }
}
