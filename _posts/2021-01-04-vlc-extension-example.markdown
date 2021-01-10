---
layout: post
title:  "VLC Extension Example"
date:   2021-01-04 00:00:00 +0800
categories: Player
tags: [VLC, Lua]
---

## 开发
### 编写脚本 ```hello.lua```
```lua
function descriptor()
    return {
        title = "Hello World";
        version = "1.0";
        author = "WangJunjian";
        url = 'www.wangjunjian.com';
        shortdesc = "Hello World";
        description = "Hello World!";
        capabilities = {"menu"}
    }
end

-- activate() : called when the extension is activated from within VLC
function activate()
    create_dialog()
end

-- deactivate() : called when the extension is deactivated from within VLC
function deactivate()
    close()
    vlc.deactivate()
end

-- create_dialog() : creates the dialog containing the initial widgets
function create_dialog()
    dlg = vlc.dialog(descriptor().title)
    dlg:add_label("<b>Hello World: VLC Lua scripts and extensions</b>")
end
```

## 安装
### 拷贝脚本 ```hello.lua``` 到 extensions 目录
* Windows
```
/Program Files/VideoLAN/VLC/lua/extensions
```

* Mac OS X
```
/Applications/VLC.app/Contents/MacOS/share/lua/extensions/
```

* Linux
```
/home/$USER/.local/share/vlc/lua/extensions/
/usr/share/vlc/lua/extensions/
/usr/lib/vlc/lua/playlist/
```

## 使用
```
打开VLC Media Player，选择菜单：View->Hello World。
```

## 参考资料
* [VLC Lua scripts and extensions](https://www.videolan.org/developers/vlc/share/lua/README.txt)
* [videolan/vlc/share/lua/](https://github.com/videolan/vlc/tree/master/share/lua)
* [videolan/vlc/modules/lua/](https://github.com/videolan/vlc/tree/master/modules/lua)
* [VLC Extensions](https://addons.videolan.org/browse/cat/323/ord/latest/)
* [Moments' Tracker [Sort by ASCII value]](https://addons.videolan.org/p/1426091/)
* [Super Skipper](https://addons.videolan.org/p/1415936/)
* [Subtitle Word Search](https://addons.videolan.org/p/1154033/)
* [Extending VLC with Lua](http://www.coderholic.com/extending-vlc-with-lua/)
* [vlc lua: how do I get the full path of the current playing item?](https://stackoverflow.com/questions/24966228/vlc-lua-how-do-i-get-the-full-path-of-the-current-playing-item?rq=1)
* [Compile VLC](https://wiki.videolan.org/Category:Building/)
* [VLC Object Detection Extension](https://github.com/KarlHajal/VLC-Object-Detection-Extension)
* [Python ctypes-based bindings for libvlc](https://github.com/oaubert/python-vlc)
* [vs-media-player](https://github.com/mkloubert/vs-media-player)
* [VLC-Qt Library](https://github.com/vlc-qt/vlc-qt)
* [libVLC](https://www.yuque.com/lengyuezuixue/paayuv)
* [Python ctypes-based bindings for libvlc](https://github.com/oaubert/python-vlc)
* [vlc-ffmpeg-thumbnail.lua](https://gist.github.com/xenogenesi/9361b6bc1520527dcffdea34c8fa5e45)
