Here’s a simple README for the `ai` folder within the `developer-platform-sdk-examples` repository, which will contain example AI applications:

---

# AI Example Apps

This folder contains example applications demonstrating how to integrate and interact with AI capabilities using the **Crypto.com Developer Platform**.

## Overview

The AI example apps in this directory showcase various use cases of integrating AI-powered services, such as natural language processing (NLP), blockchain queries, and intelligent responses using the **Crypto.com Developer Platform**.

## Structure

Each sub-folder contains an example AI application with code, configurations, and instructions on how to run and explore the use cases.

### Example App 1: `cryptocom-ai-agent-service`

This example demonstrates how to create an AI query handler that sends user inputs to the AI Agent and retrieves intelligent responses.

- **Folder**: `./cryptocom-ai-agent-service`
- **Functionality**: By following this example, we will be able to self-host the AI element of the SDK, specifically the AI agent client, independently. This offers developers and projects greater control and flexibility compared to using the AI agent API directly. Underneath, the AI agent client utilizes the package to obtain data and interact with Cronos Chains.
- [Reference documentation](https://ai-agent-sdk-docs.crypto.com/on-chain-functions-and-examples/self-hosting-ai-agent-server)

### Example App 2: `ai-agent-chatbot`

This example shows how to use AI to check token balances by asking natural language questions.

- **Folder**:
   - `./cryptocom-ai-agent-chatbot` for **TypeScript**;
   - `./cryptocom-ai-agent-chatbot` for **Python**.
- **Functionality**: The Crypto.com AI Agent Chatbot is a Vite-powered React application integrated with OpenAI's NLP capabilities and the Crypto.com Developer Platform. This chatbot app allows users to interact with blockchain services through natural language, making it easy to query data or perform actions on the blockchain.
- [Reference documentation](https://ai-agent-sdk-docs.crypto.com/on-chain-functions-and-examples/ai-agent-chatbot)

## Getting Started

To get started with the example apps in this folder:

1. **Navigate to the desired example app folder**:

   ```bash
   cd ai/<example-app-folder>
   ```

2. **Follow the setup instructions** in the specific app's README to install dependencies and run the app.

## Requirements

- Node.js v18+
- [Explorer API keys for Cronos Chains](https://ai-agent-sdk-docs.crypto.com/resources-for-developers#explorer-api-keys)
- [OpenAI API key](https://platform.openai.com/docs/quickstart/developer-quickstart)

## Contributing

Feel free to contribute more example apps or improve the existing ones! Fork this repository, add your changes, and submit a pull request.

## License

All example apps are licensed under the MIT license.

---

This simple README gives an overview of the purpose of the `ai` folder, describes the contents, and provides instructions on how to get started with the example AI applications.
