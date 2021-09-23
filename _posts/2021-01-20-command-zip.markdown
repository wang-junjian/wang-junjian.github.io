---
layout: post
title:  "命令zip"
date:   2021-01-20 00:00:00 +0900
categories: Command
tags: [Linux, zip, unzip, less, zipdetails, vim]
---

## 准备 [yolov5](https://github.com/ultralytics/yolov5)
```
yolov5/
├── detect.py
├── Dockerfile
├── hubconf.py
├── LICENSE
├── models
│   ├── common.py
│   ├── experimental.py
│   ├── export.py
│   ├── __init__.py
│   ├── yolo.py
│   ├── yolov5l.yaml
│   ├── yolov5m.yaml
│   ├── yolov5s.yaml
│   └── yolov5x.yaml
├── README.md
├── requirements.txt
├── test.py
├── train.py
├── tutorial.ipynb
└── weights
    └── download_weights.sh
```

## 打包整个目录
```shell
zip -r yolov5.zip yolov5/
```

## 排除目录和文件
打包前，最好把之前的 zip 文件删除，不然是增量追加，还会看到排除的目录和文件。
```shell
zip -r yolov5.zip yolov5/ -x "yolov5/.git/*" -x "yolov5/.github/*" -x "yolov5/.gitattributes"
```

排除所有的 yaml 文件
```shell
zip -r yolov5.zip yolov5/ -x "*yolo*.yaml"
```

## 查看压缩文件内容
### less
```shell
$ less yolov5.zip
Archive:  yolov5.zip
 Length   Method    Size  Cmpr    Date    Time   CRC-32   Name
--------  ------  ------- ---- ---------- ----- --------  ----
       0  Stored        0   0% 2021-09-23 08:26 00000000  yolov5/
    5863  Defl:N     1606  73% 2021-09-23 08:25 2dadee94  yolov5/hubconf.py
  393745  Defl:N   265095  33% 2021-09-23 08:25 0639ed65  yolov5/tutorial.ipynb
    1809  Defl:N      785  57% 2021-09-23 08:25 210e056e  yolov5/Dockerfile
   11209  Defl:N     4293  62% 2021-09-23 08:25 0fb2167a  yolov5/README.md
    3610  Defl:N     1599  56% 2021-09-23 08:25 448c2178  yolov5/.dockerignore
       0  Stored        0   0% 2021-09-23 08:27 00000000  yolov5/models/
   16770  Defl:N     5105  70% 2021-09-23 08:25 a2d6786d  yolov5/models/common.py
    5964  Defl:N     2042  66% 2021-09-23 08:25 7d3e616d  yolov5/models/export.py
    1367  Defl:N      521  62% 2021-09-23 08:25 724eb6b1  yolov5/models/yolov5s.yaml
   12452  Defl:N     4540  64% 2021-09-23 08:25 5ee71767  yolov5/models/yolo.py
       0  Stored        0   0% 2021-09-23 08:25 00000000  yolov5/models/__init__.py
    5134  Defl:N     1812  65% 2021-09-23 08:25 e0747e47  yolov5/models/experimental.py
    1367  Defl:N      523  62% 2021-09-23 08:25 c6508ee4  yolov5/models/yolov5m.yaml
    1365  Defl:N      518  62% 2021-09-23 08:25 d43508f2  yolov5/models/yolov5l.yaml
    1367  Defl:N      521  62% 2021-09-23 08:25 52a80b1d  yolov5/models/yolov5x.yaml
   35126  Defl:N    12116  66% 2021-09-23 08:25 0b251754  yolov5/LICENSE
    3976  Defl:N     1768  56% 2021-09-23 08:25 8241f28a  yolov5/.gitignore
   17067  Defl:N     5745  66% 2021-09-23 08:25 f347d965  yolov5/test.py
   33724  Defl:N    10198  70% 2021-09-23 08:25 89ac94f1  yolov5/train.py
       0  Stored        0   0% 2021-09-23 08:25 00000000  yolov5/weights/
     277  Defl:N      200  28% 2021-09-23 08:25 288d966a  yolov5/weights/download_weights.sh
     599  Defl:N      294  51% 2021-09-23 08:25 bc19109a  yolov5/requirements.txt
    9294  Defl:N     3200  66% 2021-09-23 08:25 a5f339a4  yolov5/detect.py
--------          -------  ---                            -------
  562085           322481  43%                            24 files
```

