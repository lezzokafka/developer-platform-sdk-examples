import { ethers } from 'ethers';
import { logger } from '../../helpers/logger.helper.js';
import { FunctionCallResponse, Status } from '../agent/agent.interfaces.js';

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

    return {
      status: Status.Success,
      data: {
        message: `Copied transactions from ${from}`,
      },
    };
  }
}
