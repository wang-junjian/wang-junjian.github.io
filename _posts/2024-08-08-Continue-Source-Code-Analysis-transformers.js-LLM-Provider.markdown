---
layout: post
title:  "Continue 源码分析 - transformers.js 大模型提供者"
date:   2024-08-08 08:00:00 +0800
categories: Continue AICodingAssistant
tags: [transformers.js, Continue, GitHubCopilot]
---

## Continue
- [Continue 开发与配置]({% post_url 2024-06-03-Continue %})
- [Continue 源码分析]({% post_url 2024-07-15-Continue-Source-Code-Analysis %})


## transformers.js 支持的模型

| 模型 | 语言 | 类型 | URL |
| --- | --- | --- | --- |
| jina-embeddings-v2-base-zh | 中文 | Embedding | https://huggingface.co/Xenova/jina-embeddings-v2-base-zh |
| bge-small-zh-v1.5 | 中文 | Embedding | https://huggingface.co/Xenova/bge-small-zh-v1.5 |
| bge-base-zh-v1.5 | 中文 | Embedding | https://huggingface.co/Xenova/bge-base-zh-v1.5 |
| bge-large-zh-v1.5 | 中文 | Embedding | https://huggingface.co/Xenova/bge-large-zh-v1.5 |
| all-MiniLM-L6-v2 | 英文 | Embedding | https://huggingface.co/Xenova/all-MiniLM-L6-v2 |
| bge-base-en-v1.5 | 英文 | Embedding | https://huggingface.co/Xenova/bge-base-en-v1.5 |
| bge-reranker-base | 英文 | Reranker | https://huggingface.co/Xenova/bge-reranker-base |
| TinyLlama-1.1B-Chat-v1.0 | 英文 | LLM | https://huggingface.co/Xenova/TinyLlama-1.1B-Chat-v1.0 |
| phi-1_5_dev | 英文 | LLM | https://huggingface.co/Xenova/phi-1_5_dev |
| Qwen1.5-0.5B | 中文 | LLM | https://huggingface.co/Xenova/Qwen1.5-0.5B |
| Qwen1.5-1.8B | 中文 | LLM | https://huggingface.co/Xenova/Qwen1.5-1.8B |
| Qwen1.5-0.5B-Chat | 中文 | LLM | https://huggingface.co/Xenova/Qwen1.5-0.5B-Chat |
| codegen-350M-mono | 英文 | LLM | https://huggingface.co/Xenova/codegen-350M-mono |
| codegen-350M-multi | 多语言 | Code LLM | https://huggingface.co/Xenova/codegen-350M-multi |
| deepseek-coder-1.3b-base | 中文 | Code LLM | https://huggingface.co/Xenova/deepseek-coder-1.3b-base |
| deepseek-coder-1.3b-instruct | 中文 | Code LLM | https://huggingface.co/Xenova/deepseek-coder-1.3b-instruct |


## Reindex the workspaces

索引整个工作区，源代码：`extensions/vscode/src/extension/VsCodeExtension.ts`

```typescript
export class VsCodeExtension {
  constructor(context: vscode.ExtensionContext) {
    // ...

    // 这段代码实现了一个监听文件保存事件的功能。当文件保存时，它会执行一系列操作。
    vscode.workspace.onDidSaveTextDocument(async (event) => {
      // Listen for file changes in the workspace
      const filepath = event.uri.fsPath;

      // ...

      // Reindex the workspaces
      this.core.invoke("index/forceReIndex", undefined);
    });

    // Refresh index when branch is changed
    // 这段代码是一个用于刷新索引的功能。它的作用是在分支更改时刷新索引。
    // 代码中的主要逻辑是通过调用 `this.ide.getWorkspaceDirs()` 获取工作区目录列表，然后对每个目录进行遍历。在遍历的过程中，通过调用 `this.ide.getRepo(vscode.Uri.file(dir))` 获取每个目录对应的代码仓库。
    // 如果获取到了代码仓库，就会注册一个回调函数，该回调函数会在代码仓库的状态发生变化时被触发。在回调函数中，会获取当前分支的名称，并与之前保存的分支名称进行比较。如果当前分支与之前保存的分支不一致，就会触发索引的强制刷新操作。
    // 值得注意的是，回调函数中的参数 `dir` 表示当前遍历的目录，而 `this.PREVIOUS_BRANCH_FOR_WORKSPACE_DIR` 是一个对象，用于保存每个目录对应的上一次的分支名称。
    // 总结一下，这段代码的作用是在分支更改时刷新索引，它通过监听代码仓库的状态变化来实现这一功能。
    this.ide.getWorkspaceDirs().then((dirs) =>
      dirs.forEach(async (dir) => {
        const repo = await this.ide.getRepo(vscode.Uri.file(dir));
        if (repo) {
          repo.state.onDidChange(() => {
            // args passed to this callback are always undefined, so keep track of previous branch
            const currentBranch = repo?.state?.HEAD?.name;
            if (currentBranch) {
              if (this.PREVIOUS_BRANCH_FOR_WORKSPACE_DIR[dir]) {
                if (
                  currentBranch !== this.PREVIOUS_BRANCH_FOR_WORKSPACE_DIR[dir]
                ) {
                  // Trigger refresh of index only in this directory
                  this.core.invoke("index/forceReIndex", dir);
                }
              }

              this.PREVIOUS_BRANCH_FOR_WORKSPACE_DIR[dir] = currentBranch;
            }
          });
        }
      }),
    );
  }
}
```

