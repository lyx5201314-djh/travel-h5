import { ref, nextTick, watch, type Ref } from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { chatStream } from "../../../api";
import type { ChatMessage, UseChatOptions } from "./type";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

export const FAQ_QUESTIONS = [
  "如何预订性价比高的酒店？",
  "第一次去云南怎么规划路线？",
  "国内有哪些适合亲子游的目的地？",
  "旅游旺季如何避开人潮？",
  "自由行和跟团游哪个更划算？",
  "出国旅游需要准备哪些证件？",
  "如何制定合理的旅游预算？",
];

export function useChat(options: UseChatOptions = {}) {
  const messages = ref<ChatMessage[]>([]);
  const inputText = ref("");
  const loading = ref(false);
  const streamingText = ref("");
  const messageListRef = ref<HTMLElement | null>(null);
  const inputBarRef = ref<HTMLElement | null>(null);

  function scrollToBottom() {
    nextTick(() => {
      const el = messageListRef.value;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  watch(messages, scrollToBottom, { deep: true });

  function formatContent(content: string): string {
    if (!content) return "";

    let processed = content
      .replace(/^(#{1,6})([^\s#])/gm, "$1 $2")
      .replace(/^(\s*)(#{1,6})([^\s#])/gm, "$1$2 $3")
      .replace(/\*\*\*/g, "*** ")
      .replace(/\*\*([^\s*][^*]*[^\s*])\*\*/g, "**$1**")
      .replace(/\*([^\s*][^*]*[^\s*])\*/g, "*$1*")
      .replace(/`([^\s`][^`]*[^\s`])`/g, "`$1`");

    const html = md.render(processed);
    return DOMPurify.sanitize(html);
  }

  async function sendMessage() {
    const text = inputText.value.trim();
    if (!text || loading.value) return;

    messages.value.push({ role: "user", content: text });
    inputText.value = "";
    loading.value = true;
    streamingText.value = "";

    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: "",
      streaming: true,
    };
    messages.value.push(assistantMsg);

    try {
      await chatStream(
        text,
        (chunk: string) => {
          assistantMsg.content += chunk;
          streamingText.value = assistantMsg.content;
          scrollToBottom();
        },
        () => {
          assistantMsg.streaming = false;
          loading.value = false;
          streamingText.value = "";
          options.onMessageSent?.();
        },
        (error: Error) => {
          assistantMsg.content = `抱歉，出了点问题：${error.message}`;
          assistantMsg.streaming = false;
          loading.value = false;
          streamingText.value = "";
          options.onError?.(error);
        },
      );
    } catch (error: any) {
      assistantMsg.content = `抱歉，出了点问题：${error.message}`;
      assistantMsg.streaming = false;
      loading.value = false;
      streamingText.value = "";
      options.onError?.(error);
    }
  }

  function clearMessages() {
    messages.value = [];
  }

  function selectQuestion(question: string) {
    inputText.value = question;
    nextTick(() => {
      inputBarRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      const inputEl = inputBarRef.value?.querySelector(
        ".chat-input input",
      ) as HTMLInputElement;
      inputEl?.focus();
    });
  }

  return {
    messages,
    inputText,
    loading,
    streamingText,
    messageListRef,
    inputBarRef,
    sendMessage,
    clearMessages,
    selectQuestion,
    formatContent,
    scrollToBottom,
  };
}

export type UseChatHookReturn = ReturnType<typeof useChat>;
