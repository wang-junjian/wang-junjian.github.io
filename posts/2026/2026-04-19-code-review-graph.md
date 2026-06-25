---
type: article
title:  "代码评审知识图谱：code-review-graph"
date:   2026-04-19 10:00:00 +0800
tags: [code-review-graph, MCP, KnowledgeGraph]
---

[code‑review‑graph](https://code-review-graph.com/) 是一款为 AI 编程助手打造的本地代码知识图谱工具，核心是用增量图谱替代全量读码，大幅降低 AI 上下文 Token 消耗、提升代码审查与理解效率。

基于 Tree‑sitter 解析代码结构，构建持久化增量知识图谱，通过 MCP 协议给 AI 提供精准最小上下文，Token 用量可降 5–10 倍，零配置开箱即用。

<!-- more -->

## 安装 [code-review-graph](https://code-review-graph.com/)

```bash
pip install code-review-graph
```


## 将 MCP Server 注册到 AI 编程平台

```bash
# cd <project-root>
code-review-graph install --platform claude-code
```

```
Installing MCP server config...
  Claude Code: configured /Users/junjian/GitHub/wang-junjian/nanoagent/.mcp.json

Configured 1 platform(s): Claude Code

Graph instructions will be injected into:
  CLAUDE.md (append)
Updated .gitignore with .code-review-graph/.
Generated skills in /Users/junjian/GitHub/wang-junjian/nanoagent/.claude/skills
Inject graph instructions into the files above? [Y/n] y
Injected graph instructions into: CLAUDE.md
Installed hooks in /Users/junjian/GitHub/wang-junjian/nanoagent/.claude/settings.json
Installed git pre-commit hook in /Users/junjian/GitHub/wang-junjian/nanoagent/.git/hooks/pre-commit

Next steps:
  1. code-review-graph build    # build the knowledge graph
  2. Restart your AI coding tool to pick up the new config
```

### .mcp.json

```json
{
  "mcpServers": {
    "code-review-graph": {
      "command": "uvx",
      "args": [
        "code-review-graph",
        "serve"
      ],
      "type": "stdio"
    }
  }
}
```

### CLAUDE.md

```markdown
<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
```


## 全量构建图谱

```bash
code-review-graph build
```

```
INFO: Schema version 1 -> 9: running migrations
INFO: Running migration v2
INFO: Migration v2: added 'signature' column to nodes
INFO: Running migration v3
INFO: Migration v3: created flows and flow_memberships tables
INFO: Running migration v4
INFO: Migration v4: added 'community_id' column to nodes
INFO: Migration v4: created communities table
INFO: Running migration v5
INFO: Migration v5: created nodes_fts FTS5 virtual table
INFO: Running migration v6
INFO: Migration v6: created summary tables (community_summaries, flow_snapshots, risk_index)
INFO: Running migration v7
INFO: Migration v7: added compound edge indexes
INFO: Running migration v8
INFO: Migration v8: created composite edge index
INFO: Running migration v9
INFO: Migration v9: added edge confidence columns
INFO: Migrations complete, now at schema version 9
INFO: Progress: 35/35 files parsed
INFO: FTS index rebuilt: 280 rows indexed
INFO: Loaded 245 unique nodes, 1062 edges
INFO: igraph not available, using file-based community detection
Full build: 35 files, 286 nodes, 1076 edges (postprocess=full)
```


## Claude Code 中使用图谱工具

**提示词：**

```
如何组装提示词
```

![](/images/2026/code-review-graph/PromptAssembler.png)


## 生成交互式 HTML 图谱可视化页面

```bash
code-review-graph visualize
```

浏览器打开：/Users/junjian/GitHub/wang-junjian/nanoagent/.code-review-graph/graph.html

![](/images/2026/code-review-graph/visualize.jpeg)


## 根据社群结构生成 Markdown 格式知识库文档

```bash
code-review-graph wiki
```

浏览器打开：/Users/junjian/GitHub/wang-junjian/nanoagent/.code-review-graph/wiki

### code-review-graph wiki 的索引

| 名称 | 大小 | 修改日期 |
|---|---|---|
| bundled-register.md | 1.5 kB | 2026/4/19 08:45:59 |
| context-system.md | 6.9 kB | 2026/4/19 08:45:59 |
| index.md | 738 B | 2026/4/19 08:45:59 |
| nanoagent-code-review-graph-assert.md | 790 B | 2026/4/19 08:45:59 |
| nanoagent-code-review-graph-load.md | 955 B | 2026/4/19 08:45:59 |
| src-constructor.md | 8.6 kB | 2026/4/19 08:45:59 |
| tools-tool.md | 5.0 kB | 2026/4/19 08:45:59 |
| ui-error.md | 7.6 kB | 2026/4/19 08:45:59 |
