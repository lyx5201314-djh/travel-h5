# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作提供指导。

## 项目概述

这是一个基于 Vue 3 + TypeScript 的移动端 H5 应用，用于 AI 驱动的旅游规划。提供两个核心功能：

- **智能推荐** - AI 根据用户输入（城市、预算、天数）生成个性化旅行行程
- **AI 对话助手** - 旅行相关问题的交互式聊天和建议

## 架构设计

### 技术栈

- **前端框架**：Vue 3 with Composition API、TypeScript
- **构建工具**：Vite
- **路由**：Vue Router 4
- **HTTP 客户端**：Axios 处理常规请求，原生 fetch 处理流式请求
- **样式方案**：作用域 CSS + CSS 变量主题系统

### API 集成

- 基础 URL：`/api`（开发时代理到 `http://localhost:3300`）
- 两个主要端点：
  - `POST /api/travel/recommend` - 返回完整的旅行行程
  - `POST /api/travel/chat` - 服务器发送事件（SSE）流式端点

### 核心组件

**App.vue**

- 包含主布局，顶部内容和底部标签导航
- 管理两个主要视图之间的路由

**RecommendView.vue**

- 表单处理，支持实时验证
- 展示详细的上午/下午/晚间活动行程
- 显示预算明细和旅行贴士

**ChatView.vue**

- 处理流式聊天响应，带打字指示器
- 消息格式化和滚动管理
- 清空聊天功能

### CSS 变量与主题

所有颜色和间距使用在 `assets/main.css` 中定义的 CSS 变量：

- `--primary` / `--primary-light` / `--primary-dark` 用于品牌色
- `--bg` / `--card-bg` 用于背景
- `--text` / `--text-secondary` 用于文本
- `--border` / `--shadow` 用于 UI 元素

## 注意事项
