---
layout: single
title:  "在 macOS 上安装 PostgreSQL"
date:   2024-06-25 08:00:00 +0800
categories: PostgreSQL
tags: [DB, PostgreSQL, pgAdmin, macOS]
---

## 安装 PostgreSQL
### 下载
- [macOS packages](https://www.postgresql.org/download/macosx/)
- [Download PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

### 安装
```txt
Installation Directory: /Library/PostgreSQL/16
Server Installation Directory: /Library/PostgreSQL/16
Data Directory: /Library/PostgreSQL/16/data
Database Port: 5432
Database Superuser: postgres
Operating System Account: postgres
Database Service: postgresql-16
Command Line Tools Installation Directory: /Library/PostgreSQL/16
pgAdmin4 Installation Directory: /Library/PostgreSQL/16/pgAdmin 4
Stack Builder Installation Directory: /Library/PostgreSQL/16
Installation Log: /tmp/install-postgresql.log
```

使用默认设置安装即可。

Locale 我选择了 `zh_CN`，在创建数据库的时候遇到了错误：`The chosen LC_CTYPE setting requires encoding "EUC_CN".encoding "UTF8" does not match locale "zh_CN.eucCN"`

`Application Stack Builder` 是一个可选的安装组件，可以用来安装其他的 PostgreSQL 工具。这里我们不需要，可以退出。

- [PostgreSQL（一） 安装教程](https://juejin.cn/post/7175810432639172665)
- [[SQL] 圖解安裝 PostgreSQL 15.3 全過程 (含基本測試)](https://ticyyang.medium.com/sql-%E5%AE%89%E8%A3%9Dpostgresql-6040002d1317)
- [Install PostgreSQL on Mac](https://www.geeksforgeeks.org/install-postgresql-on-mac/)
- [Install PostgreSQL 14.7 for MacOS](https://www.dataquest.io/blog/install-postgresql-14-7-for-macos/)
- [Install PostgreSQL macOS](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/)


## 可视化工具
- [pgAdmin](https://github.com/pgadmin-org/pgadmin4)
- [pgAdmin 安装包](https://www.postgresql.org/ftp/pgadmin/pgadmin4/)
- [Top 5 GUI tools for PostgreSQL in 2024](https://www.datensen.com/blog/postgresql/top-5-gui-tools-for-postgresql/)
