---
layout: post
title:  "智能编码新范式 (Cline + DeepSeek) × MCP"
date:   2025-04-07 08:00:00 +0800
categories: Cline MCP
tags: [Cline, MCP MCPServer, DeepSeek, VSCode, GitHubServer, TicTacToe]
---

![](/images/2025/TicTacToe/00.jpg)

- 提示词：使用 React 技术实现 Tic Tac Toe 游戏

![](/images/2025/TicTacToe/01-AutoCodeTicTacToe.jpg)

- 运行游戏

![](/images/2025/TicTacToe/02-AppRun.jpg)

- 创建新仓库

![](/images/2025/TicTacToe/03-CreateNewRepository.jpg)

- 快速设置仓库

![](/images/2025/TicTacToe/04-QuickSetupRepository.jpg)

- 退出游戏

![](/images/2025/TicTacToe/05-AppExit.jpg)

- 查看已安装的 MCP 服务器

![](/images/2025/TicTacToe/06-InstalledMCPServers.jpg)

- 创建新问题（issue）

![](/images/2025/TicTacToe/07-CreateNewIssue.jpg)

- 查看 wang-junjian/tictactoe 项目中分配给我 issue，使用 GitHub MCP 服务器的工具 list_issues

![](/images/2025/TicTacToe/08-GitHubMCPServer-list_issues.jpg)

- 当前仓库 wang-junjian/tictactoe 中有1个开放的 issue

![](/images/2025/TicTacToe/09-ShowIssues.jpg)

- 分步实现 issue #1 玩家获胜时添加烟花效果

![](/images/2025/TicTacToe/10-ImplIssue1.jpg)

- 实现 issue #1 玩家获胜时添加烟花效果

![](/images/2025/TicTacToe/11-ImplIssue2.jpg)

- 运行游戏 - 获胜后的烟花效果

![](/images/2025/TicTacToe/12-AppRun-Firework.jpg)

- 创建新问题 - Refactoring

![](/images/2025/TicTacToe/13-CreateNewIssue.jpg)

- 创建分支 git switch -c Refactoring，对项目中的代码进行重构

![](/images/2025/TicTacToe/14-Refactoring1.jpg)

- 完成代码重构

![](/images/2025/TicTacToe/15-Refactoring2.jpg)

- 推送到远程仓库，git push -u origin Refactoring

![](/images/2025/TicTacToe/16-PushOriginRefactoring.jpg)

- Compare & pull request

![](/images/2025/TicTacToe/17-PullRequest.jpg)

- 创建拉取请求（pull request），关联问题（issue #2）

![](/images/2025/TicTacToe/18-CreatePullRequest.jpg)

- wang-junjian/tictactoe 项目中分配给我的 PR，使用 GitHub MCP 服务器的工具 get_pull_request

![](/images/2025/TicTacToe/19-GitHubMCPServer-get_pull_request.jpg)

- 使用 GitHub MCP 服务器的工具 get_pull_request_files 获取 PR 的变更文件列表

![](/images/2025/TicTacToe/20-GitHubMCPServer-get_pull_request_files.jpg)

- 完成 PR #3 的代码评审

![](/images/2025/TicTacToe/21-Review.jpg)

- 使用 GitHub MCP 服务器的工具 add_issue_comment，提交代码评审

![](/images/2025/TicTacToe/22-GitHubMCPServer-add_issue_comment.jpg)

- 已成功在 PR #3 提交评审意见

![](/images/2025/TicTacToe/23-CompleteReview.jpg)

- 合并拉取请求（Merge pull request）

![](/images/2025/TicTacToe/24-MergePullRequest.jpg)

- 关闭拉取请求（PR #3）

![](/images/2025/TicTacToe/25-ClosePullRequest.jpg)

- 关闭问题（issue #2）

![](/images/2025/TicTacToe/26-CloseIssue.jpg)

- 发布游戏 TicTacToe v1.0.0

![](/images/2025/TicTacToe/27-Release.jpg)

- https://github.com/wang-junjian/tictactoe

![](/images/2025/TicTacToe/28.jpg)


