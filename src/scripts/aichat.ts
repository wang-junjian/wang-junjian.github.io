import { loadEmbeddings, searchSimilar } from '../utils/ai';
import type { Message } from '../utils/ai';
import { info, debug, error, setMinLevel, downloadLogs } from '../utils/logger';
import type { LogLevel } from '../utils/logger';
import { createEmbedding, streamAnswer, DEFAULT_API_CONFIG } from './aichat-api';
import type { ApiConfig, CurrentDoc } from './aichat-api';
import { marked } from 'marked';
import hljs from 'highlight.js';

// Initialize Mermaid (loaded via CDN)
let mermaidInitialized = false;

const LOG_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === 'string' && LOG_LEVELS.includes(value as LogLevel);
}

function initMermaid() {
  if (mermaidInitialized) return;
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
    mermaidInitialized = true;
  }
}

/**
 * 增强渲染：处理 mermaid、代码高亮、复制按钮
 * 完全参考 post-scripts.ts 的实现
 */
function enhanceMessageContent(container: HTMLElement) {
  // Initialize mermaid if needed
  initMermaid();

  // Process Mermaid diagrams
  const codeElements = container.querySelectorAll<HTMLDivElement>('pre code');
  let mermaidCount = 0;

  codeElements.forEach((code) => {
    const isMermaid = code.className?.includes('language-mermaid');

    if (isMermaid && typeof mermaid !== 'undefined') {
      const pre = code.parentElement!;
      const mermaidContent = code.textContent || '';

      const diagramDiv = document.createElement('div');
      diagramDiv.className = 'mermaid';
      diagramDiv.style.margin = '2rem 0';
      diagramDiv.style.padding = '1.5rem';
      diagramDiv.style.background = 'var(--white)';
      diagramDiv.style.border = '1px solid var(--border)';
      diagramDiv.style.borderRadius = '0.5rem';
      diagramDiv.textContent = mermaidContent;

      pre.parentNode!.insertBefore(diagramDiv, pre);
      pre.style.display = 'none';
      mermaidCount++;
    }
  });

  // Render all mermaid diagrams
  if (mermaidCount > 0 && typeof mermaid !== 'undefined') {
    mermaid.init(undefined, '.mermaid');
  }

  // Apply syntax highlighting to remaining code blocks
  const remainingCodeElements = container.querySelectorAll<HTMLDivElement>('pre:not([style*="display: none"]) code');
  remainingCodeElements.forEach((code) => {
    let lang = 'plaintext';
    const match = code.className?.match(/language-(\w+)/);
    if (match) lang = match[1];

    code.classList.add('hljs', lang);
    try {
      hljs.highlightElement(code as HTMLElement);
    } catch {
      // skip failed highlights
    }
  });

  // Add copy buttons to code blocks
  const codeBlocks = container.querySelectorAll<HTMLPreElement>('pre');
  codeBlocks.forEach((pre) => {
    // Skip if already has copy button
    if (pre.querySelector('.copy-btn')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '复制';
    copyBtn.style.zIndex = '10';

    pre.style.position = 'relative';
    pre.insertBefore(copyBtn, pre.firstChild);

    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      let text = '';

      if (code) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = code.innerHTML;
        text = tempDiv.textContent || '';
      } else {
        text = pre.textContent || '';
      }

      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = '已复制!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = '复制';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        copyBtn.textContent = '复制失败';
        setTimeout(() => {
          copyBtn.textContent = '复制';
        }, 2000);
      }
    });
  });
}

const STORAGE_KEY_CONFIG = 'ai_chat_config';
const STORAGE_KEY_MESSAGES = 'ai_chat_messages';
const STORAGE_KEY_WINDOW_OPEN = 'ai_chat_window_open';
const STORAGE_KEY_LOG_LEVEL = 'ai_chat_log_level';
const STORAGE_KEY_MODE = 'ai_chat_mode';

let apiConfig: ApiConfig = { ...DEFAULT_API_CONFIG };
let messages: Message[] = [];
let embeddingsLoaded = false;
let isWindowOpen = false;
let isGenerating = false;
let mode: 'float' | 'embedded' = 'float';

