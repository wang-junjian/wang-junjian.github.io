---
layout: single
title:  "PowerShell 脚本示例"
date:   2025-12-05 23:00:00 +0800
categories: PowerShell Windows
tags: [PowerShell, Windows]
---

<!--more-->

```powershell
# 核心参数配置（无需修改，已按你的需求设定）
$targetMinDate = Get-Date "2024-06-01"  # 目标日期区间：开始
$targetMaxDate = Get-Date "2024-12-31"  # 目标日期区间：结束
$hourMin = 8                            # 限制最小小时（8点）
$hourMax = 21                           # 限制最大小时（21点，因22点不包含，实际最晚21:59:59）
$folderPath = "D:\test"                 # 要遍历的目录
$skipExtension = ".eml"                 # 需跳过的文件后缀
$logFilePath = "D:\log.txt"  # 日志文件路径（与脚本同目录）

# 生成目标区间内随机时间（限制8:00-22:00）的函数
function Get-RandomTargetDateTime {
    param(
        [datetime]$DateMin = $targetMinDate,
        [datetime]$DateMax = $targetMaxDate,
        [int]$HourMin = $hourMin,
        [int]$HourMax = $hourMax
    )
    $rand = New-Object System.Random

    # 步骤1：随机生成目标日期（仅日期部分，不含时间）
    $dateSpan = New-TimeSpan -Start $DateMin -End $DateMax
    $randomDateDays = $rand.Next($dateSpan.Days + 1)  # 随机天数（包含首尾日期）
    $randomDate = $DateMin.AddDays($randomDateDays).Date  # 仅保留日期，时间归零

    # 步骤2：随机生成小时（8-21点）、分钟（0-59）、秒（0-59）
    $randomHour = $rand.Next($HourMin, $HourMax + 1)  # 8-21点（包含21）
    $randomMinute = $rand.Next(0, 60)                 # 0-59分
    $randomSecond = $rand.Next(0, 60)                 # 0-59秒

    # 步骤3：组合日期和时间，返回最终随机时间
    return Get-Date -Year $randomDate.Year -Month $randomDate.Month -Day $randomDate.Day `
                    -Hour $randomHour -Minute $randomMinute -Second $randomSecond
}

# 初始化日志文件（写入执行时间和配置信息）
$logHeader = "===== 执行时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ====="
$logConfig = "目标目录：$folderPath`n目标日期区间：$($targetMinDate.ToString('yyyy-MM-dd')) 至 $($targetMaxDate.ToString('yyyy-MM-dd'))`n限制时间范围：$hourMin:00 - $($hourMax+1):00（实际最晚$hourMax:59:59）`n跳过文件类型：$skipExtension`n"
$logHeader + "`n" + $logConfig + "`n" | Out-File -FilePath $logFilePath -Encoding UTF8

# 开始遍历目录并处理文件
Write-Host "`n===== 开始处理目录：$folderPath =====" -ForegroundColor Cyan
Write-Host "目标日期区间：$targetMinDate 至 $targetMaxDate"
Write-Host "限制时间范围：$hourMin:00 - $($hourMax+1):00（实际最晚$hourMax:59:59）"
Write-Host "跳过的文件类型：$skipExtension"
Write-Host "日志文件保存路径：$logFilePath`n" -ForegroundColor Yellow

# 遍历所有文件（-Recurse 包含子文件夹；仅处理文件，排除文件夹+指定后缀）
Get-ChildItem -Path $folderPath -Recurse | Where-Object {
    $_ -is [System.IO.FileInfo] -and $_.Extension -ne $skipExtension  # 排除.eml文件
} | ForEach-Object {
    $currentFile = $_
    $currentModifyTime = $currentFile.LastWriteTime  # 获取文件当前修改时间

    # 筛选条件：当前修改时间不在目标区间内
    if ($currentModifyTime -lt $targetMinDate -or $currentModifyTime -gt $targetMaxDate) {
        $randomTime = Get-RandomTargetDateTime  # 生成限制8-22点的随机时间
        $currentFile.LastWriteTime = $randomTime  # 应用修改时间
        
        # 输出控制台日志（绿色）
        Write-Host "✅ 已修改：$($currentFile.FullName)" -ForegroundColor Green
        Write-Host "   原时间：$currentModifyTime → 新时间：$randomTime`n"
        
        # 写入日志文件（包含文件路径、原时间、新时间）
        $logContent = "文件路径：$($currentFile.FullName)"
        $logContent += "`n原修改时间：$($currentModifyTime.ToString('yyyy-MM-dd HH:mm:ss'))"
        $logContent += "`n新修改时间：$($randomTime.ToString('yyyy-MM-dd HH:mm:ss'))"
        $logContent += "`n----------------------------------------`n"
        $logContent | Out-File -FilePath $logFilePath -Encoding UTF8 -Append
    }
    else {
        # 输出控制台跳过日志（灰色，可删除该else块隐藏）
        Write-Host "ℹ️  跳过：$($currentFile.FullName)" -ForegroundColor Gray
        Write-Host "   原因：当前修改时间（$currentModifyTime）已在目标区间内`n"
    }
}