## 生成视频

make.sh

```bash
export FONT_PATH=/System/Library/AssetsV2/com_apple_MobileAsset_Font7/3419f2a427639ad8c8e139149a287865a90fa17e.asset/AssetData/PingFang.ttc
export FONT_SIZE=72
export FONT_COLOR=red
export TEXT_POSITION=+0+20

magick -delay 300 -loop 0 \
\( 00.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "" \) \
\( blank.jpg -gravity center -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize 300 -annotate 0,0 "场景一：智能编码\nCline + DeepSeek" \) \
\( 01-AutoCodeTicTacToe.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "提示词：使用 React 技术实现 Tic Tac Toe 游戏" \) \
\( 02-AppRun.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "运行游戏" \) \
\( 03-CreateNewRepository.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "创建新仓库" \) \
\( 04-QuickSetupRepository.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "快速设置仓库" \) \
\( 05-AppExit.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "退出游戏" \) \
\( blank.jpg -gravity center -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize 300 -annotate 0,0 "场景二：智能连接工具 \nGitHub MCP Server" \) \
\( 06-InstalledMCPServers.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "查看已安装的 MCP 服务器" \) \
\( 07-CreateNewIssue.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "创建新问题（issue）" \) \
\( 08-GitHubMCPServer-list_issues.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "查看 wang-junjian/tictactoe 项目中分配给我 issue，使用 GitHub MCP 服务器的工具 list_issues" \) \
\( 09-ShowIssues.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "当前仓库 wang-junjian/tictactoe 中有1个开放的 issue" \) \
\( 10-ImplIssue1.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "分步实现 issue #1 玩家获胜时添加烟花效果" \) \
\( 11-ImplIssue2.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "实现 issue #1 玩家获胜时添加烟花效果" \) \
\( 12-AppRun-Firework.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "运行游戏 - 获胜后的烟花效果" \) \
\( blank.jpg -gravity center -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize 300 -annotate 0,0 "场景三：智能代码评审" \) \
\( 13-CreateNewIssue.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "创建新问题 - Refactoring" \) \
\( 14-Refactoring1.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "创建分支 git switch -c Refactoring，对项目中的代码进行重构" \) \
\( 15-Refactoring2.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "完成代码重构" \) \
\( 16-PushOriginRefactoring.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "推送到远程仓库，git push -u origin Refactoring" \) \
\( 17-PullRequest.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "Compare & pull request" \) \
\( 18-CreatePullRequest.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "创建拉取请求（pull request），关联问题（issue #2）" \) \
\( 19-GitHubMCPServer-get_pull_request.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "wang-junjian/tictactoe 项目中分配给我的 PR，使用 GitHub MCP 服务器的工具 get_pull_request" \) \
\( 20-GitHubMCPServer-get_pull_request_files.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "使用 GitHub MCP 服务器的工具 get_pull_request_files 获取 PR 的变更文件列表" \) \
\( 21-Review.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "完成 PR #3 的代码评审" \) \
\( 22-GitHubMCPServer-add_issue_comment.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "使用 GitHub MCP 服务器的工具 add_issue_comment，提交代码评审" \) \
\( 23-CompleteReview.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "已成功在 PR #3 提交评审意见" \) \
\( 24-MergePullRequest.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "合并拉取请求（Merge pull request）" \) \
\( 25-ClosePullRequest.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "关闭拉取请求（PR #3）" \) \
\( 26-CloseIssue.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "关闭问题（issue #2）" \) \
\( 27-Release.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "发布游戏 TicTacToe v1.0.0" \) \
\( 28.jpg -gravity south -background white -splice 0x30 -fill $FONT_COLOR -font "$FONT_PATH" -pointsize $FONT_SIZE -annotate $TEXT_POSITION "TicTacToe" \) \
ClineDeepSeekMCP_Dev.mov
```

```bash
sh make.sh
```

<video controls src="/images/2025/TicTacToe/ClineDeepSeekMCP_Dev.mov" title="智能编码新范式 (Cline + DeepSeek) × MCP"></video>