const toggleBtn = document.getElementById('aiChatToggle') as HTMLButtonElement;
const chatWindow = document.getElementById('aiChatWindow') as HTMLDivElement;
const closeBtn = document.getElementById('aiChatClose') as HTMLButtonElement;
const configBtn = document.getElementById('aiChatConfig') as HTMLButtonElement;
const clearBtn = document.getElementById('aiChatClear') as HTMLButtonElement;
const modeToggleBtn = document.getElementById('aiChatModeToggle') as HTMLButtonElement;
const fullscreenToggleBtn = document.getElementById('aiChatFullscreenToggle') as HTMLButtonElement;
const configPanel = document.getElementById('aiChatConfigPanel') as HTMLDivElement;
const statusEl = document.getElementById('aiChatStatus') as HTMLDivElement;
const messagesEl = document.getElementById('aiChatMessages') as HTMLDivElement;
const inputEl = document.getElementById('aiChatInput') as HTMLTextAreaElement;
const sendBtn = document.getElementById('aiChatSend') as HTMLButtonElement;
const quickQuestionsEl = document.getElementById('quickQuestions') as HTMLDivElement;
const ollamaBaseUrlInput = document.getElementById('ollamaBaseUrlInput') as HTMLInputElement;
const ollamaEmbeddingModelInput = document.getElementById('ollamaEmbeddingModelInput') as HTMLInputElement;
const apiBaseUrlInput = document.getElementById('apiBaseUrlInput') as HTMLInputElement;
const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
const chatModelInput = document.getElementById('chatModelInput') as HTMLInputElement;
const saveConfigBtn = document.getElementById('saveApiConfig') as HTMLButtonElement;
const logLevelInput = document.getElementById('logLevelInput') as HTMLSelectElement;
const exportLogsBtn = document.getElementById('exportLogsBtn') as HTMLButtonElement;

function updateStatus(text: string, type = 'warning') {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = 'ai-chat-status ' + type;
}

function setGenerating(state: boolean) {
  isGenerating = state;
  if (sendBtn) {
    sendBtn.disabled = state;
    sendBtn.textContent = state ? '生成中...' : '发送';
  }
  if (inputEl) inputEl.disabled = state;
}

function saveConfig() {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(apiConfig));
  localStorage.setItem(STORAGE_KEY_LOG_LEVEL, logLevelInput?.value || 'info');
}

function loadConfig() {
  const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (saved) {
    apiConfig = { ...apiConfig, ...JSON.parse(saved) };
  }
  if (ollamaBaseUrlInput) ollamaBaseUrlInput.value = apiConfig.ollamaBaseUrl;
  if (ollamaEmbeddingModelInput) ollamaEmbeddingModelInput.value = apiConfig.ollamaEmbeddingModel;
  if (apiBaseUrlInput) apiBaseUrlInput.value = apiConfig.baseUrl;
  if (apiKeyInput) apiKeyInput.value = apiConfig.apiKey;
  if (chatModelInput) chatModelInput.value = apiConfig.chatModel;

  const savedLogLevel = localStorage.getItem(STORAGE_KEY_LOG_LEVEL);
  if (savedLogLevel && isLogLevel(savedLogLevel)) {
    setMinLevel(savedLogLevel);
    if (logLevelInput) logLevelInput.value = savedLogLevel;
  }
}

function saveMessages() {
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
}

function loadMessages() {
  const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (saved) {
    messages = JSON.parse(saved);
  }
  renderMessages();
}

