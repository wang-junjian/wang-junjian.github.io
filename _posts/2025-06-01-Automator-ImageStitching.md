---
layout: post
title:  "Automator 图像拼接脚本"
date:   2025-06-01 10:00:00 +0800
categories: Automator 图像拼接
tags: [Automator, ImageMagick, 图像处理]
---

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

## 使用说明

![](/images/2025/Automator/ImageStitching.png)

![](/images/2025/Automator/ImageStitchingRun.png)

## 效果演示

![](/images/2025/Automator/Demo.png)
