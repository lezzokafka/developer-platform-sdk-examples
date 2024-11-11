# Telegram Chatbot for Cronos zkEVM

A Telegram bot that interacts with Cronos zkEVM network, allowing users to query blockchain information and perform transactions.

## Prerequisites

### Environment Variables Setup
1. Set your Explorer API key:
   ```
   CRONOS_ZKEVM_TESTNET_API=your_explorer_api_key_here
   ```
2. Set your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Set your Telegram Bot token:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ```

### MetaMask Setup
1. Install MetaMask browser extension
2. Add Cronos zkEVM Testnet to MetaMask with these details:
   ```
   Network Name: Cronos zkEVM Sepolia Testnet
   New RPC URL: https://testnet.zkevm.cronos.org/
   Chain ID: 240
   Currency Symbol: zkTCRO
   Block Explorer URL: https://explorer.zkevm.cronos.org/testnet/
   ```

## Installation and Setup

### 1. Set Up AI Service
1. Navigate to the AI service directory:
   ```
   cd cryptocom-ai-agent-service
   ```
2. Export environment variables:
   ```
   export EXPLORER_API_KEY=$CRONOS_ZKEVM_TESTNET_API
   export NODE_ENV=development
   ```
3. Install dependencies and start the service:
   ```
   yarn
   yarn dev
   ```
The AI service will run on port 8000.

### 2. Set Up Telegram Bot
1. Create a Python virtual environment:
   ```
   conda create -n telegram-bot python=3.10
   conda activate telegram-bot
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Start the bot:
   ```
   python bot.py
   ```

## Bot Commands
- `/start` - Initialize the bot
- `/time` - Get current UTC and local time
- `/debug` - Display debug information about the current user

## Basic Prompts
The bot understands the following natural language commands:
- `get latest block` - Retrieve the latest block information
- `send 0x...receiver_address 0.1` - Send 0.1 ZKTCRO to the specified receiver address
- `send 0x...receiver_address 1.0 to erc20 0x...erc20contractaddress` - Send ERC20 tokens to the specified address

## Architecture
The bot works by:
1. Receiving messages through Telegram
2. Processing queries via the AI service running on port 8000
3. Returning responses including transaction magic links when applicable

## Error Handling
- The bot will notify you if there are connection issues with the AI service
- Transaction errors will be reported with appropriate error messages
- Invalid commands will receive helpful error responses
