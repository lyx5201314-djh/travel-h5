<script setup lang="ts">
import { useChat, FAQ_QUESTIONS } from './ts/hook'

const {
  messages,
  inputText,
  loading,
  streamingText,
  messageListRef,
  inputBarRef,
  sendMessage,
  clearMessages,
  selectQuestion,
  formatContent
} = useChat()

const faqQuestions = FAQ_QUESTIONS
</script>

<template>
  <div class="chat-page">
    <header class="chat-header">
      <h1>AI旅游助手</h1>
      <van-button
        v-if="messages.length"
        type="default"
        size="small"
        plain
        class="clear-btn"
        @click="clearMessages"
      >
        清空
      </van-button>
    </header>

    <div class="message-list" ref="messageListRef">
      <template v-if="!messages.length">
        <div class="empty-state">
          <div class="empty-icon">🗺️</div>
          <p>你好！我是AI旅游助手</p>
          <p class="empty-hint">有任何旅游问题都可以问我</p>
        </div>

        <div class="faq-section">
          <h3 class="faq-title">常见问题</h3>
          <div class="faq-list">
            <div
              v-for="(question, index) in faqQuestions"
              :key="index"
              class="faq-item"
              @click="selectQuestion(question)"
              role="button"
              tabindex="0"
              @keydown.enter="selectQuestion(question)"
            >
              <span class="faq-text">{{ question }}</span>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item', msg.role === 'user' ? 'msg-user' : 'msg-assistant']"
        >
          <div class="msg-avatar">{{ msg.role === 'user' ? '🧑' : '🤖' }}</div>
          <div class="msg-bubble">
            <div class="msg-text" v-html="formatContent(msg.content)"></div>
            <div v-if="msg.role === 'assistant' && msg.streaming" class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div v-if="loading && !streamingText" class="message-item msg-assistant">
          <div class="msg-avatar">🤖</div>
          <div class="msg-bubble">
            <div class="skeleton" style="width: 120px; height: 16px;"></div>
            <div class="skeleton" style="width: 180px; height: 16px; margin-top: 8px;"></div>
          </div>
        </div>
      </template>
    </div>

    <div class="input-bar" ref="inputBarRef">
      <van-field
        v-model="inputText"
        class="chat-input"
        placeholder="输入您的问题..."
        :disabled="loading"
        @keyup.enter="sendMessage"
      />
      <van-button
        type="primary"
        size="small"
        class="send-btn"
        :disabled="!inputText.trim() || loading"
        :loading="loading"
        loading-text="发送中"
        @click="sendMessage"
      >
        发送
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

.chat-header h1 {
  font-size: 17px;
  font-weight: 700;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
}

.message-list {
  flex: 1;
  margin-top: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.empty-state {
  text-align: center;
  padding: 40px 20px 24px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: var(--text);
}

.empty-hint {
  font-size: 13px !important;
  color: var(--text-secondary) !important;
  margin-top: 4px;
}

.faq-section {
  background: #f5f5f5;
  margin: 0 16px 16px;
  border-radius: 12px;
  padding: 16px;
}

.faq-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
  padding-left: 4px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.faq-item:hover {
  background: #fafafa;
  border-color: var(--primary-light);
  transform: translateX(2px);
}

.faq-item:active {
  transform: scale(0.98);
}

.faq-text {
  font-size: 14px;
  color: var(--text);
  line-height: 1.4;
  flex: 1;
  margin-right: 8px;
}

.message-item {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: flex-start;
  padding: 0 16px;
}

.msg-user {
  flex-direction: row-reverse;
}

.msg-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.msg-user .msg-bubble {
  background: var(--primary);
  color: #fff;
  border-top-right-radius: 4px;
}

.msg-assistant .msg-bubble {
  background: var(--card-bg);
  color: var(--text);
  border-top-left-radius: 4px;
  box-shadow: var(--shadow);
}

.msg-text {
  white-space: pre-wrap;
}

.msg-assistant .msg-text {
  white-space: normal;
}

.msg-assistant .msg-text :deep(h1),
.msg-assistant .msg-text :deep(h2),
.msg-assistant .msg-text :deep(h3),
.msg-assistant .msg-text :deep(h4) {
  margin: 12px 0 8px;
  font-weight: 700;
  line-height: 1.4;
}

.msg-assistant .msg-text :deep(h1) { font-size: 18px; }
.msg-assistant .msg-text :deep(h2) { font-size: 16px; }
.msg-assistant .msg-text :deep(h3) { font-size: 15px; }
.msg-assistant .msg-text :deep(h4) { font-size: 14px; }

.msg-assistant .msg-text :deep(p) {
  margin: 6px 0;
  line-height: 1.7;
}

.msg-assistant .msg-text :deep(ul),
.msg-assistant .msg-text :deep(ol) {
  margin: 6px 0;
  padding-left: 20px;
}

.msg-assistant .msg-text :deep(li) {
  margin: 4px 0;
  line-height: 1.6;
}

.msg-assistant .msg-text :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.msg-assistant .msg-text :deep(pre) {
  background: rgba(0, 0, 0, 0.06);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.msg-assistant .msg-text :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

.msg-assistant .msg-text :deep(blockquote) {
  border-left: 3px solid var(--primary);
  margin: 8px 0;
  padding: 4px 12px;
  color: var(--text-secondary);
  background: rgba(74, 144, 226, 0.05);
  border-radius: 0 4px 4px 0;
}

.msg-assistant .msg-text :deep(a) {
  color: var(--primary);
  text-decoration: none;
}

.msg-assistant .msg-text :deep(a:hover) {
  text-decoration: underline;
}

.msg-assistant .msg-text :deep(strong) {
  font-weight: 700;
}

.msg-assistant .msg-text :deep(em) {
  font-style: italic;
}

.msg-assistant .msg-text :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 12px 0;
}

.msg-assistant .msg-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
  font-size: 13px;
}

.msg-assistant .msg-text :deep(th),
.msg-assistant .msg-text :deep(td) {
  border: 1px solid var(--border);
  padding: 6px 10px;
  text-align: left;
}

.msg-assistant .msg-text :deep(th) {
  background: rgba(0, 0, 0, 0.03);
  font-weight: 600;
}

.typing-indicator {
  display: inline-flex;
  gap: 4px;
  margin-left: 4px;
  vertical-align: middle;
}

.typing-indicator span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-secondary);
  animation: typing 1.2s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
}

.input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  background: var(--card-bg);
  border-top: 1px solid var(--border);
}

.chat-input {
  flex: 1;
  background: transparent;
  padding: 0;
}

.chat-input :deep(.van-field__control) {
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  font-size: 14px;
  background: var(--bg);
  color: var(--text);
  transition: border-color 0.2s;
}

.chat-input :deep(.van-field__control:focus) {
  border-color: var(--primary);
}

.chat-input :deep(.van-field__control::placeholder) {
  color: #c0c4cc;
}

.send-btn {
  flex-shrink: 0;
  border-radius: 20px;
  padding: 0 18px;
  height: 36px;
}

.clear-btn {
  font-size: 13px;
  padding: 0 8px;
  height: 28px;
}
</style>
