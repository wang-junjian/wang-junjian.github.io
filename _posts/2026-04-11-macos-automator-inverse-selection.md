---
layout: single
title:  "macOS Finder 中的“反向选择”功能实现(Automator)"
date:   2026-04-11 13:00:00 +0800
categories: macOS Automator
tags: [macOS, Automator, AppleScript, Finder]
---

<!--more-->

通过 Automator 制作一个“快速操作”的方案。请按照以下的步骤操作：

1.  打开 **Automator**，新建一个 **“快速操作”**。
2.  设置：“工作流程收到当前”选 **“没有输入”**，“位于”选 **“Finder.app”**。
3.  在搜索框输入 `AppleScript`，拖入 **“运行 AppleScript”** 动作。
4.  清空原内容，粘贴以下这段代码：

```applescript
on run {input, parameters}
    tell application "Finder"
        -- 获取当前窗口，如果没有窗口则退出
        if (count of windows) = 0 then return
        set win to front window
        
        -- 获取文件夹内所有对象的路径列表
        set all_items to every item of win
        set all_paths to {}
        repeat with i in all_items
            set end of all_paths to (POSIX path of (i as alias))
        end repeat
        
        -- 获取当前已选对象的路径列表
        set sel_items to selection
        set sel_paths to {}
        repeat with i in sel_items
            set end of sel_paths to (POSIX path of (i as alias))
        end repeat
        
        -- 反向选择逻辑：遍历所有路径，如果不在已选路径中，则加入选中列表
        set new_selection to {}
        repeat with i from 1 to (count of all_items)
            set current_path to item i of all_paths
            if current_path is not in sel_paths then
                set end of new_selection to (item i of all_items)
            end if
        end repeat
        
        -- 执行选中
        if new_selection is not {} then
            set selection to new_selection
        end if
    end tell
end run
```

5.  保存并命名为 **“反向选择”**。
6.  **调用方法**：以后在 Finder 选中文件后，点击顶部菜单栏的 **Finder > 服务 > 反向选择**（或者右键菜单中的“服务”选项），即可完成反向选择。
