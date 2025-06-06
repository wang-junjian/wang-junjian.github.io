---
layout: single
title:  "GitHub MCP 服务器"
date:   2025-04-03 08:00:00 +0800
categories: MCP GitHub
tags: [MCP, MCPServer, GitHub]
---

## GitHub MCP 服务器

GitHub API 的 MCP 服务器，支持文件操作、仓库管理、搜索功能等。

### 功能特点

- **自动分支创建**：创建/更新文件或推送更改时，如果分支不存在则自动创建
- **全面的错误处理**：对常见问题提供清晰的错误信息
- **Git 历史保留**：操作保持适当的 Git 历史记录，不强制推送
- **批量操作**：支持单文件和多文件操作
- **高级搜索**：支持搜索代码、议题/PR 和用户

## 工具

1. `create_or_update_file`
   - 在仓库中创建或更新单个文件
   - 输入：
     - `owner` (字符串)：仓库所有者（用户名或组织）
     - `repo` (字符串)：仓库名称
     - `path` (字符串)：创建/更新文件的路径
     - `content` (字符串)：文件内容
     - `message` (字符串)：提交消息
     - `branch` (字符串)：要在其中创建/更新文件的分支
     - `sha` (可选字符串)：被替换文件的 SHA（用于更新）
   - 返回：文件内容和提交详情

2. `push_files`
   - 在单个提交中推送多个文件
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `branch` (字符串)：要推送到的分支
     - `files` (数组)：要推送的文件，每个包含 `path` 和 `content`
     - `message` (字符串)：提交消息
   - 返回：更新的分支引用

3. `search_repositories`
   - 搜索 GitHub 仓库
   - 输入：
     - `query` (字符串)：搜索查询
     - `page` (可选数字)：分页的页码
     - `perPage` (可选数字)：每页结果数（最大 100）
   - 返回：仓库搜索结果

4. `create_repository`
   - 创建新的 GitHub 仓库
   - 输入：
     - `name` (字符串)：仓库名称
     - `description` (可选字符串)：仓库描述
     - `private` (可选布尔值)：仓库是否应该是私有的
     - `autoInit` (可选布尔值)：使用 README 初始化
   - 返回：创建的仓库详情

5. `get_file_contents`
   - 获取文件或目录的内容
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `path` (字符串)：文件/目录路径
     - `branch` (可选字符串)：获取内容的分支
   - 返回：文件/目录内容

6. `create_issue`
   - 创建新议题
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `title` (字符串)：议题标题
     - `body` (可选字符串)：议题描述
     - `assignees` (可选字符串[])：分配的用户名
     - `labels` (可选字符串[])：添加的标签
     - `milestone` (可选数字)：里程碑编号
   - 返回：创建的议题详情

7. `create_pull_request`
   - 创建新的拉取请求
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `title` (字符串)：PR 标题
     - `body` (可选字符串)：PR 描述
     - `head` (字符串)：包含更改的分支
     - `base` (字符串)：要合并到的分支
     - `draft` (可选布尔值)：创建为草稿 PR
     - `maintainer_can_modify` (可选布尔值)：允许维护者编辑
   - 返回：创建的拉取请求详情

8. `fork_repository`
   - 复刻仓库
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `organization` (可选字符串)：要复刻到的组织
   - 返回：复刻的仓库详情

9. `create_branch`
   - 创建新分支
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `branch` (字符串)：新分支名称
     - `from_branch` (可选字符串)：源分支（默认为仓库默认分支）
   - 返回：创建的分支引用

10. `list_issues`
    - 列出和筛选仓库议题
    - 输入：
      - `owner` (字符串)：仓库所有者
      - `repo` (字符串)：仓库名称
      - `state` (可选字符串)：按状态筛选（'open'、'closed'、'all'）
      - `labels` (可选字符串[])：按标签筛选
      - `sort` (可选字符串)：排序方式（'created'、'updated'、'comments'）
      - `direction` (可选字符串)：排序方向（'asc'、'desc'）
      - `since` (可选字符串)：按日期筛选（ISO 8601 时间戳）
      - `page` (可选数字)：页码
      - `per_page` (可选数字)：每页结果数
    - 返回：议题详情数组

11. `update_issue`
    - 更新现有议题
    - 输入：
      - `owner` (字符串)：仓库所有者
      - `repo` (字符串)：仓库名称
      - `issue_number` (数字)：要更新的议题编号
      - `title` (可选字符串)：新标题
      - `body` (可选字符串)：新描述
      - `state` (可选字符串)：新状态（'open' 或 'closed'）
      - `labels` (可选字符串[])：新标签
      - `assignees` (可选字符串[])：新分配的人员
      - `milestone` (可选数字)：新里程碑编号
    - 返回：更新的议题详情

12. `add_issue_comment`
    - 向议题添加评论
    - 输入：
      - `owner` (字符串)：仓库所有者
      - `repo` (字符串)：仓库名称
      - `issue_number` (数字)：要评论的议题编号
      - `body` (字符串)：评论文本
    - 返回：创建的评论详情

13. `search_code`
    - 在 GitHub 仓库中搜索代码
    - 输入：
      - `q` (字符串)：使用 GitHub 代码搜索语法的搜索查询
      - `sort` (可选字符串)：排序字段（仅 'indexed'）
      - `order` (可选字符串)：排序顺序（'asc' 或 'desc'）
      - `per_page` (可选数字)：每页结果数（最大 100）
      - `page` (可选数字)：页码
    - 返回：包含仓库上下文的代码搜索结果

