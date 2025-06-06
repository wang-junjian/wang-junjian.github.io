---
layout: single
title:  "SSH X11 Forwarding"
date:   2021-04-10 00:00:00 +0800
categories: Linux
tags: [ssh, X11, xquartz]
---

## macOS
### [XQuartz](https://www.xquartz.org)
* 安装
```shell
brew cask install xquartz
```

* 验证
```shell
xclock
xeyes
```
![](/images/2021/x11/xclock-xeyes.png)

### 不使用XAuth
```shell
$ ssh -Y username@hostname
(base) username@hostname:~$ gedit
```
![](/images/2021/x11/ssh-x11-forwarding.png)

### 使用XAuth
* 查找XAuth的位置
```shell
$ which xauth
/opt/X11/bin/xauth
```

* 配置XAuth
```shell
$ vim ~/.ssh/config
Host *
    XAuthLocation /opt/X11/bin/xauth
```

* SSH登录，可以尝试使用 ```ssh -X -vv``` 查看更多的失败信息。
```shell
$ ssh -X username@hostname
(base) username@hostname:~$ gedit
```
![](/images/2021/x11/ssh-x11-forwarding.png)


## 参考资料
* [How To Set Up And Use X11 Forwarding On Linux And Mac](https://www.businessnewsdaily.com/11035-how-to-use-x11-forwarding.html)
* [What does “Warning: untrusted X11 forwarding setup failed: xauth key data not generated” mean when ssh'ing with -X?](https://serverfault.com/questions/273847/what-does-warning-untrusted-x11-forwarding-setup-failed-xauth-key-data-not-ge)
* [SSH -X “Warning: untrusted X11 forwarding setup failed: xauth key data not generated”](https://stackoverflow.com/questions/27384725/ssh-x-warning-untrusted-x11-forwarding-setup-failed-xauth-key-data-not-gener)
* [macOS 使用 XQuartz 支持 X11 实现 Linux 图形化界面显示](https://wsgzao.github.io/post/x11/)
* [X11 forwarding，Windows与Linux结合的最佳开发环境](https://zhuanlan.zhihu.com/p/66075449)
* [x11_f0rwarding.sh](https://gist.github.com/thomasgroch/d7241604b8feef9b23b3351b29cb953c)
