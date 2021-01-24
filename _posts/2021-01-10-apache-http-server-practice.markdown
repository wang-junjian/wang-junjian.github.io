---
layout: post
title:  "Apache HTTP Server实践"
date:   2021-01-10 00:00:00 +0800
categories: Linux 实践
tags: [Linux, Command, Apache]
---

## 修改端口号
* /etc/apache2/ports.conf
```shell
sudo nano /etc/apache2/ports.conf
```

```
# If you just change the port or add more ports here, you will likely also
# have to change the VirtualHost statement in
# /etc/apache2/sites-enabled/000-default.conf

Listen 8081
......
......
```

* /etc/apache2/sites-enabled/000-default.conf
```shell
sudo nano /etc/apache2/sites-enabled/000-default.conf
```

```
<VirtualHost *:8081>
......
......
</VirtualHost>
```

* 重启服务
```shell
sudo systemctl restart apache2
```

## 参考资料
* [Apache HTTP Server](http://httpd.apache.org)
* [How to Change Apache HTTP Port in Linux](https://www.tecmint.com/change-apache-port-in-linux/)