---
layout: single
title:  "Cherry Studio 分支策略指南"
date:   2025-06-11 08:00:00 +0800
categories: CherryStudio 分支策略
tags: [CherryStudio, 分支策略, 代码管理, 开发流程]
---

该文档概述了 [Cherry Studio](https://github.com/CherryHQ/cherry-studio) 的**分支策略指南**，详述了其软件开发中的**主要分支**和**贡献分支**的使用规范。它明确指出，**`main`分支**作为主开发线，只接受通过**拉取请求（PR）**合入的代码，且可能包含不稳定功能；而**`release/*`分支**则用于稳定的发布代码，主要用于文档更新和错误修复。此外，文档还详细列举了不同类型的**贡献分支**（如功能、错误修复、文档和热修复分支）的命名约定和提交PR的目标分支，并强调了PR必须遵循的准则，包括与`main`同步、包含问题编号以及通过测试。最后，它还提及了**版本标签管理**的分类，以确保代码库的组织性和可追溯性。

<!--more-->

Cherry Studio 采用结构化的分支策略，以维护代码质量并简化开发流程。

## 工作流图

![](/images/2025/CherryStudio/Branch-Strategy-Workflow-Diagram.svg)


## 主要分支

  * **`main`**: 主开发分支

      * 包含最新的开发代码。
      * **不允许直接提交**——所有更改必须通过拉取请求（PR）合入。
      * 代码可能包含正在开发中的功能，因此可能不稳定。

  * **`release/*`**: 发布分支

      * 从 `main` 分支创建。
      * 包含已准备好发布的稳定代码。
      * **只接受文档更新和错误修复**。
      * 在部署到生产环境之前，会进行彻底测试。


## 贡献分支

向 Cherry Studio 贡献代码时，请遵循以下准则：

1.  **功能分支 (Feature Branches)**:

      * 从 `main` 分支创建。
      * 命名格式: `feature/issue-number-brief-description` (例如: `feature/123-add-user-profile`)。
      * 提交 PR 到 `main` 分支。

2.  **错误修复分支 (Bug Fix Branches)**:

      * 从 `main` 分支创建。
      * 命名格式: `fix/issue-number-brief-description` (例如: `fix/456-login-bug`)。
      * 提交 PR 到 `main` 分支。

3.  **文档分支 (Documentation Branches)**:

      * 从 `main` 分支创建。
      * 命名格式: `docs/brief-description` (例如: `docs/update-api-guide`)。
      * 提交 PR 到 `main` 分支。

4.  **热修复分支 (Hotfix Branches)**:

      * 从 `main` 分支创建。
      * 命名格式: `hotfix/issue-number-brief-description` (例如: `hotfix/789-critical-payment-issue`)。
      * **同时提交 PR 到 `main` 和相关的 `release` 分支**。

5.  **发布分支 (Release Branches)**:

      * 从 `main` 分支创建。
      * 命名格式: `release/version-number` (例如: `release/1.0.0`)。
      * 用于版本发布前的最终准备工作。
      * **只接受错误修复和文档更新**。
      * 经过测试和准备后，合并回 `main` 分支并打上版本标签。


## 拉取请求 (PR) 准则

  * **除非是修复关键的生产问题，所有 PR 都应提交到 `main` 分支。**
  * 提交 PR 前，请确保您的分支已与最新的 `main` 分支同步。
  * 在 PR 描述中包含相关的 **问题编号**。
  * 确保所有测试通过，并且代码符合我们的质量标准。
  * 如果添加新功能或修改 UI 组件，请包含 **修改前/修改后** 的截图。


## 版本标签管理

  * **主要版本 (Major releases)**: v**1**.0.0, v**2**.0.0, 等。
  * **功能版本 (Feature releases)**: v1.**1**.0, v1.**2**.0, 等。
  * **补丁版本 (Patch releases)**: v1.0.**1**, v1.0.**2**, 等。
  * **热修复版本 (Hotfix releases)**: v1.0.1-**hotfix**, 等。


## Cherry Studio 简介

🍒 [Cherry Studio](https://www.cherry-ai.com/) 是一款集多模型对话、知识库管理、AI 绘画、翻译等功能于一体的全能 AI 助手平台。

![](/images/2025/CherryStudio/CherryStudio.png)


## 参考资料
- [🌿 Branching Strategy](https://github.com/CherryHQ/cherry-studio/blob/main/docs/branching-strategy-en.md)
- [🌿 分支策略](https://github.com/CherryHQ/cherry-studio/blob/main/docs/branching-strategy-zh.md)
