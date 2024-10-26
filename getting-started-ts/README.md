# Crypto.com Typescript Developer Platform Client - Getting Started

The Crypto.com Typescript Developer Platform Client provides a simple way to interact with the Developer Platform, including creating wallets, querying balances, and interacting with smart contracts. This example shows how to quickly get started with using the Typescript Client.

## Getting Started

To start, create an explorer API key corresponding to the network you want to interact with:

- [Cronos EVM Mainnet](https://explorer.cronos.org/user/apikeys)
- [Cronos EVM Testnet](https://explorer.cronos.org/testnet/user/apikeys)
- [Cronos ZK EVM Mainnet/ Cronos ZK EVM Testnet](https://developers.zkevm.cronos.org/user/apikeys)

Then, set the following environment variables - for example, within a `.env` file, or by using Replit Secret Manager (if you are accessing this template from Replit). A `.env.example` file is provided for reference.

```
EVM_MAINNET_API_KEY=
EVM_TESTNET_API_KEY=
ZKEVM_MAINNET_API_KEY=
ZKEVM_TESTNET_API_KEY=
```

## Install the dependencies:

### yarn

Install the dependencies using yarn:

```
yarn
```

Then, run the development server:

```
yarn dev
```

### npm

```
npm install
```

Then, run the development server:

```
npm run dev
```

## Learn More

To learn more about the Typescript Developer Platform Client, take a look at the following resources:

- [Crypto.com Developer Platform Client.ts](https://github.com/crypto-com/developer-platform-client-ts)
- [More examples](https://github.com/crypto-com/developer-platform-sdk-examples)