14. `search_issues`
    - 搜索议题和拉取请求
    - 输入：
      - `q` (字符串)：使用 GitHub 议题搜索语法的搜索查询
      - `sort` (可选字符串)：排序字段（comments、reactions、created 等）
      - `order` (可选字符串)：排序顺序（'asc' 或 'desc'）
      - `per_page` (可选数字)：每页结果数（最大 100）
      - `page` (可选数字)：页码
    - 返回：议题和拉取请求搜索结果

15. `search_users`
    - 搜索 GitHub 用户
    - 输入：
      - `q` (字符串)：使用 GitHub 用户搜索语法的搜索查询
      - `sort` (可选字符串)：排序字段（followers、repositories、joined）
      - `order` (可选字符串)：排序顺序（'asc' 或 'desc'）
      - `per_page` (可选数字)：每页结果数（最大 100）
      - `page` (可选数字)：页码
    - 返回：用户搜索结果

16. `list_commits`
   - 获取仓库中某分支的提交
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `page` (可选字符串)：页码
     - `per_page` (可选字符串)：每页记录数
     - `sha` (可选字符串)：分支名称
   - 返回：提交列表

17. `get_issue`
   - 获取仓库中某个议题的内容
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `issue_number` (数字)：要检索的议题编号
   - 返回：GitHub 议题对象和详情

18. `get_pull_request`
   - 获取特定拉取请求的详情
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
   - 返回：拉取请求详情，包括差异和审查状态

19. `list_pull_requests`
   - 列出和筛选仓库拉取请求
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `state` (可选字符串)：按状态筛选（'open'、'closed'、'all'）
     - `head` (可选字符串)：按头部用户/组织和分支筛选
     - `base` (可选字符串)：按基础分支筛选
     - `sort` (可选字符串)：排序方式（'created'、'updated'、'popularity'、'long-running'）
     - `direction` (可选字符串)：排序方向（'asc'、'desc'）
     - `per_page` (可选数字)：每页结果数（最大 100）
     - `page` (可选数字)：页码
   - 返回：拉取请求详情数组

20. `create_pull_request_review`
   - 创建拉取请求的审查
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
     - `body` (字符串)：审查评论文本
     - `event` (字符串)：审查操作（'APPROVE'、'REQUEST_CHANGES'、'COMMENT'）
     - `commit_id` (可选字符串)：要审查的提交 SHA
     - `comments` (可选数组)：特定行的评论，每个包含：
       - `path` (字符串)：文件路径
       - `position` (数字)：差异中的行位置
       - `body` (字符串)：评论文本
   - 返回：创建的审查详情

21. `merge_pull_request`
   - 合并拉取请求
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
     - `commit_title` (可选字符串)：合并提交的标题
     - `commit_message` (可选字符串)：合并提交的额外细节
     - `merge_method` (可选字符串)：合并方法（'merge'、'squash'、'rebase'）
   - 返回：合并结果详情

22. `get_pull_request_files`
   - 获取拉取请求中更改的文件列表
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
   - 返回：带有补丁和状态详情的更改文件数组

23. `get_pull_request_status`
   - 获取拉取请求所有状态检查的综合状态
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
   - 返回：综合状态检查结果和各个检查详情

24. `update_pull_request_branch`
   - 用基础分支的最新更改更新拉取请求分支（相当于 GitHub 的"更新分支"按钮）
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
     - `expected_head_sha` (可选字符串)：拉取请求 HEAD 引用的预期 SHA
   - 返回：分支更新时的成功消息

25. `get_pull_request_comments`
   - 获取拉取请求的审查评论
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
   - 返回：拉取请求审查评论数组，包含评论文本、作者和差异中的位置等详情

26. `get_pull_request_reviews`
   - 获取拉取请求的审查
   - 输入：
     - `owner` (字符串)：仓库所有者
     - `repo` (字符串)：仓库名称
     - `pull_number` (数字)：拉取请求编号
   - 返回：拉取请求审查数组，包含审查状态（APPROVED、CHANGES_REQUESTED 等）、审查者和审查正文等详情

## 搜索查询语法

### 代码搜索
- `language:javascript`：按编程语言搜索
- `repo:owner/name`：在特定仓库中搜索
- `path:app/src`：在特定路径中搜索
- `extension:js`：按文件扩展名搜索
- 示例：`q: "import express" language:typescript path:src/`

### 议题搜索
- `is:issue` 或 `is:pr`：按类型筛选
- `is:open` 或 `is:closed`：按状态筛选
- `label:bug`：按标签搜索
- `author:username`：按作者搜索
- 示例：`q: "memory leak" is:issue is:open label:bug`

### 用户搜索
- `type:user` 或 `type:org`：按账户类型筛选
- `followers:>1000`：按关注者筛选
- `location:London`：按位置搜索
- 示例：`q: "fullstack developer" location:London followers:>100`

有关详细的搜索语法，请参阅 [GitHub 的搜索文档](https://docs.github.com/en/search-github/searching-on-github)。

## 设置

### 个人访问令牌
[创建 GitHub 个人访问令牌](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)，具有适当权限：
   - 前往 [Personal access tokens](https://github.com/settings/tokens)（在 GitHub 设置 > 开发者设置中）
   - 选择您希望此令牌访问的仓库（公开、全部或选择）
   - 创建具有 `repo` 范围（"对私有仓库的完全控制"）的令牌
     - 或者，如果只使用公共仓库，仅选择 `public_repo` 范围
   - 复制生成的令牌

### 与 Claude Desktop 一起使用
要与 Claude Desktop 一起使用，请在您的 `claude_desktop_config.json` 中添加以下内容：

#### Docker
```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "mcp/github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

#### NPX

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## 构建

Docker 构建：

```bash
docker build -t mcp/github -f src/github/Dockerfile .
```


## 参考资料
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
