---
layout: single
title:  "macOS 图像拼接工具（Automator）"
date:   2025-06-01 10:00:00 +0800
categories: Automator 图像拼接
tags: [Automator, ImageMagick, 图像拼接, macOS]
---

本文档介绍了如何利用 **macOS 的 Automator** 工具创建一个自动化脚本，以实现**多张图片的水平或垂直拼接**。它通过将 **Shell 脚本**集成到“**快速操作**”中，使得用户可以在 **Finder** 中直接选中图片并进行拼接。整个过程涵盖了从 **Automator 设置、Shell 脚本的配置（包括 ImageMagick 依赖和拼接逻辑）到最终的使用方法和效果展示**，旨在为 macOS 用户提供一个便捷高效的**图像拼接**解决方案。

## macOS 图像拼接工具使用说明

本工具是一个专为 macOS 设计的自动化脚本，它能帮助您将多张图片水平或垂直拼接成一张图片。

该工具设计为通过 macOS 的“快速操作”或 Automator 工作流程来调用，从而实现便捷的图形化操作。

* **作为“快速操作”使用：**
    * **设置“快速操作”：** 您需要将提供的脚本保存为 Automator 工作流程的“快速操作”。
        * 打开 **Automator** 应用（在“应用程序” -> “实用工具”中）。
        * 选择 **“文件”>“新建”**。
        * 选择 **“快速操作”** 并点击“选取”。
        * 在左侧的库中，搜索并拖动 **“运行 Shell 脚本”** 到右侧的工作流程区域。
        * 在“运行 Shell 脚本”模块中，将“传递输入”设置为 **“作为自变量”**。
        * 将本工具的完整代码粘贴到“运行 Shell 脚本”的文本框中。
        * 选择 **“文件”>“存储”**，为您的快速操作命名，例如“图像拼接”。
    * **使用方法：**
        * 打开 **Finder**，导航到您要拼接的图片所在的文件夹。
        * **选中您希望拼接的所有图片**（请确保至少选择两张）。
        * 右键点击选中的图片，或者点击 Finder 窗口顶部的“服务”菜单。
        * 在上下文菜单中，找到并点击您刚才创建的“快速操作”名称，例如 **“图像拼接”**。
        * 一个对话框会弹出，询问您希望“垂直拼接”还是“水平拼接”。选择您的偏好。
        * 工具将自动处理图片，并将拼接后的新图片保存在您选中的第一张图片所在的相同文件夹中。新文件的名称会包含拼接方式和时间戳，例如“垂直拼接_2024-05-20 10.30.00.png”。


## 打开自动操作（Automator）

![](/images/2025/Automator/Automator.jpeg)

## 创建快速操作

![](/images/2025/Automator/AutomatorQuickOperation.jpeg)

## 配置工作流程

![](/images/2025/Automator/AutomatorQuickOperation-Config.jpeg)

## Shell 脚本

![](/images/2025/Automator/ImageStitching-ShellCode.jpeg)

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

# 从 stdin 读取所有输入文件路径
files=()
while IFS= read -r file; do
    files+=("$file")
done

# 确保至少选择了两个文件
if [ "${#files[@]}" -lt 2 ]; then
    osascript -e "display dialog \"请选择两个以上图像文件。当前选择了 ${#files[@]} 个文件。\" with title \"图像拼接错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
    exit 1
fi

choice=$(osascript <<EOD
set dialogResult to display dialog "请选择图像拼接方式：" ¬
with title "图像拼接" ¬
buttons {"垂直拼接", "水平拼接"} ¬
default button "垂直拼接" ¬

set userChoice to button returned of dialogResult

return userChoice
EOD
)

# 根据用户选择设置拼接参数
if [[ "$choice" == "垂直拼接" ]]; then
    append_option="-append"
    append_name="垂直拼接"
elif [[ "$choice" == "水平拼接" ]]; then
    append_option="+append"
    append_name="水平拼接"
elif [[ "$choice" == "取消" ]]; then
	exit 0
else
    # 用户取消或超时，默认使用垂直拼接
    append_option="-append"
    append_name="垂直拼接"
fi

# 获取第一个文件的目录
input_dir=$(dirname "${files[1]}")

# 生成时间戳文件名（无扩展名）
current_datetime=$(date "+%Y-%m-%d %H.%M.%S")

# 自动检测第一个文件的扩展名
filename=$(basename -- "${files[1]}")
extension="${filename##*.}"

# 如果扩展名无效，默认使用 png
if [[ -z "$extension" || "$extension" == "$filename" ]]; then
    extension="png"
fi

# 将扩展名转换为小写（兼容所有 shell）
extension=$(echo "$extension" | tr '[:upper:]' '[:lower:]')

# 创建输出文件名（保留原始扩展名）
output_file="${input_dir}/${append_name}_${current_datetime}.${extension}"

# 检查 ImageMagick 是否安装
if ! command -v magick &> /dev/null; then
    osascript -e "display dialog \"ImageMagick 未安装！请先安装：\n\n1. 打开终端\n2. 运行: brew install imagemagick\" with title \"软件依赖错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
    exit 1
fi

# 执行拼接命令
if ! magick "${files[@]}" $append_option "$output_file"; then
    osascript -e "display dialog \"合并图像时出错，请确保已安装 ImageMagick！\n终端命令: brew install imagemagick\" with title \"图像拼接错误\" buttons {\"好的\"} default button \"好的\" with icon stop"
    exit 1
fi
```

![](/images/2025/Automator/ImageStitching-ShellCode-All.png)

## 使用说明

![](/images/2025/Automator/ImageStitching.png)

![](/images/2025/Automator/ImageStitchingRun.png)

## 效果演示

![](/images/2025/Automator/Demo.png)