监听 `index/forceReIndex`，源代码：`core/core.ts`

```typescript
export class Core {
  // TODO: It shouldn't actually need an IDE type, because this can happen
  // through the messenger (it does in the case of any non-VS Code IDEs already)
  // TODO：实际上它不应该需要一个 IDE 类型，因为这可以通过 messenger 来实现（在任何非 VS Code IDE 中已经实现了）。
  constructor(
    private readonly messenger: IMessenger<ToCoreProtocol, FromCoreProtocol>,
    private readonly ide: IDE,
    private readonly onWrite: (text: string) => Promise<void> = async () => {},
  ) {
    // ...

    // 监听 "index/forceReIndex" 事件。当该事件被触发时，代码从 IDE 中获取工作区目录，然后调用 refreshCodebaseIndex 方法来刷新这些目录的代码库索引。
    on("index/forceReIndex", async (msg) => {
      const dirs = msg.data ? [msg.data] : await this.ide.getWorkspaceDirs();
      await this.refreshCodebaseIndex(dirs);
    });

    // ...
  }
}
```

调用 `refreshCodebaseIndex` 方法，源代码：`core/core.ts`

```typescript
  private indexingCancellationController: AbortController | undefined;

  private async refreshCodebaseIndex(dirs: string[]) {
    if (this.indexingCancellationController) {
      this.indexingCancellationController.abort();
    }
    this.indexingCancellationController = new AbortController();
    // 刷新代码库索引
    for await (const update of (await this.codebaseIndexerPromise).refresh(
      dirs,
      this.indexingCancellationController.signal,
    )) {
      this.messenger.request("indexProgress", update);
      this.indexingState = update;
    }

    this.messenger.send("refreshSubmenuItems", undefined);
  }
```

调用 `refresh` 方法，源代码：`core/indexing/CodebaseIndexer.ts`

