---
layout: post
title:  "远程执行Shell命令"
date:   2021-11-01 00:00:00 +0800
categories: Python
tags: [fabric, ssh]
---

## 安装 Fabric
```shell
pip3 install fabric
```

## 远程执行 Shell 命令脚本（remote_execute_shell_command.py）
```py
#!/usr/bin/python

import argparse

from fabric import Connection, Config


# 您要远程操作的计算机，username@ip
HOSTS = ['root@192.168.0.1', 'root@192.168.0.2']
PASSWORDS = ['admin', 'admin']


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--command', type=str, help='execute shell command.')
    args = parser.parse_args()

    if not args.command:
        args.command = 'uname -a'
        
    print('➜  Execute shell command: ', args.command)

    for host, password in zip(HOSTS, PASSWORDS):
        print(f'➜  Host: {host}')

        if password:
            config = Config(overrides={'sudo':{'password':password}})
            Connection(host, config=config).sudo(args.command, hide='stderr')
        else:
            Connection(host).run(args.command)
```

## 执行
```shell
python3 remote_execute_shell_command.py -c 'uname -a'
➜  Execute shell command:  uname -a
➜  Host: root@192.168.0.1
Linux cpu1 5.4.0-89-generic #100-Ubuntu SMP Fri Sep 24 14:50:10 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
➜  Host: root@192.168.0.2
Linux cpu2 5.4.0-26-generic #30-Ubuntu SMP Mon Apr 20 16:58:30 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux
```

## 参考资料
* [Fabric](https://www.fabfile.org)
* [Paramiko](https://www.paramiko.org)
