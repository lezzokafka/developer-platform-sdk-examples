import { Contract, ethers, parseUnits, formatUnits, MaxUint256 } from 'ethers';
import { FunctionCallResponse, Status } from '../agent/agent.interfaces.js';
import { TOKEN_SYMBOLS_ADDRESSES, DEX_ROUTER_ADDRESS } from '../../helpers/constants/token.constants.js';
import { Interface } from 'ethers';

// Add new interfaces at the top
interface TransactionOptions {
  gasLimit?: bigint;
  gasPrice?: bigint;
  type?: number;
  nonce?: number;
}

const ERC20_INTERFACE = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)'
];

const DEX_INTERFACE = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to) external returns (uint[] amounts)'
];

export default class TokenService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet | null = null;

  constructor(rpcUrl: string, privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  public async transfer(to: string, amount: string, contractAddress?: string): Promise<FunctionCallResponse> {
    if (!this.signer) {
      return {
        status: Status.Failed,
        data: {
          message: 'Signer not initialized. Please call initializeSigner first.',
        },
      };
    }

    try {
      let tx;

      if (contractAddress) {
        const tokenContract = new Contract(
          contractAddress,
          ['function transfer(address to, uint256 amount) public returns (bool)'],
          this.signer
        );

        tx = await tokenContract.transfer(to, parseUnits(amount, 18));
      } else {
        tx = await this.signer.sendTransaction({
          to,
          value: parseUnits(amount, 'ether'),
        });
      }

      const receipt = await tx.wait();
      return {
        status: Status.Success,
        data: {
          transactionHash: receipt.hash,
          message: 'Transfer successful',
        },
      };
    } catch (e) {
      return {
        status: Status.Failed,
        data: {
          message: `Error in transferToken: ${e}`,
        },
      };
    }
  }

  /**
   * Wraps a specified amount of ETH into WETH.
   *
   * @async
   * @param amount - Amount of ETH to wrap.
   * @returns {Promise<FunctionCallResponse>} - Response with transaction details or error.
   * @memberof TokenService
   */
  public async wrap(amount: string): Promise<FunctionCallResponse> {
    if (!this.signer) {
      return {
        status: Status.Failed,
        data: {
          message: 'Signer not initialized. Please call initializeSigner first.',
        },
      };
    }

    const contractAddress = TOKEN_SYMBOLS_ADDRESSES.wzkCRO;

    if (!contractAddress) {
      return {
        status: Status.Failed,
        data: {
          message: 'Contract address is required for wrapping.',
        },
      };
    }

    try {
      const wethContract = new Contract(
        contractAddress,
        ['function deposit() public payable'],
        this.signer
      );

      const tx = await wethContract.deposit({ value: parseUnits(amount, 'ether') });
      const receipt = await tx.wait();

      return {
        status: Status.Success,
        data: {
          transactionHash: receipt.hash,
          message: 'Wrap successful',
        },
      };
    } catch (e) {
      return {
        status: Status.Failed,
        data: {
          message: `Error in wrap: ${e}`,
        },
      };
    }
  }

  // Add new private helper methods
  private async checkAndApproveToken(
    tokenContract: Contract,
    spenderAddress: string,
    amount: bigint
  ): Promise<void> {
    const signerAddress = await this.signer!.getAddress();
    const currentAllowance = await tokenContract.allowance(signerAddress, spenderAddress);
    
    if (currentAllowance < amount) {
      const feeData = await this.signer!.provider!.getFeeData();
      const estimatedGas = await tokenContract.approve.estimateGas(spenderAddress, MaxUint256);
      
      const tx = await tokenContract.approve(spenderAddress, MaxUint256, {
        gasLimit: estimatedGas * 2n,
        type: 0,
        gasPrice: feeData.gasPrice ?? undefined
      });
      await tx.wait();
    }
  }

  private async prepareSwapTransaction(
    fromAddress: string,
    toAddress: string,
    amount: bigint,
    signerAddress: string
  ): Promise<{ txData: string; options: TransactionOptions }> {
    const iface = new Interface(DEX_INTERFACE);
    const path = [fromAddress, toAddress];
    
    const encodedData = iface.encodeFunctionData('swapExactTokensForTokens', [
      amount,
      0,
      path,
      signerAddress
    ]);

    const feeData = await this.signer!.provider!.getFeeData();
    const nonce = await this.signer!.getNonce();

    return {
      txData: encodedData,
      options: {
        gasLimit: 500000n,
        gasPrice: feeData.gasPrice ?? undefined,
        type: 0,
        nonce
      }
    };
  }

  // Simplified swap method
  public async swap(
    fromContractAddress: string,
    toContractAddress: string,
    amount: string
  ): Promise<FunctionCallResponse> {
    if (!this.signer?.provider) {
      return {
        status: Status.Failed,
        data: { message: 'Signer or provider not initialized' }
      };
    }

    try {
      const signerAddress = await this.signer.getAddress();
      const amountInWei = parseUnits(amount, 18);

      // Check native token balance
      const balance = await this.signer.provider.getBalance(signerAddress);
      if (balance === 0n) {
        return {
          status: Status.Failed,
          data: { message: 'Insufficient native token balance for gas' }
        };
      }

      // Handle token approval
      const tokenContract = new Contract(fromContractAddress, ERC20_INTERFACE, this.signer);
      await this.checkAndApproveToken(tokenContract, DEX_ROUTER_ADDRESS, amountInWei);

      // Prepare and send swap transaction
      const { txData, options } = await this.prepareSwapTransaction(
        fromContractAddress,
        toContractAddress,
        amountInWei,
        signerAddress
      );

      const swapTx = await this.signer.sendTransaction({
        to: DEX_ROUTER_ADDRESS,
        from: signerAddress,
        data: txData,
        chainId: (await this.signer.provider.getNetwork()).chainId,
        value: 0,
        ...options
      });

      const receipt = await swapTx.wait();
      if (!receipt || receipt.status === 0) {
        throw new Error(`Transaction failed: ${receipt?.hash}`);
      }

      return {
        status: Status.Success,
        data: {
          message: 'Swap completed successfully',
          transactionHash: receipt.hash,
          inputAmount: formatUnits(amountInWei, 18)
        }
      };
    } catch (error) {
      return {
        status: Status.Failed,
        data: {
          message: `Swap failed: ${error instanceof Error ? error.message : String(error)}`,
          error: error instanceof Error ? error : new Error(String(error))
        }
      };
    }
  }
}
