---
layout: post
title:  "我删库了, rm -rf *"
date:   2022-03-12 00:00:00 +0800
categories: 工作日志
tags: [Linux, rm, ls, inode]
---

> 今天，我“删库”了......

```shell
/data$ ll logs/
rm -rf *
```

我在根目录查看子目录的信息，确认是想删除的数据，然后顺手执行了 ```rm -rf *``` ，杯具产生了......


***拼命补救，没成功......***


查看目录或文件的 inode id
```shell
$ ls -id /
2 /

$ ls -id /usr/
28966913 /usr/

$ ls -id /usr/bin/bash
28967390 /usr/bin/bash
```

## 参考资料
* [extundelete: An ext3 and ext4 file undeletion utility](http://extundelete.sourceforge.net/)
* [extundelete](https://sourceforge.net/projects/extundelete/)
* [3 Ways to Recover Deleted Files by RM Command on Ubuntu](https://recoverit.wondershare.com/file-recovery/recover-deleted-files-by-rm-command-on-ubuntu.html)
* [linux下rm -rf * 误删除数据恢复(ext4文件系统)](https://www.jianshu.com/p/41f54d30ce68)
* [恢复误操作rm删除的文件](https://blog.linuxnb.com/index.php/post/106.html)
* [linux系统rm误删文件恢复 ext4](https://blog.csdn.net/xwl145/article/details/38896699)
* [Linux系统中文件被删除后的恢复方法（ext4）](https://zhuanlan.zhihu.com/p/136260123)
* [extundelete恢复ext4文件系统下误删除](https://blog.csdn.net/Liang_GaRy/article/details/118065874)
