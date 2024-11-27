import { ethers, parseEther } from 'ethers';
import { logger, sanitizeError } from '../../helpers/logger.helper.js';
import { FunctionCallResponse, Status } from '../agent/agent.interfaces.js';
import { HTTP_ENDPOINT, TARGET_ADDRESS, WBTC_ADDRESS, WS_ENDPOINT } from '../../helpers/constants/global.constants.js';
import { Provider, Wallet } from 'zksync-ethers';
/**
 * SmartWalletService class handles requests to provider or explorer API.
 *
 * @class WalletService
 */
export class SmartWalletService {
  private static privateKey: string = '0x9ad28a220898e0702f1cb17fea4dfbb2d58fe2e9603a0fc6974c041885f714c2';
  private static status: TxStatus[] = [];
  private static hasAccepted: boolean = false;
  private static prevStep: string = '';

  public async acceptRequest(): Promise<FunctionCallResponse> {
    try {
      return {
        status: Status.Success,
        data: {
          message:
            'Sure, I will copy trade from now on the transaction from the top accounts on Cronos zkEvm. Do you accept?',
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

  public async accountRequest(): Promise<FunctionCallResponse> {
    try {
      SmartWalletService.prevStep = 'acceptRequest';
      SmartWalletService.hasAccepted = true;

      const wallet = ethers.Wallet.createRandom();
      SmartWalletService.privateKey = wallet.privateKey;
      logger.info(SmartWalletService.privateKey);

      return {
        status: Status.Success,
        data: {
          address: wallet.address,
          message: `I will generate a wallet to perform the operation can you authorize this address ${wallet.address} to send transactions from your account. What is your account?`,
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

  public getTransaction(): FunctionCallResponse {
    const txStatus = SmartWalletService.status;
    SmartWalletService.status = [];

    return {
      status: Status.Success,
      data: {
        txStatus: txStatus,
      },
    };
  }

  /**
   * Copies the transactions from the smart wallet to the user's wallet.
   */
  public initCopyTrade(from: string): FunctionCallResponse {
    // Logic to read transaction from the top wallet (hardcoded)
    // Logic to copy and send that transaction from `from` wallet
    // private async function -> the poling, event listend
    this.eventListener(from);
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
  public async eventListener(from: string): Promise<void> {
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
        logger.info(`Found ${relevantTxs.length} transactions for address ${TARGET_ADDRESS} in block ${block.number}`);

        if (relevantTxs.length < 1) {
          return;
        }
        // only care the first tx
        const txToCopy = relevantTxs[0];

        logger.info(JSON.stringify(txToCopy, null, 2));

        SmartWalletService.status.push({
          type: 'newTxDetected',
          data: {
            txHash: txToCopy.hash,
            tokenName: 'WBTC',
            tokenAmount: '0.01',
          },
        });
        logger.info(SmartWalletService.privateKey);
        const provider = new Provider(HTTP_ENDPOINT);
        const wallet = new Wallet(SmartWalletService.privateKey, provider);

        const nonce = await provider.getTransactionCount(from);

        const response = await wallet.sendTransaction({
          nonce: nonce,
          to: WBTC_ADDRESS,
          value: parseEther('0.01'),
          from: from,
          data: '0x8119c065',
        });

        logger.info('Tx sent: ', response);

        SmartWalletService.status.push({
          type: 'txCompleted',
          data: {
            txHash: response.hash,
          },
        });
      });
    } catch (e) {
      logger.error(`Error in event listener setup: ${sanitizeError(e)}`);
      throw e;
    }
  }
}

type TxStatus =
  | {
      type: 'newTxDetected';
      data: {
        txHash: string;
        tokenName: string;
        tokenAmount: string;
      };
    }
  | {
      type: 'txCompleted';
      data: {
        txHash: string;
      };
    };
