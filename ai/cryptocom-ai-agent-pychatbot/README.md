## Prepare Explorer and OpenAI API Key
1. Set your Explorer API key:
   ```
   CRONOS_ZKEVM_TESTNET_API=your_explorer_api_key_here
   ```
2. Set your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
## MetaMask Setup
1. Install MetaMask.
2. Add a custom network with the following details:
   ```
   Network Name: Cronos zkEVM Sepolia Testnet
   New RPC URL: https://testnet.zkevm.cronos.org/
   Chain ID: 240
   Currency Symbol: zkTCRO
   Block Explorer URL: https://explorer.zkevm.cronos.org/testnet/
   ```

## Run AI Service
1. Navigate to the `cryptocom-ai-agent-service` directory in this repository:
   ```
   cd cryptocom-ai-agent-service
   ```
2. Export the necessary environment variables:
   ```
   export EXPLORER_API_KEY=$CRONOS_ZKEVM_TESTNET_API
   export NODE_ENV=development
   ```
3. Install dependencies and start the service:
   ```
   yarn
   yarn dev
   ```
4. The AI service will run on port 8000. Test the AI service with the following command:
   ```
   curl -X POST http://localhost:8000/api/v1/cdc-ai-agent-service/query \
   -H "Content-Type: application/json" \
   -d '{
     "query": "Get the latest block",
     "options": {
       "openAI": {
         "apiKey": "'"$OPENAI_API_KEY"'"
       }
     }
   }'
   ```

## Run PyChatBot
1. Create a new conda environment:
   ```
   conda create -n pychatbot python=3.10
   ```
2. Activate the conda environment:
   ```
   conda activate pychatbot
   ```
3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
4. Run the chatbot:
   ```
   python chat.py
   ```
## Basic Prompts
- `get latest block`: Retrieve the latest block information.
- `send 0x...receiver_address 0.1`: Send 0.1 ZKTCRO to the specified receiver address.
- `send 0x...receiver_address 1.0 to erc20 0x...erc20contractaddress`: Send 1.0 ERC20 token to the specified receiver address using the given ERC20 contract address.
