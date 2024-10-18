export interface ClientConfig {
  openAI: {
    apiKey: string;
  };
  chainId: string;
  explorer: {
    apiKey: string;
  };
}

export interface ChainAiApiResponse {
  status: string;
  hasErrors: boolean;
  results: Array<{
    data: object;
  }>;
  context: Array<{
    role: string;
    content: string;
  }>;
}

export interface ChainAiApiResponseError {
  response: {
    data: {
      error: string;
    };
  };
}