### unzip
```shell
$ unzip -l yolov5.zip 
Archive:  yolov5.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  2021-09-23 08:26   yolov5/
     5863  2021-09-23 08:25   yolov5/hubconf.py
   393745  2021-09-23 08:25   yolov5/tutorial.ipynb
     1809  2021-09-23 08:25   yolov5/Dockerfile
    11209  2021-09-23 08:25   yolov5/README.md
     3610  2021-09-23 08:25   yolov5/.dockerignore
        0  2021-09-23 08:27   yolov5/models/
    16770  2021-09-23 08:25   yolov5/models/common.py
     5964  2021-09-23 08:25   yolov5/models/export.py
     1367  2021-09-23 08:25   yolov5/models/yolov5s.yaml
    12452  2021-09-23 08:25   yolov5/models/yolo.py
        0  2021-09-23 08:25   yolov5/models/__init__.py
     5134  2021-09-23 08:25   yolov5/models/experimental.py
     1367  2021-09-23 08:25   yolov5/models/yolov5m.yaml
     1365  2021-09-23 08:25   yolov5/models/yolov5l.yaml
     1367  2021-09-23 08:25   yolov5/models/yolov5x.yaml
    35126  2021-09-23 08:25   yolov5/LICENSE
     3976  2021-09-23 08:25   yolov5/.gitignore
    17067  2021-09-23 08:25   yolov5/test.py
    33724  2021-09-23 08:25   yolov5/train.py
        0  2021-09-23 08:25   yolov5/weights/
      277  2021-09-23 08:25   yolov5/weights/download_weights.sh
      599  2021-09-23 08:25   yolov5/requirements.txt
     9294  2021-09-23 08:25   yolov5/detect.py
---------                     -------
   562085                     24 files
```

### zipinfo
```shell
$ zipinfo yolov5.zip 
Archive:  yolov5.zip
Zip file size: 326545 bytes, number of entries: 24
drwxrwxr-x  3.0 unx        0 bx stor 21-Sep-23 08:26 yolov5/
-rw-rw-r--  3.0 unx     5863 tx defN 21-Sep-23 08:25 yolov5/hubconf.py
-rw-rw-r--  3.0 unx   393745 tx defN 21-Sep-23 08:25 yolov5/tutorial.ipynb
-rw-rw-r--  3.0 unx     1809 tx defN 21-Sep-23 08:25 yolov5/Dockerfile
-rwxrwxr-x  3.0 unx    11209 tx defN 21-Sep-23 08:25 yolov5/README.md
-rw-rw-r--  3.0 unx     3610 tx defN 21-Sep-23 08:25 yolov5/.dockerignore
drwxrwxr-x  3.0 unx        0 bx stor 21-Sep-23 08:27 yolov5/models/
-rw-rw-r--  3.0 unx    16770 tx defN 21-Sep-23 08:25 yolov5/models/common.py
-rw-rw-r--  3.0 unx     5964 tx defN 21-Sep-23 08:25 yolov5/models/export.py
-rw-rw-r--  3.0 unx     1367 tx defN 21-Sep-23 08:25 yolov5/models/yolov5s.yaml
-rw-rw-r--  3.0 unx    12452 tx defN 21-Sep-23 08:25 yolov5/models/yolo.py
-rw-rw-r--  3.0 unx        0 bx stor 21-Sep-23 08:25 yolov5/models/__init__.py
-rw-rw-r--  3.0 unx     5134 tx defN 21-Sep-23 08:25 yolov5/models/experimental.py
-rw-rw-r--  3.0 unx     1367 tx defN 21-Sep-23 08:25 yolov5/models/yolov5m.yaml
-rw-rw-r--  3.0 unx     1365 tx defN 21-Sep-23 08:25 yolov5/models/yolov5l.yaml
-rw-rw-r--  3.0 unx     1367 tx defN 21-Sep-23 08:25 yolov5/models/yolov5x.yaml
-rw-rw-r--  3.0 unx    35126 tx defN 21-Sep-23 08:25 yolov5/LICENSE
-rwxrwxr-x  3.0 unx     3976 tx defN 21-Sep-23 08:25 yolov5/.gitignore
-rw-rw-r--  3.0 unx    17067 tx defN 21-Sep-23 08:25 yolov5/test.py
-rw-rw-r--  3.0 unx    33724 tx defN 21-Sep-23 08:25 yolov5/train.py
drwxrwxr-x  3.0 unx        0 bx stor 21-Sep-23 08:25 yolov5/weights/
-rwxrwxr-x  3.0 unx      277 tx defN 21-Sep-23 08:25 yolov5/weights/download_weights.sh
-rwxrwxr-x  3.0 unx      599 tx defN 21-Sep-23 08:25 yolov5/requirements.txt
-rw-rw-r--  3.0 unx     9294 tx defN 21-Sep-23 08:25 yolov5/detect.py
24 files, 562085 bytes uncompressed, 322481 bytes compressed:  42.6%
```