# 单独输出被跳过的.eml文件（可选，方便确认）
$skippedEmlFiles = Get-ChildItem -Path $folderPath -Recurse -Filter "*$skipExtension" | Where-Object { $_ -is [System.IO.FileInfo] }
if ($skippedEmlFiles) {
    Write-Host "`n⚠️  已跳过的.eml文件列表：" -ForegroundColor Yellow
    $skippedEmlFiles | ForEach-Object { Write-Host "   - $($_.FullName)" }
    # （可选）将跳过的.eml文件也写入日志
    "`n⚠️  被跳过的.eml文件列表：`n" + ($skippedEmlFiles | ForEach-Object { "   - $($_.FullName)" }) -join "`n" | Out-File -FilePath $logFilePath -Encoding UTF8 -Append
}

# 统计修改文件数量并写入日志结尾
$modifiedCount = (Get-Content $logFilePath | Select-String "文件路径：").Count  # 按日志中"文件路径："计数
"`n===== 处理完成！共修改 $modifiedCount 个文件 =====" | Out-File -FilePath $logFilePath -Encoding UTF8 -Append

Write-Host "`n===== 处理完成！日志已保存到：$logFilePath ====`n" -ForegroundColor Cyan
```

该PowerShell脚本的核心功能是 **批量筛选并修改指定目录下文件的修改时间**，同时跳过特定类型文件、记录操作日志，具体功能可总结如下：

### 一、核心处理逻辑
遍历目标目录（含子文件夹），对符合条件的文件执行修改，不符合条件的文件直接跳过，全程记录操作日志。

### 二、具体功能细节
1. **目标文件筛选规则**
   - 遍历路径：`D:\test` 目录及所有子文件夹（通过 `-Recurse` 实现）；
   - 处理对象：仅针对文件（排除文件夹）；
   - 跳过规则：自动跳过后缀为 `.eml` 的文件，不进行任何处理；
   - 时间筛选：仅处理「修改时间早于2024-06-01」或「晚于2024-12-31」的文件，已在该时间区间内的文件直接跳过。

2. **文件修改时间配置**
   - 目标时间范围：日期固定在 2024-06-01 ~ 2024-12-31 之间；
   - 时间限制：小时仅允许 8:00 ~ 21:59:59（早于8点、晚于21点59分59秒的时间不会生成）；
   - 随机性：日期（区间内随机天数）、小时（8-21点）、分钟（0-59分）、秒（0-59秒）均随机生成，确保每个文件的新修改时间唯一且符合限制。

3. **操作日志记录**
   - 日志路径：固定保存到 `D:\log.txt`（而非脚本同目录）；
   - 日志内容：
     - 执行上下文（脚本运行时间、目标目录、时间区间、跳过的文件类型）；
     - 已修改文件详情（文件完整路径、原始修改时间、新随机修改时间）；
     - 被跳过的 `.eml` 文件列表（可选记录）；
     - 统计结果（最终修改的文件总数）；
   - 编码格式：UTF-8 编码，避免中文乱码。

4. **控制台可视化反馈**
   - 执行过程中实时输出：已修改文件（绿色标识）、跳过文件（灰色标识，含跳过原因）、被跳过的 `.eml` 文件列表（黄色标识）；
   - 执行结束后显示：修改文件总数、日志保存路径，方便快速核对结果。

### 三、适用场景
适用于需要统一规范 `D:\test` 目录下文件修改时间（限定2024年下半年工作时段）、排除邮件文件（.eml）、且需留存操作痕迹的场景（如文件归档、合规化整理等）。
