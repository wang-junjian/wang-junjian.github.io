---
layout: single
title:  "macOS 解压RAR（Automator）"
date:   2025-06-08 08:00:00 +0800
categories: Automator 解压RAR
tags: [Automator, 解压RAR, rar, macOS]
---

本文档详细介绍了**如何在 macOS 上使用 Automator 创建一个快速操作来解压 RAR 文件**。它提供了一个**Shell 脚本，用于检测 Homebrew 环境并调用 `rar` 或 `unrar` 命令进行解压**，同时包含错误处理和用户通知。文章还**指导用户授予 `rar` 可执行文件“完全磁盘访问权限”**，这是解决“Operation not permitted”错误的关键步骤。此外，文本提供了一个**带调试日志功能的 Shell 脚本**，帮助用户诊断解压过程中可能出现的问题，并展示了实际的调试输出。

<!--more-->

## 开发 Automator 快速操作（“解压RAR”）

![](/images/2025/Automator/Automator.jpeg)

![](/images/2025/Automator/AutomatorQuickOperation.jpeg)

![](/images/2025/Automator-UnRAR/Unrar-Shell-Code.jpeg)

```bash
#!/bin/bash

# --- 确保 Homebrew 环境加载并更新 PATH ---
# Homebrew 路径（Apple Silicon）
if [ -f "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Homebrew 路径（Intel）
if [ -f "/usr/local/bin/brew" ]; then
    eval "$(/usr/local/bin/brew shellenv)"
fi

# 确保 rar 命令在 PATH 中，将 Homebrew 路径置于最前
# 这样做可以确保即使系统 PATH 中有其他同名命令，也会优先使用 Homebrew 的
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
# --- Homebrew 环境加载结束 ---

# 遍历所有选中的文件
for f in "$@"; do
    # 检查文件是否为 .rar 格式
    if [[ "$f" =~ \.rar$ ]]; then
        # 获取文件所在的目录
        dir=$(dirname "$f")
        
        # 切换到文件所在目录进行解压
        # 使用 pushd 和 popd 可以更安全地切换目录，避免影响后续操作
        pushd "$dir" > /dev/null || {
            osascript -e "display dialog \"无法进入目录：\n$dir\" with title \"RAR 解压错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
            continue
        }

        # 检查 rar 命令是否存在
        # 使用 -v 检查命令是否存在，而不是简单的 ! command -v
        if ! command -v rar &> /dev/null; then
            osascript -e "display dialog \"'rar' 命令未找到！请确保已安装 WinRAR 或使用 Homebrew 安装 unrar：\n\n1. 打开终端\n2. 运行: brew install unrar\" with title \"软件依赖错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
            popd > /dev/null # 无论如何都要回到原始目录
            exit 1
        fi

        # 执行解压命令
        # 注意：这里使用 'x' 参数解压到当前目录并保留原始路径结构
        if ! rar x "$f"; then
            osascript -e "display dialog \"解压文件时出错：\n$(basename "$f")\n请检查文件是否损坏或权限。\" with title \"RAR 解压错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
        else
            osascript -e "display notification \"$(basename "$f") 已成功解压！\" with title \"RAR 解压完成\""
        fi
        
        # 返回到原始目录
        popd > /dev/null
    fi
done

exit 0
```


## 使用 Automator 快速操作（“解压RAR”）

![](/images/2025/Automator-UnRAR/Unrar-Using.png)

![](/images/2025/Automator-UnRAR/Unrar-Done.png)


##  **为 `rar` 可执行文件授予“完全磁盘访问权限”：**
- 打开 **“系统设置”** (System Settings)。
- 导航到 **“隐私与安全性”** (Privacy & Security)。
- 在 **“完全磁盘访问权限”** 页面，再次点击左下角的 `+` 按钮。
- 按下 `Command + Shift + G`，输入 `/opt/homebrew/bin`，然后点击“前往”。
- 找到并选择 **`rar`** ，然后点击“打开”。
- 确保 `rar` 旁边的开关是 **打开** 的。

![](/images/2025/Automator-UnRAR/Privacy-and-Security.png)

![](/images/2025/Automator-UnRAR/Privacy-and-Security_Full-disk-access-permission_rar.png)


## 调试“快速操作”

调试 Shell Code

