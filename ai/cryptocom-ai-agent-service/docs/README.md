### Getting Started

In this section, we'll walk through how to test different queries using our blockchain service functions. We have various blockchain operations supported, ranging from sending transactions to fetching data from the blockchain. Below are the available functions, the corresponding Function Arguments, and example queries to help you test and trigger the functions.

#### Available Functions and Example Queries

1. **Send Transaction**
   - Sends a transaction from one address to another.
   - **Function Argument**:
     ```json
     {
       "to": "0xRecipientAddress",
       "amount": 1,
       "symbol": "ZKCRO"
     }
     ```
   - **Example**: 
     ```bash
     query: "Send 1 ZKCRO to 0xRecipientAddress"
     ```
   - **Function Name**: `SendTransaction`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "SendTransaction",
     "message": "Signature url created successfully. Please sign the transaction on this link",
     "data": {
       "magicLink": "https://{provider}/sign-transaction/{transactionId}?token={token}"
     }
   }
   ```

   **Note:** This function returns a magic link. [Read more about Magic Link](#magic-link-signer).

2. **Get Balance**
   - Fetches the balance of multiple wallet addresses.
   - **Function Argument**:
     ```json
     {
       "walletAddresses": ["0xWalletAddress1", "0xWalletAddress2"]
     }
     ```
   - **Example**:
     ```bash
     query: "Get balance for 0xWalletAddress1 and 0xWalletAddress2"
     ```
   - **Function Name**: `GetBalance`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "GetBalance",
     "message": "Balances: 0xAddress: 0.5 ETH",
     "data": {
       "balances": [
         {
           "address": "0xAddress",
           "balanceWei": "500000000000000000",
           "balanceEth": "0.5",
           "balanceVUsd": "1000"
         }
       ]
     }
   }
   ```

3. **Get Latest Block**
   - Fetches the latest block information.
   - **Function Argument**: 
     ```json
     {}
     ```
   - **Example**:
     ```bash
     query: "What is the latest block on the chain?"
     ```
   - **Function Name**: `GetLatestBlock`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "GetLatestBlock",
     "message": "Latest block height: 123456",
     "data": {
       "blockHeight": 123456,
       "timestamp": "2023-09-24T14:22:00.000Z"
     }
   }
   ```

4. **Get Transactions by Address**
   - Fetches transactions for a specific address.
   - **Function Argument**:
     ```json
     {
       "address": "0xYourAddress",
       "session": "ExplorerPageSession", // TODO: automatically adjust page based on user instruction
       "limit": 20
     }
     ```
   - **Example**:
     ```bash
     query: "Show transactions for 0xYourAddress"
     ```
   - **Function Name**: `GetTransactionsByAddress`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "GetTransactionsByAddress",
     "message": "Retrieved 20 transactions for 0xAddress",
     "data": {
       "transactions": [...],
       "pagination": {...}
     }
   }
   ```

5. **Get Contract ABI**
   - Fetches the ABI (Application Binary Interface) of a contract.
   - **Function Argument**:
     ```json
     {
       "address": "0xContractAddress"
     }
     ```
   - **Example**:
     ```bash
     query: "Fetch the ABI for contract at 0xContractAddress"
     ```
   - **Function Name**: `GetContractABI`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "GetContractABI",
     "message": "Fetched ABI for contract at 0xContractAddress",
     "data": { "abi": result }
   }
   ```

6. **Get Transaction by Hash**
   - Fetches the details of a transaction using its hash.
   - **Function Argument**:
     ```json
     {
       "txHash": "0xTransactionHash"
     }
     ```
   - **Example**:
     ```bash
     query: "Get transaction details for 0xTransactionHash"
     ```
   - **Function Name**: `GetTransactionByHash`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "GetTransactionByHash",
     "message": "Retrieved details for transaction 0xTransactionHash",
     "data": { ... }
   }
   ```

7. **Get Block by Number**
   - Fetches the details of a block using its block number.
   - **Function Argument**:
     ```json
     {
       "blockNumbers": ["latest"],
       "txDetail": false
     }
     ```
   - **Example**:
     ```bash
     query: "Fetch details of the latest block"
     ```
   - **Function Name**: `GetBlocksByNumber`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "GetBlocksByNumber",
     "message": "Retrieved information for blocks",
     "data": { ... }
   }
   ```

8. **Get Transaction Status**
   - Fetches the status of a transaction using its hash.
   - **Function Argument**:
     ```json
     {
       "txHash": "0xTransactionHash"
     }
     ```
   - **Example**:
     ```bash
     query: "What is the status of transaction 0xTransactionHash?"
     ```
   - **Function Name**: `GetTransactionStatus`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "GetTransactionStatus",
     "message": "Transaction status: Success",
     "data": { ... }
   }
   ```

