---
layout: single
title:  "macOS PNG重命名并转JPG（Automator）"
date:   2025-06-08 00:00:00 +0800
categories: Automator PNG重命名并转JPG
tags: [Automator, PNG重命名并转JPG, ImageMagick, rename, macOS]
---

本文档提供了一份关于如何在 macOS 上使用 **Automator** 创建一个 **“快速操作”** 的详细指南。这个自动化工具旨在帮助用户 **重命名** 选定文件夹中的所有 PNG 图像为连续的数字格式，随后将它们 **转换** 为 JPG 格式，并在转换完成后 **删除** 原始的 PNG 文件。它详细说明了设置 **Shell 脚本** 的步骤，该脚本依赖于 **Homebrew**、**ImageMagick** 和 **Perl rename** 工具来执行这些图像处理任务，并包含了安装这些必要依赖项的说明。用户可以通过 **Finder** 的右键菜单方便地运行这个自动化操作。

<!--more-->

## Automator 开发 “PNG重命名并转JPG” 快速操作

![](/images/2025/Automator/Automator.jpeg)

![](/images/2025/Automator-PNG2JPG/QuickOperator.jpeg)

![](/images/2025/Automator-PNG2JPG/PNG-Rename-Convert-JPG-Shell-Code.jpeg)

## 使用 Automator 快速操作（“PNG重命名并转JPG”）

![](/images/2025/Automator-PNG2JPG/PNG-Rename-Convert-JPG-Menu.png)

![](/images/2025/Automator-PNG2JPG/PNG-Rename-Convert-JPG-Done.png)


## 创建文件夹操作的快速操作

这个工具将处理所选文件夹中的所有 PNG 图像。它将：

1.  将文件夹中所有的 PNG 文件**重命名**为两位数的顺序格式（例如，`01.png`、`02.png`）。
2.  将所有 PNG 文件**转换**为 JPG 格式。
3.  转换后**删除**原始 PNG 文件。

### 设置快速操作

1.  **打开 Automator：** 进入您的“应用程序”文件夹，然后是“实用工具”，并打开 **Automator**。
2.  **创建新文档：** 选择“文件”>“新建”。
3.  **选择“快速操作”：** 在模板选择器中，选择 **“快速操作”** 并点击“选取”。
4.  **配置工作流程输入：**
    * 在工作流程区域的顶部，将“工作流程接收当前”设置为 **“文件夹”**。
    * 将“位于”设置为 **“Finder.app”**。
5.  **添加“运行 Shell 脚本”操作：**
    * 在左侧的“动作”库中，搜索 **“运行 Shell 脚本”**。
    * 将此操作拖放到右侧的工作流程区域。
6.  **配置 Shell 脚本：**
    * 在“运行 Shell 脚本”操作中，将“传递输入”设置为 **“作为自变量”**。
    * 将以下 Shell 脚本粘贴到文本框中：

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

# 确保 ImageMagick 和 Perl 在 PATH 中
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# 获取选定的文件夹路径
for f in "$@"; do
    folder_path="$f"
    break # 只处理第一个选定的文件夹
done

# 检查是否实际选择了文件夹
if [ -z "$folder_path" ]; then
    osascript -e 'display dialog "未选择任何文件夹。请选择一个文件夹进行操作。" with title "错误" buttons {"好的"} default button "好的" with icon stop'
    exit 1
fi

# 进入选定的文件夹
cd "$folder_path" || {
    osascript -e 'display dialog "无法访问所选文件夹：\n'"$folder_path"'" with title "错误" buttons {"好的"} default button "好的" with icon stop'
    exit 1
}

# 检查 ImageMagick 和 Perl 依赖项
if ! command -v mogrify &> /dev/null || ! command -v rename &> /dev/null; then
    osascript -e 'display dialog "缺少必要的依赖项（ImageMagick 或 Perl rename）。请确保已安装：\n\n1. 打开终端\n2. 运行: brew install imagemagick\n3. 运行: brew install perl-rename" with title "软件依赖错误" buttons {"好的"} default button "好的" with icon stop'
    exit 1
fi

# 1. 顺序重命名 PNG 文件
if ! perl -MFile::Basename -e '
    my $i = 0;
    for my $file (@ARGV) {
        if ($file =~ /\.png$/i) { # 不区分大小写的 .png 检查
            my $new_name = sprintf("%02d.png", ++$i);
            rename $file, $new_name or warn "无法重命名 $file 到 $new_name: $!";
        }
    }
' *.png; then
    osascript -e 'display dialog "重命名 PNG 文件时发生错误。" with title "操作失败" buttons {"好的"} default button "好的"} with icon stop'
    exit 1
fi

# 2. 将所有 PNG 文件转换为 JPG
if ! mogrify -format jpg *.png; then
    osascript -e 'display dialog "将 PNG 文件转换为 JPG 时发生错误。" with title "操作失败" buttons {"好的"} default button "好的"} with icon stop'
    exit 1
fi

# 3. 删除原始 PNG 文件
if ! rm *.png; then
    osascript -e 'display dialog "删除原始 PNG 文件时发生错误。" with title "操作失败" buttons {"好的"} default button "好的"} with icon stop'
    exit 1
fi

osascript -e 'display dialog "文件夹操作已完成！\n\n文件已重命名、转换为 JPG 并删除了原始 PNG 文件。" with title "操作成功" buttons {"好的"} default button "好的" with icon note'
```

7.  **保存快速操作：**
    * 前往“文件”>“存储”。
    * 为您的快速操作指定一个描述性的名称，例如“处理文件夹中的图像”或“重命名并转换图像”。

### 使用快速操作

1.  **打开 Finder：** 导航到包含您要处理图像的文件夹。
2.  **选择文件夹：** 右键点击该文件夹本身（而不是里面的图像）。
3.  **运行快速操作：** 在上下文菜单中，将鼠标悬停在 **“快速操作”**（或旧版 macOS 上的“服务”）上，然后点击您为快速操作命名的名称（例如，“处理文件夹中的图像”）。
4.  **确认：** 操作完成后，或如果发生任何错误，您将收到一个对话框通知。

### 依赖项

此脚本依赖于 **Homebrew** 进行软件包管理以及两个命令行工具：

* **ImageMagick：** 用于图像转换 (`mogrify`)。
* **Perl `rename` 工具：** 用于批量重命名。这里使用的 `rename` 命令通常由 Homebrew 的 `rename` 提供。

如果您没有安装这些工具，脚本将显示错误消息。您可以通过打开**终端**（应用程序 > 实用工具 > 终端）并运行以下命令来安装它们：

```bash
brew install imagemagick
brew install rename
```

这个设置将提供一种便捷的方式，让您可以直接从 Finder 对任何文件夹应用指定的转换！
