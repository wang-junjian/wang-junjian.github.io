---
layout: post
title:  "Git 命令"
date:   2025-04-10 08:00:00 +0800
categories: Git GitHub
tags: [Git, GitHub]
---

## 使用 Git 的工作流程

![](/images/2025/Git/GitWorkStage.png)

![](/images/2025/Git/GitBaseDevelopmentWorkflow.png)

![](/images/2025/Git/GitLocalBranchDevelopment.png)

![](/images/2025/Git/GitInitDevelopmentWorkflow.png)

![](/images/2025/Git/GitCollaborativeWorkflow.png)


## 配置

### 查看全局配置

```bash
git config --global --list
```

```bash
filter.lfs.clean=git-lfs clean -- %f
filter.lfs.smudge=git-lfs smudge -- %f
filter.lfs.process=git-lfs filter-process
filter.lfs.required=true
user.name=军舰
user.email=wang-junjian@qq.com
http.postbuffer=524288000
http.version=HTTP/1.1
```

### 设置全局配置

```bash
git config --global user.name "军舰"
git config --global user.email wang-junjian@qq.com
```

### 初始化仓库

```bash
git init
```
```bash
Initialized empty Git repository in /Users/junjian/GitHub/wang-junjian/HelloGit/.git/
```

### 设置远程仓库

```bash
git remote add origin https://github.com/wang-junjian/HelloGit.git
```


## 基础

### 查看状态

```bash
git status
```
```bash
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md
        git-command.txt

nothing added to commit but untracked files present (use "git add" to track)
```

### 添加所有文件

```bash
git add .
```

### 查看状态

```bash
git status
```
```bash
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md
        new file:   git-command.txt
```

### 提交

```bash
git commit -m "Init commit"
```
```bash
[main (root-commit) f0f2f20] Init commit
 2 files changed, 78 insertions(+)
 create mode 100644 README.md
 create mode 100644 git-command.txt
```

### 推送本地仓库到远程仓库

```bash
# git push --set-upstream origin main
git push -u origin main
```
```bash
Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 12 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 906 bytes | 906.00 KiB/s, done.
Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/wang-junjian/HelloGit.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```


## 分支

### 查看分支

```bash
git branch
```
```bash
* main
```

### 创建分支

```bash
git branch feat-branch
```

### 交换到分支

```bash
git switch feat-branch
```
```bash
Switched to branch 'feat-branch'
```

### 创建并交换到分支

```bash
git switch -c feat-branch
```
```bash
Switched to a new branch 'feat-branch'
```

### 推送分支到远程

```bash
git push -u origin feat-branch
```
```bash
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 12 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 454 bytes | 454.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
remote: 
remote: Create a pull request for 'feat-branch' on GitHub by visiting:
remote:      https://github.com/wang-junjian/HelloGit/pull/new/feat-branch
remote: 
To https://github.com/wang-junjian/HelloGit.git
 * [new branch]      feat-branch -> feat-branch
branch 'feat-branch' set up to track 'origin/feat-branch'.
```

### 更新远程仓库（合并的分支）
```bash
git pull
```
```bash
remote: Enumerating objects: 1, done.
remote: Counting objects: 100% (1/1), done.
remote: Total 1 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (1/1), 905 bytes | 905.00 KiB/s, done.
From https://github.com/wang-junjian/HelloGit
   f7b67ef..d880aaa  main       -> origin/main
Updating f7b67ef..d880aaa
Fast-forward
 README.md | 38 +++++++++++++++++++++++++++++++++++++-
 1 file changed, 37 insertions(+), 1 deletion(-)
```

### 删除本地分支

```bash
git branch -d feat-branch
```
```bash
Deleted branch feat-branch (was a92ba9b).
```

### 删除远程分支

```bash
git push origin -d feat-branch        
```
```bash
To https://github.com/wang-junjian/HelloGit.git
 - [deleted]         feat-branch
```


## GitHub

### 创建新仓库

![](/images/2025/Git/CreateNewRepository.png)

![](/images/2025/Git/HelloGit.png)

### 创建 Pull Request

![](/images/2025/Git/NewBranch.png)

![](/images/2025/Git/CreatePullRequest.png)

### 合并 Pull Request

![](/images/2025/Git/MergePullRequest.png)

![](/images/2025/Git/MergedPullRequest.png)
