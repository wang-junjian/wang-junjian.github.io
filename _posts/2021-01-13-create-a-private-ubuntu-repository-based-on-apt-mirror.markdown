---
layout: post
title:  "基于Apt-Mirror创建私有Ubuntu存储库"
date:   2021-01-13 00:00:00 +0800
categories: Linux
tags: [Linux, apt-mirror, apache2, curl, ln]
---

## 服务端
### apt-mirror下载软件包
1. 安装apt-mirror
```shell
sudo apt-get install apt-mirror -y
#修复FAQ1
sudo curl -fsSL https://raw.githubusercontent.com/Stifler6996/apt-mirror/master/apt-mirror > apt-mirror
```

2. 配置mirror.list
```shell
sudo nano /etc/apt/mirror.list
```
```conf
############# config ##################
set base_path    /data/apt-mirror
#set mirror_path  $base_path/mirror
#set skel_path    $base_path/skel
#set var_path     $base_path/var
#set cleanscript $var_path/clean.sh
#set defaultarch  <running host architecture>
#set postmirror_script $var_path/postmirror.sh
#set run_postmirror 0
set nthreads     20
set _tilde 0
############# end config ##############
deb http://archive.ubuntu.com/ubuntu focal main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu focal-security main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu focal-updates main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu focal-proposed main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu focal-backports main restricted universe multiverse
#deb-src http://archive.ubuntu.com/ubuntu focal main restricted universe multiverse
#deb-src http://archive.ubuntu.com/ubuntu focal-security main restricted universe multiverse
#deb-src http://archive.ubuntu.com/ubuntu focal-updates main restricted universe multiverse
#deb-src http://archive.ubuntu.com/ubuntu focal-proposed main restricted universe multiverse
#deb-src http://archive.ubuntu.com/ubuntu focal-backports main restricted universe multiverse
clean http://archive.ubuntu.com/ubuntu
```

3. 下载软件包
```shell
sudo apt-mirror
```

### 部署HTTP服务
* 1.安装Apache
```shell
sudo apt-get install apache2 -y
```

* 2.配置
```shell
sudo nano /etc/apache2/sites-enabled/000-default.conf
```

```xml
<VirtualHost *:80>
    # The ServerName directive sets the request scheme, hostname and port that
    # the server uses to identify itself. This is used when creating
    # redirection URLs. In the context of virtual hosts, the ServerName
    # specifies what hostname must appear in the request's Host: header to
    # match this virtual host. For the default virtual host (this file) this
    # value is not decisive as it is used as a last resort host regardless.
    # However, you must set it for any further virtual host explicitly.
    #ServerName www.example.com

    ServerAdmin webmaster@localhost
    DocumentRoot /var/www     
    <Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
    # error, crit, alert, emerg.
    # It is also possible to configure the loglevel for particular
    # modules, e.g.
    #LogLevel info ssl:warn

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    # For most configuration files from conf-available/, which are
    # enabled or disabled at a global level, it is possible to
    # include a line for only one particular virtual host. For example the
    # following line enables the CGI configuration for this host only
    # after it has been globally disabled with "a2disconf".
    #Include conf-available/serve-cgi-bin.conf
</VirtualHost>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```

* 3.创建软链接
```shell
sudo ln -s /data/apt-mirror/mirror/archive.ubuntu.com/ubuntu /var/www/ubuntu
```

* 4.重启Apache
```shell
sudo service apache2 restart
```

## 客户端
### 编辑软件源
```shell
sudo nano /etc/apt/sources.list
```
```
deb http://172.16.33.174/ubuntu focal main restricted universe multiverse
deb http://172.16.33.174/ubuntu focal-updates main restricted universe multiverse
deb http://172.16.33.174/ubuntu focal-security main restricted universe multiverse
deb http://172.16.33.174/ubuntu focal-proposed main restricted universe multiverse
deb http://172.16.33.174/ubuntu focal-backports main restricted universe multiverse
```

### 更新软件包索引
```shell
sudo apt update
```

## FAQ
1. can't open index archive.ubuntu.com
```
sudo apt-mirror
Processing indexes: [SSSapt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal/main/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal/restricted/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal/universe/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal/multiverse/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-security/main/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-security/restricted/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-security/universe/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-security/multiverse/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-updates/main/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-updates/restricted/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-updates/universe/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
apt-mirror: can't open index archive.ubuntu.com/ubuntu//dists/focal-updates/multiverse/binary-<running/Packages in process_index at /usr/bin/apt-mirror line 800.
PPP]
```

## 参考资料
* [Apt-mirror for amd64 did not include focal/main/dep11 and focal/main/cnf/Commands-amd64](https://askubuntu.com/questions/1252828/apt-mirror-for-amd64-did-not-include-focal-main-dep11-and-focal-main-cnf-command)
* [This is a fork of the original apt-mirror.](https://github.com/Stifler6996/apt-mirror)
* [apt-mirror](https://apt-mirror.github.io)
* [apt-mirror](https://github.com/apt-mirror/apt-mirror)
* [How to create an Ubuntu 20.04 repository server?](https://www.osradar.com/create-ubuntu-20-04-repository-server/)
* [Set Up A Local Ubuntu / Debian Mirror with Apt-Mirror](https://blog.programster.org/set-up-a-local-ubuntu-mirror-with-apt-mirror)
* [Official Archive Mirrors for Ubuntu](https://launchpad.net/ubuntu/+archivemirrors)
* [Setup Local Repositories with ‘apt-mirror’ in Ubuntu and Debian Systems](https://www.tecmint.com/setup-local-repositories-in-ubuntu/)
* [Ubunut 服务器 auth.log 日志中出现大量localhost CRON[14301]: pam_unix(cron:session): session open/closed for user root](https://blog.yzgod.com/tag/linux)
* [How to create a Ubuntu repository server](https://linuxconfig.org/how-to-create-a-ubuntu-repository-server)
* [How to select the fastest apt mirror on Ubuntu Linux](https://linuxconfig.org/how-to-select-the-fastest-apt-mirror-on-ubuntu-linux)
* [How can I get apt to use a mirror close to me, or choose a faster mirror?](https://askubuntu.com/questions/37753/how-can-i-get-apt-to-use-a-mirror-close-to-me-or-choose-a-faster-mirror)
* [使用 apt-mirror 和 apt-cacher 创建本地 Ubuntu 仓库](https://blog.fleeto.us/post/build-ubuntu-repository-with-apt-mirror-and-apt-cacher/)
* [使用apt-mirror建立本地debian仓库源](https://www.cnblogs.com/pengdonglin137/p/3474260.html)
* [Cron job doesn't run](https://unix.stackexchange.com/questions/616189/cron-job-doesnt-run)