function renderMessage(msg: { role: string; content: string }) {
  const avatar = msg.role === 'user' ? '👤' : '🤖';
  const content = marked.parse(msg.content) as string;

  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-chat-message ${msg.role}`;
  msgDiv.innerHTML = `
    <div class="ai-chat-message-avatar">${avatar}</div>
    <div class="ai-chat-message-content">${content}</div>
  `;

  const contentDiv = msgDiv.querySelector('.ai-chat-message-content') as HTMLElement;
  enhanceMessageContent(contentDiv);

  return msgDiv;
}

function renderEmptyGuide() {
  const needConfig = embeddingsLoaded && !apiConfig.apiKey;

  return `
    <div style="padding: 20px 16px; color: var(--text-secondary, #666666);">
      <div style="text-align: center; margin-bottom: 16px;">
        <span style="font-size: 36px; display: block; margin-bottom: 8px;">👋</span>
        <p style="margin: 0; font-size: 13px; font-weight: 500; color: var(--text-primary, #1a1a1a);">你好！我是智能问答助手</p>
      </div>

      <div style="background: #f8fafc; border-radius: 10px; padding: 12px; margin-bottom: 10px; border: 1px solid var(--border, #e0ddd8);">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: var(--text-primary, #1a1a1a);">🛠 模型配置</p>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 2px 6px; font-size: 11px; line-height: 1.5;">
          <span style="font-weight: bold;">Ollama URL</span><span>${apiConfig.ollamaBaseUrl || DEFAULT_API_CONFIG.ollamaBaseUrl}</span>
          <span style="font-weight: bold;">嵌入模型</span><span>${apiConfig.ollamaEmbeddingModel || DEFAULT_API_CONFIG.ollamaEmbeddingModel}</span>
          <span style="font-weight: bold;">LLM Base URL</span><span>${apiConfig.baseUrl || DEFAULT_API_CONFIG.baseUrl}</span>
          <span style="font-weight: bold;">Chat Model</span><span>${apiConfig.chatModel || DEFAULT_API_CONFIG.chatModel}</span>
        </div>
        ${needConfig ? `<p style="margin: 6px 0 0 0; font-size: 11px; color: #92400e;">⚠️ 请先点击右上角 ⚙️ 配置 API Key</p>` : ''}
      </div>

      <div style="background: #f8fafc; border-radius: 10px; padding: 12px; margin-bottom: 10px; border: 1px solid var(--border, #e0ddd8);">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: var(--text-primary, #1a1a1a);">📚 博客向量化</p>
        <p style="margin: 0; font-size: 11px;">运行 <code style="background: #e2e8f0; padding: 1px 4px; border-radius: 3px;">npm run embed</code> 生成向量索引（<code style="background: #e2e8f0; padding: 1px 4px; border-radius: 3px;">public/embeddings.json</code>），即可基于博客内容进行 RAG 问答。</p>
      </div>

      <div style="background: #f8fafc; border-radius: 10px; padding: 12px; border: 1px solid var(--border, #e0ddd8);">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: var(--text-primary, #1a1a1a);">⌨️ 快捷操作</p>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; font-size: 11px; line-height: 1.5;">
          <span style="color: var(--text-primary, #1a1a1a); font-weight: 500;">Command + I</span>
          <span>打开 / 关闭对话窗口</span>
          <span style="color: var(--text-primary, #1a1a1a); font-weight: 500;">Control + Command + I</span>
          <span>切换嵌入 / 悬浮模式</span>
          <span style="color: var(--text-primary, #1a1a1a); font-weight: 500;">Command + Delete</span>
          <span>清除历史消息</span>
        </div>
      </div>
    </div>
  `;
}

function renderMessages() {
  if (!messagesEl) return;
  messagesEl.innerHTML = '';

  if (messages.length === 0) {
    messagesEl.innerHTML = renderEmptyGuide();
    if (quickQuestionsEl) quickQuestionsEl.style.display = 'flex';
    return;
  }

  if (quickQuestionsEl) quickQuestionsEl.style.display = 'none';

  messages.forEach((msg) => {
    const msgEl = renderMessage(msg);
    messagesEl.appendChild(msgEl);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function updateLoadingText(text: string) {
  const loading = document.getElementById('aiChatLoading');
  if (!loading) return;
  const statusSpan = loading.querySelector('.ai-chat-loading-status');
  if (statusSpan) statusSpan.textContent = text;
}

function addLoadingMessage(text = '思考中...') {
  if (!messagesEl) return;
  const div = document.createElement('div');
  div.id = 'aiChatLoading';
  div.className = 'ai-chat-message assistant';
  div.innerHTML = `
    <div class="ai-chat-message-avatar">🤖</div>
    <div class="ai-chat-message-content">
      <span class="ai-chat-loading-status" style="color: var(--text-secondary, #666666);">${text}</span>
      <div class="ai-chat-loading">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeLoadingMessage() {
  const loading = document.getElementById('aiChatLoading');
  if (loading) loading.remove();
}

function checkReadyState() {
  if (embeddingsLoaded && apiConfig.apiKey) {
    if (!isGenerating) {
      if (inputEl) inputEl.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
    }
    if (configPanel) configPanel.classList.remove('open');
    updateStatus('✅ 就绪 - AI 问答', 'success');
  } else if (embeddingsLoaded) {
    if (configPanel) configPanel.classList.add('open');
    updateStatus('⚙️ 请配置 API Key', 'warning');
  }
}

async function initEmbeddings() {
  try {
    updateStatus('📚 加载向量索引...', 'info');
    await loadEmbeddings();
    embeddingsLoaded = true;
    checkReadyState();
  } catch (err: any) {
    updateStatus(`❌ 加载失败: ${err.message}`, 'error');
    console.error('Failed to load embeddings:', err);
  }
}

async function ensureEmbeddingsLoaded() {
  if (embeddingsLoaded) return;
  await initEmbeddings();
}

function getCurrentDoc(): CurrentDoc | null {
  if (!location.pathname.startsWith('/posts/')) return null;
  const proseEl = document.querySelector('.prose');
  const titleEl = document.querySelector('article h1');
  if (!proseEl) return null;
  return {
    title: titleEl ? titleEl.textContent!.trim() : document.title,
    content: proseEl.textContent!.trim().slice(0, 8000),
  };
}

/**
 * 创建流式消息占位元素
 *
 * 流式阶段实时 markdown 渲染，用 requestAnimationFrame 节流保证流畅
 */
function createStreamingMessage() {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'ai-chat-message assistant';

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'ai-chat-message-avatar';
  avatarDiv.textContent = '🤖';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'ai-chat-message-content';

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(contentDiv);
  messagesEl.appendChild(msgDiv);

  let rawText = '';
  let dirty = false;
  let renderTimer: number | null = null;

  const render = () => {
    try {
      contentDiv.innerHTML = marked.parse(rawText) as string;
      enhanceMessageContent(contentDiv);
    } catch {
      // marked 对不完整 markdown 可能报错，降级为纯文本
      contentDiv.textContent = rawText;
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const scheduleRender = () => {
    if (!renderTimer) {
      renderTimer = requestAnimationFrame(() => {
        renderTimer = null;
        if (dirty) {
          dirty = false;
          render();
        }
      });
    } else {
      dirty = true;
    }
  };

  const update = (text: string) => {
    rawText = text;
    dirty = true;
    scheduleRender();
  };

  const finalize = () => {
    if (renderTimer) {
      cancelAnimationFrame(renderTimer);
      renderTimer = null;
    }
    dirty = false;
    render();
  };

  const getRawText = () => rawText;

  return { update, finalize, getRawText, contentDiv };
}

async function sendMessage(text: string) {
  if (!text || !apiConfig.apiKey || isGenerating) return;

  await ensureEmbeddingsLoaded();

  setGenerating(true);
  messages.push({ role: 'user', content: text });
  saveMessages();
  renderMessages();
  inputEl.value = '';
  inputEl.style.height = 'auto';

  const msgStart = performance.now();
  info('chat', '开始处理用户提问', { query: text, model: apiConfig.chatModel });

  try {
    // 阶段1：向量化
    addLoadingMessage('正在调用向量化...');
    const embedStart = performance.now();
    const queryEmbedding = await createEmbedding(text, apiConfig);
    debug('chat', '向量化完成', { durationMs: Math.round(performance.now() - embedStart) });

    // 阶段2：搜索
    updateLoadingText('正在本地搜索相关文章...');
    const similarChunks = await searchSimilar(queryEmbedding, {
      topK: 10,
      minSimilarity: 0.6,
      deduplicateBySlug: true,
      summaryBoost: 1.05,
      onDebug: (l, m, d) => debug(l, m, d),
      onInfo: (l, m, d) => info(l, m, d),
    });

    // 阶段3：流式生成 — 立即创建消息框，让第一个 token 零延迟显示
    removeLoadingMessage();
    const stream = createStreamingMessage();

    const currentDoc = getCurrentDoc();
    const history = messages.slice(0, -1);
    let streamingText = '';

    await streamAnswer(
      text, similarChunks, currentDoc, apiConfig, history,
      {
        onToken: (token) => {
          streamingText += token;
          stream.update(streamingText);
        },
        onDone: (fullText) => {
          // 用完整文本（含参考文章）做最终渲染
          stream.update(fullText);
          stream.finalize();
          messages.push({ role: 'assistant', content: fullText });
          saveMessages();
          info('chat', '回答完成', { totalDurationMs: Math.round(performance.now() - msgStart) });
          setGenerating(false);
          checkReadyState();
          inputEl.focus();
        },
        onError: (err) => {
          // 保留流式消息 DOM 中的已有内容，不调 renderMessages
          const partialText = streamingText || stream.getRawText();
          if (partialText) {
            stream.finalize();
            messages.push({ role: 'assistant', content: partialText });
          } else {
            // 完全没有内容时，显示错误消息
            stream.update(`抱歉，发生了错误：${err.message}`);
            stream.finalize();
          }
          error('chat', '流式生成出错', { error: err.message, query: text });
          saveMessages();
          setGenerating(false);
          checkReadyState();
          inputEl.focus();
        },
      },
      (l, m, d) => debug(l, m, d),
      (l, m, d) => info(l, m, d),
    );
  } catch (err: any) {
    removeLoadingMessage();
    error('chat', '处理提问时出错', { error: err.message, query: text });
    messages.push({
      role: 'assistant',
      content: `抱歉，发生了错误：${err.message}。请检查 Ollama 是否运行以及 API 配置。`,
    });
    saveMessages();
    renderMessages();
    setGenerating(false);
    checkReadyState();
    inputEl.focus();
  }
}

function autoResize() {
  if (!inputEl) return;
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
}

const EMBED_MIN_WIDTH = 900;

function canEmbed() {
  return window.innerWidth >= EMBED_MIN_WIDTH;
}

function applyMode() {
  if (mode === 'embedded') {
    document.documentElement.classList.add('ai-chat-embedded');
    if (!chatWindow.classList.contains('open')) {
      chatWindow.classList.add('open');
      isWindowOpen = true;
    }
    ensureEmbeddingsLoaded();
  } else {
    document.documentElement.classList.remove('ai-chat-embedded');
  }
}

function toggleMode() {
  mode = mode === 'float' ? 'embedded' : 'float';
  localStorage.setItem(STORAGE_KEY_MODE, mode);
  applyMode();
}

function toggleFullscreen() {
  const isFullscreen = chatWindow.classList.contains('fullscreen');
  if (isFullscreen) {
    chatWindow.classList.remove('fullscreen');
    fullscreenToggleBtn.textContent = '⛶';
    fullscreenToggleBtn.title = '全屏';
  } else {
    chatWindow.classList.add('fullscreen');
    fullscreenToggleBtn.textContent = '⛶';
    fullscreenToggleBtn.title = '退出全屏';
  }
}

function checkResponsiveMode() {
  if (!canEmbed() && mode === 'embedded') {
    document.documentElement.classList.remove('ai-chat-embedded');
    mode = 'float';
  } else if (canEmbed() && mode === 'float') {
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    if (saved === 'embedded') {
      applyMode();
    }
  }
  if (modeToggleBtn) {
    modeToggleBtn.style.display = canEmbed() ? '' : 'none';
  }
}

function initMode() {
  if (document.documentElement.classList.contains('ai-chat-embedded') && canEmbed()) {
    mode = 'embedded';
    if (!chatWindow.classList.contains('open')) {
      chatWindow.classList.add('open');
      isWindowOpen = true;
    }
    ensureEmbeddingsLoaded();
  }
  if (modeToggleBtn) {
    modeToggleBtn.style.display = canEmbed() ? '' : 'none';
  }
}

function toggleWindow() {
  if (mode === 'embedded') {
    toggleMode();
    return;
  }
  isWindowOpen = !isWindowOpen;
  if (isWindowOpen) {
    chatWindow.classList.add('open');
    toggleBtn.textContent = '✕';
    ensureEmbeddingsLoaded();
  } else {
    chatWindow.classList.remove('open');
    toggleBtn.textContent = '🤖';
  }
  localStorage.setItem(STORAGE_KEY_WINDOW_OPEN, JSON.stringify(isWindowOpen));
}

function restoreWindowState() {
  if (mode === 'embedded') return;
  const saved = localStorage.getItem(STORAGE_KEY_WINDOW_OPEN);
  if (saved && JSON.parse(saved)) {
    toggleWindow();
  }
}

function bindEvents() {
  toggleBtn.addEventListener('click', toggleWindow);
  closeBtn.addEventListener('click', toggleWindow);

  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', toggleMode);
  }

  if (fullscreenToggleBtn) {
    fullscreenToggleBtn.addEventListener('click', toggleFullscreen);
  }

  configBtn.addEventListener('click', () => {
    configPanel.classList.toggle('open');
  });

  clearBtn.addEventListener('click', () => {
    messages = [];
    saveMessages();
    renderMessages();
    inputEl.focus();
  });

  saveConfigBtn.addEventListener('click', () => {
    apiConfig = {
      ollamaBaseUrl: ollamaBaseUrlInput.value.trim() || DEFAULT_API_CONFIG.ollamaBaseUrl,
      ollamaEmbeddingModel: ollamaEmbeddingModelInput.value.trim() || DEFAULT_API_CONFIG.ollamaEmbeddingModel,
      baseUrl: apiBaseUrlInput.value.trim() || DEFAULT_API_CONFIG.baseUrl,
      apiKey: apiKeyInput.value.trim(),
      chatModel: chatModelInput.value.trim() || DEFAULT_API_CONFIG.chatModel,
    };
    saveConfig();
    checkReadyState();
  });

  if (logLevelInput) {
    logLevelInput.addEventListener('change', () => {
      const level = logLevelInput.value;
      if (isLogLevel(level)) {
        setMinLevel(level);
        info('logger', '日志级别已切换为 ' + level);
      }
    });
  }

  if (exportLogsBtn) {
    exportLogsBtn.addEventListener('click', () => {
      downloadLogs();
      info('logger', '日志已导出');
    });
  }

  sendBtn.addEventListener('click', () => sendMessage(inputEl.value.trim()));
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value.trim());
    }
  });
  inputEl.addEventListener('input', autoResize);

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-question]');
    if (btn && !inputEl.disabled && !isGenerating) {
      sendMessage((btn as HTMLElement).dataset.question!);
    }
  });

  document.addEventListener('keydown', (e) => {
    // Command + Delete: 清除历史消息
    if (e.metaKey && e.key === 'Backspace' && !e.ctrlKey) {
      e.preventDefault();
      messages = [];
      saveMessages();
      renderMessages();
      inputEl.focus();
      return;
    }

    // Control + Command + I: 切换嵌入/悬浮模式
    if (e.ctrlKey && e.metaKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      toggleMode();
      return;
    }

    // Command + I: 悬浮模式切换窗口
    if (e.metaKey && !e.ctrlKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      toggleWindow();
    }
  });

  window.addEventListener('resize', checkResponsiveMode);
}

function init() {
  if (window.__aiChatInit) return;
  window.__aiChatInit = true;

  bindEvents();
  loadConfig();
  loadMessages();
  initMode();
  restoreWindowState();
  initMermaid();

  window.__aiChat = {
    toggleWindow,
    sendMessage: (text: string) => {
      if (!isWindowOpen) toggleWindow();
      sendMessage(text);
    },
  };
}

function handleTurboNavigation() {
  // Widget is data-turbo-permanent, just check responsive mode
  checkResponsiveMode();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle Turbo navigation - just check responsive mode
document.addEventListener('turbo:load', handleTurboNavigation);
document.addEventListener('turbo:render', handleTurboNavigation);
