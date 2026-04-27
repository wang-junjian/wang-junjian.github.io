#!/usr/bin/env node
import 'dotenv/config';
import { loadConfig, showHelp, parseArgs } from './cli/config.js';
import { loadEmbeddings, searchSimilar, createEmbedding, generateAnswer } from './cli/embeddings.js';
import {
  formatSearchResultsText,
  formatSearchResultsJson,
  formatSearchResultsPretty,
  formatAnswer,
  print,
  printError,
  printInfo
} from './cli/output.js';

async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  const config = loadConfig();

  if (!config.query) {
    printError('请提供查询文本', config.noColor);
    showHelp();
    process.exit(1);
  }

  try {
    printInfo(`加载 embeddings 数据...`, config.noColor);
    const embeddingsData = await loadEmbeddings(config.embeddingsPath);
    printInfo(`  已加载 ${embeddingsData.chunks.length} 个块, ${embeddingsData.posts.length} 篇文章\n`, config.noColor);

    printInfo(`生成查询 embedding...`, config.noColor);
    const queryEmbedding = await createEmbedding(
      config.query,
      config.embeddingBaseUrl,
      config.embeddingModel
    );
    printInfo(`  完成 (${queryEmbedding.length} 维向量)\n`, config.noColor);

    printInfo(`搜索相关内容...`, config.noColor);
    const results = await searchSimilar(embeddingsData, queryEmbedding, {
      topK: config.topK,
      minSimilarity: config.minSimilarity,
      deduplicateBySlug: true,
      summaryBoost: 1.5,
    });
    printInfo(`  找到 ${results.length} 个结果\n`, config.noColor);

    if (config.mode === 'qa') {
      printInfo(`\n生成回答...\n`, config.noColor);
      const answer = await generateAnswer(config.query, results, {
        baseUrl: config.chatBaseUrl,
        apiKey: config.chatApiKey,
        chatModel: config.chatModel,
      });
      print(formatAnswer(answer, config.noColor));
    } else {
      print('');
      switch (config.outputFormat) {
        case 'json':
          print(formatSearchResultsJson(results));
          break;
        case 'pretty':
          print(formatSearchResultsPretty(results, config.noColor));
          break;
        default:
          print(formatSearchResultsText(results, config.noColor));
      }
    }
  } catch (error) {
    printError(error instanceof Error ? error.message : String(error), config.noColor);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
