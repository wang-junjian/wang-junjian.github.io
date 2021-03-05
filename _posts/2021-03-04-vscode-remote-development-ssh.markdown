---
layout: post
title:  "VS Code远程开发 - SSH"
date:   2021-03-04 00:00:00 +0800
categories: IDE 实践
tags: [vscode, ssh]
---

## 架构图
![](/images/2021/vscode-remote/architecture-ssh.png)

## 安装
### Remote
* [Install SSH server](https://code.visualstudio.com/docs/remote/troubleshooting#_installing-a-supported-ssh-server)

### Local
* [Install OpenSSH compatible SSH client](https://code.visualstudio.com/docs/remote/troubleshooting#_installing-a-supported-ssh-client)
* [Install Visual Studio Code](https://code.visualstudio.com/)
* [Install Remote Development extension pack](https://aka.ms/vscode-remote/download/extension)

## 连接远程主机
1. 在VS Code中， 按F1，选择Remote-SSH: Connect to Host...输入user@hostname。

2. VS Code将连接到SSH服务器并进行设置。 VS Code将使用进度通知使您保持最新状态。
![](/images/2021/vscode-remote/ssh-connecting.png)

3. 连接后，您将进入一个空窗口。 您始终可以参考状态栏来查看连接到的主机。
![](/images/2021/vscode-remote/ssh-connected.png)

4. 选择菜单：File > Open...
![](/images/2021/vscode-remote/ssh-open-file-or-folder.png)

## 关闭远程连接
* 选择菜单：File > Close Remote Connection。
* 您可以简单地退出VS Code，也可以关闭远程连接。

## Remote Explorer
管理您的远程连接
![](/images/2021/vscode-remote/remote-explorer.png)

## 在远程主机上打开终端
选择菜单：Terminal > New Terminal
![](/images/2021/vscode-remote/ssh-open-terminal.png)

## 在远程主机调试
在Extensions窗口中选择要在远程主机上安装的调试器，按F5。
![](/images/2021/vscode-remote/ssh-remote-debugging.png)

## 参考资料
* [vscode](https://github.com/microsoft/vscode)
* [Visual Studio Code on Linux](https://code.visualstudio.com/docs/setup/linux)
* [Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh)
* [Developing inside a Container](https://code.visualstudio.com/docs/remote/containers)
* [Remote Development Tips and Tricks](https://code.visualstudio.com/docs/remote/troubleshooting)