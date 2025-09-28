---
layout: single
title:  "macOS PDF2JPG（Automator）"
date:   2025-09-27 08:00:00 +0800
categories: Automator PDF2JPG
tags: [Automator, PDF2JPG, ImageMagick, PDF, macOS]
---

本文档详细介绍了**如何在 macOS 上使用 Automator 创建一个快速操作将 PDF 文件转换为 JPG 格式，每页一张**。

<!--more-->

## 开发 Automator 快速操作（“PDF2JPG”）

![](/images/2025/Automator/Automator.jpeg)

![](/images/2025/Automator/AutomatorQuickOperation.jpeg)

![](/images/2025/Automator/PDF2JPG.jpeg)

```bash
#!/bin/bash

# 加载 Homebrew 环境（适用于 Apple Silicon 芯片）
if [ -f "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# 加载 Homebrew 环境（适用于 Intel 芯片）
if [ -f "/usr/local/bin/brew" ]; then
    eval "$(/usr/local/bin/brew shellenv)"
fi

# 确保 ImageMagick 在 PATH 中
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# 检查 ImageMagick 是否安装
if ! command -v magick &> /dev/null; then
    osascript -e "display dialog \"ImageMagick 未安装！请先安装：\n\n1. 打开终端\n2. 运行: brew install imagemagick\" with title \"软件依赖错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
    exit 1
fi

# 从 stdin 读取所有输入文件路径
files=()
while IFS= read -r file; do
    # 仅处理 .pdf 文件
    if [[ "$file" =~ \.pdf$ || "$file" =~ \.PDF$ ]]; then
        files+=("$file")
    fi
done

# 检查是否选中了文件
if [ "${#files[@]}" -eq 0 ]; then
    exit 0
fi

# 循环处理每一个选中的 PDF 文件
for pdf_file in "${files[@]}"; do
    # 1. 获取 PDF 文件所在的目录
    input_dir=$(dirname "${pdf_file}")
    
    # 2. 获取 PDF 文件名（不包含路径）
    filename=$(basename -- "${pdf_file}")

    # 3. 移除常见的 .pdf 或 .PDF 扩展名，获取作为目录名的部分
    # 使用 bash 替换功能：删除最短的 .pdf 或 .PDF 后缀
    filename_base="${filename%.pdf}"
    filename_base="${filename_base%.PDF}"

    # 4. 构造输出文件夹路径：在当前目录下创建同名文件夹
    output_dir="${input_dir}/${filename_base}"

    # 5. 创建输出文件夹
    if ! mkdir -p "$output_dir"; then
        osascript -e "display dialog \"无法创建目录：${output_dir}\" with title \"文件错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
        continue
    fi
    
    # 6. 转换 PDF 为 JPG：
    # %d 会被 ImageMagick 自动替换为页码
    if ! magick -density 300 "${pdf_file}" -quality 90 -colorspace RGB "${output_dir}/${filename_base}-%d.jpg"; then
        osascript -e "display dialog \"转换文件时出错：${pdf_file}\n请检查 ImageMagick 是否正确安装。\" with title \"转换错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
    else
        osascript -e "display notification \"存储目录：$output_dir\" with title \"PDF 转换 JPG 成功\""
    fi
done
```

## 安装 ImageMagick

```bash
brew install imagemagick
```