9. **Create Wallet**
   - Generates a new Ethereum wallet with a random private key.
   - **Function Argument**:
     ```json
     {}
     ```
   - **Example**:
     ```bash
     query: "Create a new Ethereum wallet"
     ```
   - **Function Name**: `CreateWallet`

   **Response:**
   ```json
   {
     "status": "Success",
     "action": "CreateWallet",
     "message": "New wallet created: 0xWalletAddress",
     "data": {
       "newWallet": {
         "address": "0xWalletAddress",
         "privateKey": "************",
         "mnemonic": "************"
       }
     }
   }
   ```

10. **Wrap Token**
    - Wraps zkCRO tokens into wrapped tokens.
    - **Function Argument**:
      ```json
      {
        "amount": 100
      }
      ```
    - **Example**:
      ```bash
      query: "Wrap 100 zkCRO tokens"
      ```
    - **Function Name**: `WrapToken`

    **Response:**
    ```json
    {
      "status": "Success",
      "action": "WrapToken",
      "message": "Signature URL created successfully. Please sign the transaction on this link.",
      "data": {
        "magicLink": "http://{provider}/wrap-token/{transactionId}?token={token}"
      }
    }
    ```

   **Note:** This function returns a magic link. [Read more about Magic Link](#magic-link-signer).

11. **Swap Token**
    - Swaps one token into another (e.g., zkCRO to VUSD).
    - **Function Argument**:
      ```json
      {
        "amount": 100
      }
      ```
    - **Example**:
      ```bash
      query: "Swap 100 zkCRO tokens to VUSD"
      ```
    - **Function Name**: `SwapToken`

    **Response:**
    ```json
    {
      "status": "Success",
      "action": "SwapToken",
      "message": "Signature URL created successfully. Please sign the transaction on this link.",
      "data": {
        "magicLink": "http://{provider}/swap-token/{transactionId}?token={token}"
      }
    }
    ```

   **Note:** This function returns a magic link. [Read more about Magic Link](#magic-link-signer).

---

### Magic Link Signer

To successfully test and utilize the Magic Link functionality, you need to clone and run a local signer app that processes the signature requests. The **magic link** will redirect to this app, allowing you to sign transactions or token swaps.

#### Steps to Set Up the Magic Link Signer App

1. **Clone the Signer App Repository**:
   Clone the repository that contains the

 signer app:
   ```bash
   git clone https://github.com/crypto-com/cdc-ai-agent-signer-app
   ```

2. **Install Dependencies**:
   Navigate into the cloned directory and install the required dependencies:
   ```bash
   cd cdc-ai-agent-signer-app
   npm install
   ```

3. **Run the Signer App**:
   Start the app using the following command:
   ```bash
   npm run dev
   ```
   This will start the signer app locally on `http://localhost:5173`.

4. **Pass the Provider in the Client Library**:
   In the client library configuration, you need to pass this local signer app as the provider in the options:
   ```json
   "custom": {
     "provider": "http://localhost:5173"
   }
   ```

5. **Magic Link Redirection**:
   When you generate a magic link for actions such as sending transactions or swapping tokens, it will redirect the user to this signer app (`http://localhost:5173`). The developer can customize this app to handle various signing operations or UI changes as per their project requirements.

#### Example Magic Link Response

Here’s how the response looks with a magic link:
```json
{
  "status": "Success",
  "action": "SendTransaction",
  "message": "Signature URL created successfully. Please sign the transaction on this link.",
  "data": {
    "magicLink": "http://localhost:5173/sign-transaction/{transactionId}?token={token}"
  }
}
```

In this case, the magic link will redirect to `http://localhost:5173`, where the signer app will display the details of the transaction for the user to approve or reject.

#### Customizing the Signer App

The developer can further customize the signer app by modifying the cloned repository to:
- Add custom branding.
- Implement additional validation.
- Modify the signing flow according to specific use cases.

By running the app locally, the developer can see the magic link redirect in action and tweak the behavior to suit their project.