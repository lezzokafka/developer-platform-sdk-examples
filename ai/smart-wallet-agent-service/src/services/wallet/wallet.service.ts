import { ethers } from 'ethers';
import { logger } from '../../helpers/logger.helper.js';
import { FunctionCallResponse, Status } from '../agent/agent.interfaces.js';

/**
 * WalletService class handles requests to provider or explorer API.
 *
 * @class WalletService
 */
export class WalletService {
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

      WalletService.privateKey = wallet.privateKey;
      logger.info(WalletService.privateKey);
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
    logger.info(WalletService.privateKey);
    if (!WalletService.privateKey) {
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
        privateKey: WalletService.privateKey,
      },
    };
  }
}
