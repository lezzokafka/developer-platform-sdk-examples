import { ethers } from 'ethers';

const HTTP_ENDPOINT = 'https://testnet.zkevm.cronos.org';
const WS_ENDPOINT = 'wss://ws.testnet.zkevm.cronos.org';
const TARGET_ADDRESS = '0x31674DD217082a4Bb445630a625D8f5EDe76F462'.toLowerCase();

async function main() {
  const jsonRpcProvider = new ethers.JsonRpcProvider(HTTP_ENDPOINT);
  const provider = new ethers.WebSocketProvider(WS_ENDPOINT);
  console.log('Connected to provider');
  
  provider.on('block', async (blockNumber) => {
    console.log(`Received block ${blockNumber}`);
    
    const block = await jsonRpcProvider.getBlock(blockNumber, true);
    
    const relevantTxs = block.prefetchedTransactions.filter(tx => 
      tx.from?.toLowerCase() === TARGET_ADDRESS
    );

    if (relevantTxs.length > 0) {
      console.log(`Found ${relevantTxs.length} transactions for address ${TARGET_ADDRESS} in block ${block.number}`);
      console.log(relevantTxs);
    }
  });
}

main().catch(console.error);