```bash
#!/bin/bash

# 定义日志文件路径
LOG_FILE="/tmp/rar_automator_debug.log"
# 清空之前的日志
> "$LOG_FILE"

echo "--- Script Start: $(date) ---" >> "$LOG_FILE"
echo "Selected files: $@" >> "$LOG_FILE"

# --- 确保 Homebrew 环境加载并更新 PATH ---
# Homebrew 路径（Apple Silicon）
if [ -f "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    echo "Loaded Apple Silicon Homebrew env." >> "$LOG_FILE"
fi

# Homebrew 路径（Intel）
if [ -f "/usr/local/bin/brew" ]; then
    eval "$(/usr/local/bin/brew shellenv)"
    echo "Loaded Intel Homebrew env." >> "$LOG_FILE"
fi

# 确保 rar 命令在 PATH 中，将 Homebrew 路径置于最前
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
echo "Current PATH: $PATH" >> "$LOG_FILE"
# --- Homebrew 环境加载结束 ---

# 遍历所有选中的文件
for f in "$@"; do
    echo "Processing file: $f" >> "$LOG_FILE"

    # 检查文件是否为 .rar 格式
    if [[ "$f" =~ \.rar$ ]]; then
        # 获取文件所在的目录
        dir=$(dirname "$f")
        rar_basename=$(basename "$f") # 获取不带路径的文件名

        echo "Target directory: $dir" >> "$LOG_FILE"
        echo "RAR filename: $rar_basename" >> "$LOG_FILE"
        
        # 切换到文件所在目录进行解压
        pushd "$dir" > /dev/null
        if [ $? -ne 0 ]; then
            ERROR_MSG="无法进入目录：\n$dir"
            echo "Error: $ERROR_MSG" >> "$LOG_FILE"
            osascript -e "display dialog \"$ERROR_MSG\" with title \"RAR 解压错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
            continue
        fi
        echo "Changed directory to: $(pwd)" >> "$LOG_FILE"

        # 检查 rar 命令是否存在
        RAR_COMMAND="/opt/homebrew/bin/rar" # 显式使用绝对路径
        if ! [ -x "$RAR_COMMAND" ]; then # 检查文件是否存在且可执行
            ERROR_MSG="'rar' 命令 ($RAR_COMMAND) 未找到或不可执行！请确保已安装 WinRAR 或使用 Homebrew 安装 unrar：\n\n1. 打开终端\n2. 运行: brew install unrar"
            echo "Error: $ERROR_MSG" >> "$LOG_FILE"
            popd > /dev/null # 无论如何都要回到原始目录
            osascript -e "display dialog \"$ERROR_MSG\" with title \"软件依赖错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
            exit 1
        fi
        echo "Found rar command at: $RAR_COMMAND" >> "$LOG_FILE"

        # 执行解压命令，并将所有输出重定向到日志文件
        echo "Executing: $RAR_COMMAND x \"$rar_basename\"" >> "$LOG_FILE"
        # 注意：这里rar x后面跟着的是文件名，因为我们已经cd到了该目录
        if ! "$RAR_COMMAND" x "$rar_basename" >> "$LOG_FILE" 2>&1; then
            ERROR_MSG="解压文件时出错：\n$rar_basename\n请检查文件是否损坏、权限或rar命令的详细错误信息（请查看 $LOG_FILE）。"
            echo "RAR command failed." >> "$LOG_FILE"
            popd > /dev/null
            osascript -e "display dialog \"$ERROR_MSG\" with title \"RAR 解压错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
        else
            echo "RAR command succeeded." >> "$LOG_FILE"
            popd > /dev/null
            osascript -e "display notification \"$rar_basename 已成功解压！\" with title \"RAR 解压完成\""
        fi
        
        # 返回到原始目录
        popd > /dev/null
    else
        echo "Skipping non-rar file: $f" >> "$LOG_FILE"
    fi
done

echo "--- Script End: $(date) ---" >> "$LOG_FILE"
exit 0
```

查看日志

```bash
cat /tmp/rar_automator_debug.log
```

```bash
--- Script Start: Sun Jun  8 10:30:40 CST 2025 ---
Selected files: /Users/junjian/Downloads/王仁杰/高一下学期/中高考放假11天/tmp/8日化生1.rar
Loaded Apple Silicon Homebrew env.
Current PATH: /opt/homebrew/bin:/usr/local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Users/junjian/.cargo/bin:/usr/bin:/bin:/usr/sbin:/sbin
Processing file: /Users/junjian/Downloads/王仁杰/高一下学期/中高考放假11天/tmp/8日化生1.rar
Target directory: /Users/junjian/Downloads/王仁杰/高一下学期/中高考放假11天/tmp
RAR filename: 8日化生1.rar
Changed directory to: /Users/junjian/Downloads/王仁杰/高一下学期/中高考放假11天/tmp
Found rar command at: /opt/homebrew/bin/rar
Executing: /opt/homebrew/bin/rar x "8日化生1.rar"

RAR 7.11   Copyright (c) 1993-2025 Alexander Roshal   20 Mar 2025
Trial version             Type 'rar -?' for help

Cannot open 8日化生1.rar
Operation not permitted
No files to extract
RAR command failed.
--- Script End: Sun Jun  8 10:30:42 CST 2025 ---
```
