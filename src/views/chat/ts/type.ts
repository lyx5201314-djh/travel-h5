export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
  streaming?: boolean;
}

export interface UseChatOptions {
  onMessageSent?: () => void;
  onError?: (error: Error) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  inputText: string;
  loading: boolean;
  streamingText: string;
  sendMessage: () => Promise<void>;
  clearMessages: () => void;
  selectQuestion: (question: string) => void;
}
