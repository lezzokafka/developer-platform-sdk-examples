import { useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
import { chainAiInstance } from "../../integration/chain-ai.api";
import {
  StyledChatArea,
  StyledMessageContainer,
  StyledMessageComponent,
  StyledChatBotContainer,
  StyledInputContainer,
  StyledTextArea,
  StyledSendButton,
  StyledDateLabel,
  StyledDateLabelContainer,
  StyledDisclaimer,
} from "./styles";
import { InputType, Message } from "./interfaces";
import { MessageLabel } from "./MessageLabel";
import { MessageContent } from "./MessageContent";
import { JsonMessage } from "./JsonMessage";
import {
  ChainAiApiResponse,
  ChainAiApiResponseError,
} from "../../integration/chain-ai.interface";
import { getChatStartDate } from "../../helpers/chat.helpers";
import { Alert, Button } from "antd";

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const chatStartDate = getChatStartDate(messages);

  const addMessage = (
    text: string,
    type: InputType,
    isLoading: boolean,
    isJson: boolean = false,
    isMagicLink: boolean = false
  ): void => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, type, isLoading, isJson, isMagicLink, timestamp: new Date() },
    ]);
  };

  const updateBotResponse = (response: ChainAiApiResponse): void => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastBotIdx = newMessages.findIndex(
        (msg) => msg.isLoading && msg.type === InputType.Bot
      );

      if (lastBotIdx !== -1) {
        newMessages[lastBotIdx] = {
          ...newMessages[lastBotIdx],
          text: response.status || "Unknown status",
          isLoading: false,
        };

        const data = response.results[0]?.data;
        const signature = response.results[0]?.data as { magicLink: string };

        if (signature.magicLink) {
          newMessages.push({
            text: signature.magicLink,
            type: InputType.Bot,
            isJson: false,
            isLoading: false,
            timestamp: new Date(),
            isMagicLink: true,
          });
        } else if (data) {
          newMessages.push({
            text: JSON.stringify(data, null, 2),
            type: InputType.Bot,
            isJson: true,
            isLoading: false,
            timestamp: new Date(),
          });
        }
      }
      return newMessages;
    });
  };

  const handleError = (error: ChainAiApiResponseError): void => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.isLoading && msg.type === InputType.Bot
          ? {
              ...msg,
              text: error.response.data.error,
              isLoading: false,
            }
          : msg
      )
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    addMessage(userInput, InputType.User, false);
    addMessage("Typing...", InputType.Bot, true);
    setInput("");

    try {
      const response = await chainAiInstance.sendQuery(userInput);
      console.log(response);
      updateBotResponse(response);
    } catch (e) {
      const error = e as ChainAiApiResponseError;
      console.error("Failed to send query:", e);
      handleError(error);
    }
  };

  return (
    <StyledChatBotContainer>
      <StyledChatArea>
        <StyledDateLabelContainer>
          {chatStartDate && <StyledDateLabel>{chatStartDate}</StyledDateLabel>}
        </StyledDateLabelContainer>
        {messages.map((msg, index) => (
          <StyledMessageContainer key={index} message={msg}>
            <MessageLabel type={msg.type} isJson={msg.isJson} />
            <StyledMessageComponent message={msg}>
              {msg.isMagicLink ? (
                // Render a custom alert box with a button for magicLink
                <Alert
                  message="Transaction Ready"
                  description={
                    <div>
                      <p>Click the button below to sign the transaction:</p>
                      <Button type="primary" href={msg.text} target="_blank">
                        Sign Transaction
                      </Button>
                    </div>
                  }
                  type="info"
                  showIcon
                />
              ) : msg.isJson ? (
                <JsonMessage text={msg.text} />
              ) : (
                <MessageContent message={msg} />
              )}
            </StyledMessageComponent>
          </StyledMessageContainer>
        ))}
      </StyledChatArea>
      <StyledInputContainer>
        <StyledTextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
          onKeyPress={handleKeyPress}
          placeholder="Message AI Agent"
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <StyledSendButton onClick={handleSend} icon={<ArrowUpOutlined />} />
      </StyledInputContainer>
      <StyledDisclaimer>Powered by Crypto.com</StyledDisclaimer>
    </StyledChatBotContainer>
  );
}
