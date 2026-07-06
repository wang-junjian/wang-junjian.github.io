---
type: article
title:  "开源 AI 生态研究项目 Git 大文件 LFS 配置教程与团队开发指南"
date:   2026-07-06 21:21:00 +0800
tags: [git, lfs, github, open-source, open-ai-eco]
---

## GitHub 仓库初始化

```bash
git init
git add .
git commit -m "first commit"
```


## 关联远程仓库并推送

```bash
git remote add origin https://github.com/wang-junjian/open-ai-eco.git
git branch -M main
git push -u origin main
```


## 视频没有使用 Git LFS

```plaintext
remote: warning: File public/videos/open-design-webprototype.mp4 is 84.20 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB
remote: warning: GH001: Large files detected. You may want to try Git Large File Storage - https://git-lfs.github.com.
remote: warning: See https://gh.io/lfs for more information.
```

## 解决方案：

### 一、全局配置 public/videos/ 下所有文件走 Git LFS
#### 1. 先安装并初始化 Git LFS（已装可跳过）
```bash
# 安装（Windows/Mac/Linux 对应安装包，命令行初始化一次即可）
git lfs install
```

#### 2. 追踪 `public/videos/**` 全部文件
```bash
# 匹配 public/videos 下所有子目录、所有文件
git lfs track "public/videos/**"
```

执行后会自动生成/更新 `.gitattributes` 文件，内容类似：
```
public/videos/** filter=lfs diff=lfs merge=lfs -text
```

#### 3. 把 .gitattributes 提交到仓库（必须）
```bash
git add .gitattributes
git commit -m "use LFS for all files under public/videos"
```

### 二、关键：处理**已经提交到历史里**视频文件（重点）
你现在仓库历史里已经存了原始大视频，只加 track 没用，历史还是臃肿，分两种场景：

**刚新建仓库、还没人拉过代码**

#### 1. 删除本地+缓存里的旧大文件记录
```bash
# 递归移除整个目录所有文件的git缓存（本地文件保留，只移除git记录）
git rm --cached -r public/videos/
```

#### 2. 重新 add 提交，此时会被 LFS 接管
```bash
git add public/videos/
git commit -m "move video files to LFS"
# 强制推送覆盖远程main（仅全新仓库无协作时用！多人协作禁止--force）
git push origin main --force-with-lease
```

### 三、验证是否生效
随便往 `public/videos` 放一个视频，执行：
```bash
git status
# 查看文件是否被LFS托管
git lfs status
```
正常会显示类似：`public/videos/xxx.mp4 (LFS: Pointer)`

### 四、补充说明
1. `public/videos/**` 代表该目录下**所有层级所有文件**，不管后缀（mp4/avi/mov/png压缩包等全部走LFS）
2. 如果只想限定视频格式，不用 `**`，可以写多条：
   ```bash
   git lfs track "public/videos/*.mp4"
   git lfs track "public/videos/*.mov"
   git lfs track "public/videos/*.avi"
   ```
3. 📌 其他开发者拉代码时，只需执行一次 `git lfs install` 就能自动下载LFS真实文件。


## 完整标准操作步骤
核心逻辑：**先配置 Git LFS 再 add/提交代码**，从源头不让大视频进入普通 Git 历史，彻底避免后续清理历史、强制推送的麻烦。

### 1. 本地新建项目文件夹，进入目录
```bash
mkdir open-ai-eco
cd open-ai-eco
```

### 2. 初始化 Git
```bash
git init
```

### 3. 安装并初始化 Git LFS（首次电脑只需执行一次）
```bash
git lfs install
```

### 4. 提前追踪视频目录（关键：在添加任何文件前配置LFS）
两种写法按需选其一
#### 方案A：整个 videos 目录全部走LFS（推荐，简单）
```bash
git lfs track "public/videos/**"
```
自动生成 `.gitattributes` 文件，记录LFS规则。

#### 方案B：只限定视频后缀，其他小文件不走LFS
```bash
git lfs track "public/videos/*.mp4"
git lfs track "public/videos/*.mov"
git lfs track "public/videos/*.avi"
git lfs track "public/videos/*.webm"
```

### 5. 先提交 LFS 配置文件 .gitattributes
必须优先提交规则文件，保证后续文件识别生效
```bash
git add .gitattributes
git commit -m "config git lfs for video files"
```

### 6. 再添加项目全部代码（此时 public/videos 下视频会自动转为LFS指针）
```bash
git add .
git commit -m "first commit: all source & lfs video pointers"
```

### 7. 关联远程 GitHub 仓库并推送
```bash
git remote add origin https://github.com/wang-junjian/open-ai-eco.git
git branch -M main
git push -u origin main
```


## 团队成员克隆、开发、提交流程
### 一、首次克隆仓库（只做一次）
#### 1. 本地提前装好 Git LFS（必须先执行）
##### Windows/Mac/Linux 安装
- Windows：下载 Git LFS 安装包，或 `choco install git-lfs`
- Mac：`brew install git-lfs`
- Linux：`apt install git-lfs` / `yum install git-lfs`

安装完执行**全局初始化（一台电脑仅需运行1次）**
```bash
git lfs install
```
输出 `Git LFS initialized.` 即成功。

#### 2. 克隆仓库（正常 clone 即可，不用额外参数）
```bash
git clone https://github.com/wang-junjian/open-ai-eco.git
cd open-ai-eco
```
克隆时 Git 会自动读取仓库里的 `.gitattributes`，自动下载视频等LFS大文件，无需手动操作。

> 若克隆后视频文件夹是空/只有很小的指针文件，手动拉取LFS文件：
> ```bash
> git lfs pull
> ```

### 二、日常开发、新增/修改视频文件（标准流程）
#### 场景1：只改代码，不动视频
和平常 Git 使用完全一致，无区别
```bash
# 修改代码后
git add .
git commit -m "feat: xxx功能迭代"
git push
```

#### 场景2：新增/替换 public/videos 里的视频
无需重新配置 LFS，仓库内 `.gitattributes` 已写好规则，add 自动识别为LFS文件
```bash
# 放入新视频后
git add public/videos/
# 或全部文件一起提交 git add .
git commit -m "add new prototype video"
git push
```

#### 校验是否走了LFS（提交前可自查）
```bash
git lfs status
```
视频文件显示 `(LFS: Pointer)` = 正常；
如果显示普通文件，说明LFS未生效，检查是否执行过 `git lfs install`。

### 三、同步远程最新代码（多人协作）
拉取远端代码会自动同步LFS大文件，正常拉取即可
```bash
git pull
```
如果拉取后视频缺失/损坏，执行强制同步LFS资源：
```bash
git lfs pull
```

### 四、常见问题处理
1. **报错：push 提示文件过大，GH001**
   - 原因：本机没执行 `git lfs install`，LFS未启用，大文件当成普通Git文件提交
   - 修复：
     ```bash
     git lfs install
     git rm --cached 大视频文件名
     git add .
     git commit --amend
     git push
     ```

2. **克隆下来视频只有几KB，打不开**
   只是LFS指针，缺少真实文件，执行：
   ```bash
   git lfs pull
   ```

3. **切换分支后视频丢失**
   ```bash
   git checkout 目标分支
   git lfs pull
   ```

### 五、极简总结给团队新人
1. 电脑装 Git LFS，运行一次 `git lfs install`
2. `git clone 仓库地址`
3. 正常改代码、新增视频，`add/commit/push` 和平常一样
4. 拉代码用 `git pull`，视频异常就执行 `git lfs pull`