只查看文件名
```shell
$ zipinfo -1 yolov5.zip
yolov5/
yolov5/hubconf.py
yolov5/tutorial.ipynb
yolov5/Dockerfile
yolov5/README.md
yolov5/.dockerignore
yolov5/models/
yolov5/models/common.py
yolov5/models/export.py
yolov5/models/yolov5s.yaml
yolov5/models/yolo.py
yolov5/models/__init__.py
yolov5/models/experimental.py
yolov5/models/yolov5m.yaml
yolov5/models/yolov5l.yaml
yolov5/models/yolov5x.yaml
yolov5/LICENSE
yolov5/.gitignore
yolov5/test.py
yolov5/train.py
yolov5/weights/
yolov5/weights/download_weights.sh
yolov5/requirements.txt
yolov5/detect.py
```

### vim
```shell
$ vim yolov5.zip
" zip.vim version v28
" Browsing zipfile /home/lnsoft/wjj/github/tmp/yolov5.zip
" Select a file with cursor and press ENTER

yolov5/
yolov5/hubconf.py
yolov5/tutorial.ipynb
yolov5/Dockerfile
yolov5/README.md
yolov5/.dockerignore
yolov5/models/
yolov5/models/common.py
yolov5/models/export.py
yolov5/models/yolov5s.yaml
yolov5/models/yolo.py
yolov5/models/__init__.py
yolov5/models/experimental.py
yolov5/models/yolov5m.yaml
yolov5/models/yolov5l.yaml
yolov5/models/yolov5x.yaml
yolov5/LICENSE
yolov5/.gitignore
yolov5/test.py
yolov5/train.py
yolov5/weights/
yolov5/weights/download_weights.sh
yolov5/requirements.txt
yolov5/detect.py
```

## 查看压缩文件的内部结构
```shell
$ zipdetails yolov5.zip 

00000 LOCAL HEADER #1       04034B50
00004 Extract Zip Spec      0A '1.0'
00005 Extract OS            00 'MS-DOS'
00006 General Purpose Flag  0000
00008 Compression Method    0000 'Stored'
0000A Last Mod Time         5337434D 'Thu Sep 23 08:26:26 2021'
0000E CRC                   00000000
00012 Compressed Length     00000000
00016 Uncompressed Length   00000000
0001A Filename Length       0007
0001C Extra Length          001C
0001E Filename              'yolov5/'
00025 Extra ID #0001        5455 'UT: Extended Timestamp'
00027   Length              0009
00029   Flags               '03 mod access'
0002A   Mod Time            614C3A31 'Thu Sep 23 08:26:25 2021'
0002E   Access Time         614C3A36 'Thu Sep 23 08:26:30 2021'
00032 Extra ID #0002        7875 'ux: Unix Extra Type 3'
00034   Length              000B
00036   Version             01
00037   UID Size            04
00038   UID                 000003E8
0003C   GID Size            04
0003D   GID                 000003E8

00041 LOCAL HEADER #2       04034B50
00045 Extract Zip Spec      14 '2.0'
00046 Extract OS            00 'MS-DOS'
00047 General Purpose Flag  0000
      [Bits 1-2]            0 'Normal Compression'
00049 Compression Method    0008 'Deflated'
0004B Last Mod Time         53374326 'Thu Sep 23 08:25:12 2021'
0004F CRC                   2DADEE94
00053 Compressed Length     00000646
00057 Uncompressed Length   000016E7
0005B Filename Length       0011
0005D Extra Length          001C
0005F Filename              'yolov5/hubconf.py'
00070 Extra ID #0001        5455 'UT: Extended Timestamp'
00072   Length              0009
00074   Flags               '03 mod access'
00075   Mod Time            614C39E7 'Thu Sep 23 08:25:11 2021'
00079   Access Time         614C39E7 'Thu Sep 23 08:25:11 2021'
0007D Extra ID #0002        7875 'ux: Unix Extra Type 3'
0007F   Length              000B
00081   Version             01
00082   UID Size            04
00083   UID                 000003E8
00087   GID Size            04
00088   GID                 000003E8
0008C PAYLOAD

......

4FB7B END CENTRAL HEADER    06054B50
4FB7F Number of this disk   0000
4FB81 Central Dir Disk no   0000
4FB83 Entries in this disk  0018
4FB85 Total Entries         0018
4FB87 Size of Central Dir   00000875
4FB8B Offset to Central Dir 0004F306
4FB8F Comment Length        0000
Done
```

## 参考资料
* [View list of files in ZIP archive on Linux](https://superuser.com/questions/216617/view-list-of-files-in-zip-archive-on-linux)
* [How to Exclude Files from a Zip Archive](https://tecadmin.net/how-to-exclude-files-from-a-zip-archive/)
* [yolov5](https://github.com/ultralytics/yolov5)