```typescript
export class CodebaseIndexer {
  async *refresh(
    workspaceDirs: string[],
    abortSignal: AbortSignal,
  ): AsyncGenerator<IndexingProgressUpdate> {
    let progress = 0;

    if (workspaceDirs.length === 0) {
      yield {
        progress,
        desc: "Nothing to index",
        status: "disabled",
      };
      return;
    }

    const config = await this.configHandler.loadConfig();
    if (config.disableIndexing) {
      yield {
        progress,
        desc: "Indexing is disabled in config.json",
        status: "disabled",
      };
      return;
    } else {
      yield {
        progress,
        desc: "Starting indexing",
        status: "loading",
      };
    }

    const indexesToBuild = await this.getIndexesToBuild();
    let completedDirs = 0;
    const totalRelativeExpectedTime = indexesToBuild.reduce(
      (sum, index) => sum + index.relativeExpectedTime,
      0,
    );

    // Wait until Git Extension has loaded to report progress
    // so we don't appear stuck at 0% while waiting
    await this.ide.getRepoName(workspaceDirs[0]);

    yield {
      progress,
      desc: "Starting indexing...",
      status: "loading",
    };

    for (const directory of workspaceDirs) {
      const files = await walkDir(directory, this.ide);
      const stats = await this.ide.getLastModified(files);
      const branch = await this.ide.getBranch(directory);
      const repoName = await this.ide.getRepoName(directory);
      let completedRelativeExpectedTime = 0;

      for (const codebaseIndex of indexesToBuild) {
        // TODO: IndexTag type should use repoName rather than directory
        const tag: IndexTag = {
          directory,
          branch,
          artifactId: codebaseIndex.artifactId,
        };
        const [results, lastUpdated, markComplete] = await getComputeDeleteAddRemove(
          tag,
          { ...stats },
          (filepath) => this.ide.readFile(filepath),
          repoName,
        );

        try {
          for await (let {
            progress: indexProgress,
            desc,
          } of codebaseIndex.update(tag, results, markComplete, repoName)) {
            // Handle pausing in this loop because it's the only one really taking time
            if (abortSignal.aborted) {
              yield {
                progress: 1,
                desc: "Indexing cancelled",
                status: "disabled",
              };
              return;
            }

            if (this.pauseToken.paused) {
              yield {
                progress,
                desc: "Paused",
                status: "paused",
              };
              while (this.pauseToken.paused) {
                await new Promise((resolve) => setTimeout(resolve, 100));
              }
            }

            progress =
              (completedDirs +
                (completedRelativeExpectedTime +
                  Math.min(1.0, indexProgress) *
                    codebaseIndex.relativeExpectedTime) /
                  totalRelativeExpectedTime) /
              workspaceDirs.length;
            yield {
              progress,
              desc,
              status: "indexing",
            };
          }

          lastUpdated.forEach((lastUpdated, path) => {
            markComplete([lastUpdated], IndexResultType.UpdateLastUpdated);
          });

          completedRelativeExpectedTime += codebaseIndex.relativeExpectedTime;
          yield {
            progress:
              (completedDirs +
                completedRelativeExpectedTime / totalRelativeExpectedTime) /
              workspaceDirs.length,
            desc: "Completed indexing " + codebaseIndex.artifactId,
            status: "indexing",
          };
        } catch (e: any) {
          let errMsg = `${e}`;

          const errorRegex =
            /Invalid argument error: Values length (\d+) is less than the length \((\d+)\) multiplied by the value size \(\d+\)/;
          const match = e.message.match(errorRegex);

          if (match) {
            const [_, valuesLength, expectedLength] = match;
            errMsg = `Generated embedding had length ${valuesLength} but was expected to be ${expectedLength}. This may be solved by deleting ~/.continue/index and refreshing the window to re-index.`;
          }

          yield {
            progress: 0,
            desc: errMsg,
            status: "failed",
          };

          console.warn(
            `Error updating the ${codebaseIndex.artifactId} index: ${e}`,
          );
          return;
        }
      }

      completedDirs++;
      progress = completedDirs / workspaceDirs.length;
      yield {
        progress,
        desc: "Indexing Complete",
        status: "done",
      };
    }
  }
}
```

调用 `update` 方法，源代码：`core/indexing/LanceDbIndex.ts`

```typescript
export class LanceDbIndex implements CodebaseIndex {
  async *update(
    tag: IndexTag,
    results: RefreshIndexResults,
    markComplete: (
      items: PathAndCacheKey[],
      resultType: IndexResultType,
    ) => void,
    repoName: string | undefined,
  ): AsyncGenerator<IndexingProgressUpdate> {
    const lancedb = await import("vectordb");
    const tableName = this.tableNameForTag(tag);
    const db = await lancedb.connect(getLanceDbPath());

    const sqlite = await SqliteDb.get();
    await this.createSqliteCacheTable(sqlite);

    // ...

    const progressReservedForTagging = 0.1;
    let accumulatedProgress = 0;

    let computedRows: LanceDbRow[] = [];
    for await (const update of this.computeChunks(results.compute)) {
      if (Array.isArray(update)) {
        const [progress, row, data, desc] = update;
        computedRows.push(row);

        // Add the computed row to the cache
        await sqlite.run(
          "INSERT INTO lance_db_cache (uuid, cacheKey, path, artifact_id, vector, startLine, endLine, contents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          row.uuid,
          row.cachekey,
          row.path,
          this.artifactId,
          JSON.stringify(row.vector),
          data.startLine,
          data.endLine,
          data.contents,
        );

        accumulatedProgress = progress * (1 - progressReservedForTagging);
        yield {
          progress: accumulatedProgress,
          desc,
          status: "indexing",
        };
      } else {
        await addComputedLanceDbRows(update, computedRows);
        computedRows = [];
      }
    }

    // ...
  }
}
```

调用 `computeChunks` 方法，源代码：`core/indexing/LanceDbIndex.ts`

