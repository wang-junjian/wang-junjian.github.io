#!/usr/bin/env node
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Config {
  mode: 'search' | 'qa';
  query: string;
  topK: number;
  minSimilarity: number;
  outputFormat: 'text' | 'json' | 'pretty';
  embeddingsPath: string;
  embeddingBaseUrl: string;
  embeddingModel: string;
  chatBaseUrl: string;
  chatApiKey: string;
  chatModel: string;
  noColor: boolean;
}

const DEFAULT_CONFIG: Partial<Config> = {
  mode: 'search',
  topK: 10,
  minSimilarity: 0.4,
  outputFormat: 'text',
  embeddingModel: 'bge-m3:latest',
  noColor: false,
};

export function parseArgs(): Partial<Config> & { help?: boolean } {
  const args = process.argv.slice(2);
  const result: Partial<Config> & { help?: boolean } = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }

    if (arg === '--qa') {
      result.mode = 'qa';
      continue;
    }

    if (arg === '--no-color') {
      result.noColor = true;
      continue;
    }

    if (arg.startsWith('--') || arg.startsWith('-')) {
      const key = arg.replace(/^-+/, '');
      const value = args[i + 1];

      switch (key) {
        case 'mode':
        case 'm':
          result.mode = value as 'search' | 'qa';
          i++;
          break;
        case 'topk':
        case 'k':
          result.topK = parseInt(value, 10);
          i++;
          break;
        case 'min-similarity':
          result.minSimilarity = parseFloat(value);
          i++;
          break;
        case 'output':
        case 'o':
          result.outputFormat = value as 'text' | 'json' | 'pretty';
          i++;
          break;
        case 'embeddings-path':
          result.embeddingsPath = value;
          i++;
          break;
        case 'embedding-base-url':
          result.embeddingBaseUrl = value;
          i++;
          break;
        case 'chat-base-url':
          result.chatBaseUrl = value;
          i++;
          break;
        case 'chat-api-key':
          result.chatApiKey = value;
          i++;
          break;
        case 'chat-model':
          result.chatModel = value;
          i++;
          break;
        case 'embedding-model':
          result.embeddingModel = value;
          i++;
          break;
        default:
          console.warn(`Unknown option: ${arg}`);
      }
    } else {
      positional.push(arg);
    }
  }

  if (positional.length > 0) {
    result.query = positional.join(' ');
  }

  return result;
}

export function loadConfig(): Config {
  const args = parseArgs();

  const projectRoot = path.join(__dirname, '..', '..');
  const defaultEmbeddingsPath = path.join(projectRoot, 'public', 'embeddings.json');

  const envEmbeddingBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
  const envEmbeddingModel = process.env.OLLAMA_EMBEDDING_MODEL || 'bge-m3:latest';
  const envChatBaseUrl = process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1';
  const envChatApiKey = process.env.OPENAI_API_KEY || 'dummy';
  const envChatModel = process.env.OPENAI_CHAT_MODEL || 'llama3.1';

  const config: Config = {
    mode: args.mode || DEFAULT_CONFIG.mode || 'search',
    query: args.query || '',
    topK: args.topK || DEFAULT_CONFIG.topK || 10,
    minSimilarity: args.minSimilarity || DEFAULT_CONFIG.minSimilarity || 0.6,
    outputFormat: args.outputFormat || DEFAULT_CONFIG.outputFormat || 'text',
    embeddingsPath: args.embeddingsPath || defaultEmbeddingsPath,
    embeddingBaseUrl: args.embeddingBaseUrl || envEmbeddingBaseUrl,
    embeddingModel: args.embeddingModel || envEmbeddingModel,
    chatBaseUrl: args.chatBaseUrl || envChatBaseUrl,
    chatApiKey: args.chatApiKey || envChatApiKey,
    chatModel: args.chatModel || envChatModel,
    noColor: args.noColor || DEFAULT_CONFIG.noColor || false,
  };

  return config;
}

export function showHelp() {
  console.log(`
博客向量检索 CLI 工具

用法:
  npm run search -- "查询文本" [options]
  node --import tsx/esm scripts/search-cli.ts "查询文本" [options]

模式:
  search      仅搜索相关文章块（默认）
  qa          问答模式，使用 LLM 生成回答

选项:
  -m, --mode <mode>             模式: search|qa (默认: search)
  --qa                          启用问答模式（快捷方式）
  -k, --topk <number>           返回结果数量 (默认: 10)
  --min-similarity <number>     最小相似度阈值 (默认: 0.6)
  -o, --output <format>         输出格式: text|json|pretty (默认: text)
  --embeddings-path <path>      embeddings.json 路径
  --embedding-base-url <url>    Embedding API (Ollama) 端点
  --chat-base-url <url>         Chat API 端点
  --chat-api-key <key>          Chat API Key
  --chat-model <model>          聊天模型
  --embedding-model <model>     embedding 模型 (默认: bge-m3:latest)
  --no-color                    禁用彩色输出
  -h, --help                    显示此帮助信息

示例:
  npm run search -- "Cline"
  npm run search -- "如何配置 Docker" --qa
  npm run search -- "查询" --topk 5 --output json

环境变量:
  OLLAMA_BASE_URL             Ollama (Embedding) API 端点
  OLLAMA_EMBEDDING_MODEL      Ollama embedding 模型
  OPENAI_BASE_URL             Chat API 端点
  OPENAI_API_KEY              Chat API Key
  OPENAI_CHAT_MODEL           Chat 模型
`);
}