```typescript
export class LanceDbIndex implements CodebaseIndex {
  private async *computeChunks(
    items: PathAndCacheKey[],
  ): AsyncGenerator<
    | [
        number,
        LanceDbRow,
        { startLine: number; endLine: number; contents: string },
        string,
      ]
    | PathAndCacheKey
  > {
    const contents = await Promise.all(
      items.map(({ path }) => this.readFile(path)),
    );

    for (let i = 0; i < items.length; i++) {
      // Break into chunks
      const content = contents[i];
      const chunks: Chunk[] = [];

      let hasEmptyChunks = false;

      for await (const chunk of chunkDocument({
        filepath: items[i].path,
        contents: content,
        maxChunkSize: this.embeddingsProvider.maxChunkSize,
        digest: items[i].cacheKey,
      })) {
        if (chunk.content.length == 0) {
          hasEmptyChunks = true;
          break;
        }
        chunks.push(chunk);
      }

      if (hasEmptyChunks) {
        // File did not chunk properly, let's skip it.
        continue;
      }

      if (chunks.length > 20) {
        // Too many chunks to index, probably a larger file than we want to include
        continue;
      }

      let embeddings: number[][];
      try {
        // Calculate embeddings
        embeddings = await this.embeddingsProvider.embed(
          chunks.map((c) => c.content),
        );
      } catch (e) {
        // Rather than fail the entire indexing process, we'll just skip this file
        // so that it may be picked up on the next indexing attempt
        console.warn(
          `Failed to generate embedding for ${chunks[0]?.filepath} with provider: ${this.embeddingsProvider.id}: ${e}`,
        );
        continue;
      }

      if (embeddings.some((emb) => emb === undefined)) {
        throw new Error(
          `Failed to generate embedding for ${chunks[0]?.filepath} with provider: ${this.embeddingsProvider.id}`,
        );
      }

      // Create row format
      for (let j = 0; j < chunks.length; j++) {
        const progress = (i + j / chunks.length) / items.length;
        const row = {
          vector: embeddings[j],
          path: items[i].path,
          cachekey: items[i].cacheKey,
          uuid: uuidv4(),
        };
        const chunk = chunks[j];
        yield [
          progress,
          row,
          {
            contents: chunk.content,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
          },
          `Indexing ${getBasename(chunks[j].filepath)}`,
        ];
      }

      yield items[i];
    }
  }
}
```

调用 `embed` 方法，源代码：`core/indexing/embeddings/TransformersJsEmbeddingsProvider.ts`
  - 调用 `EmbeddingsPipeline.getInstance` 方法，获取 EmbeddingsPipeline 实例

```typescript
class EmbeddingsPipeline {
  static task: PipelineType = "feature-extraction";
  static model = "all-MiniLM-L6-v2";
  static instance: any | null = null;

  static async getInstance() {
    if (EmbeddingsPipeline.instance === null) {
      // @ts-ignore
      // prettier-ignore
      const { env, pipeline } = await import("../../vendor/modules/@xenova/transformers/src/transformers.js");

      env.allowLocalModels = true;
      env.allowRemoteModels = false;
      env.localModelPath = path.join(
        typeof __dirname === "undefined"
          ? // @ts-ignore
            path.dirname(new URL(import.meta.url).pathname)
          : __dirname,
        "..",
        "models",
      );

      EmbeddingsPipeline.instance = await pipeline(
        EmbeddingsPipeline.task,
        EmbeddingsPipeline.model,
      );
    }

    return EmbeddingsPipeline.instance;
  }
}

export class TransformersJsEmbeddingsProvider extends BaseEmbeddingsProvider {
  static providerName: EmbeddingsProviderName = "transformers.js";
  static maxGroupSize: number = 4;
  static model: string = "all-MiniLM-L6-v2";

  constructor() {
    super({ model: TransformersJsEmbeddingsProvider.model }, () =>
      Promise.resolve(null),
    );
  }

  async embed(chunks: string[]) {
    const extractor = await EmbeddingsPipeline.getInstance();

    if (!extractor) {
      throw new Error("TransformerJS embeddings pipeline is not initialized");
    }

    if (chunks.length === 0) {
      return [];
    }

    const outputs = [];
    for (
      let i = 0;
      i < chunks.length;
      i += TransformersJsEmbeddingsProvider.maxGroupSize
    ) {
      const chunkGroup = chunks.slice(
        i,
        i + TransformersJsEmbeddingsProvider.maxGroupSize,
      );
      const output = await extractor(chunkGroup, {
        pooling: "mean",
        normalize: true,
      });
      outputs.push(...output.tolist());
    }
    return outputs;
  }
}
```

下载 https://huggingface.co/Xenova/bge-small-zh-v1.5 模型到 `extensions/vscode/models/bge-small-zh-v1.5` 目录。

在配置文件 `~/.continue/config.json` 中配置 `transformers.js` 模型，并不能生效，目前没有指定模型的功能。

```json
{
  "embeddingsProvider": {
    "provider": "transformers.js",
    "model": "bge-small-zh-v1.5"  // 无效
  },
}
```

可以通过文件 `core/indexing/embeddings/TransformersJsEmbeddingsProvider.ts` 修改来指定模型。

```typescript
  static model: string = "bge-small-zh-v1.5";
```
**两处都要修改**
