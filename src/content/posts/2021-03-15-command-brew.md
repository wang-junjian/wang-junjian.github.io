---
layout: single
title:  "命令brew"
date:   2021-03-15 02:00:00 +0800
categories: Command
tags: [macOS, brew, Install]
---

## 安装
```shell
brew install putty
```

## FAQ
### 1、Updating Homebrew... 卡住
```shell 
$ brew install putty
Updating Homebrew...
```
* 方法1：直接关闭brew每次执行命令时的自动更新
```shell
$ vim ~/.bash_profile
```
```
export HOMEBREW_NO_AUTO_UPDATE=true
```
```shell
$ source ~/.bash_profile
```

* 方法2：替换brew源
```shell
cd "$(brew --repo)"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/brew.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew-core.git
brew update
```

### 2、`initialize': Version value must be a string; got a NilClass () (TypeError)
```shell 
$ brew install putty
/usr/local/Homebrew/Library/Homebrew/version.rb:368:in `initialize': Version value must be a string; got a NilClass () (TypeError)
	from /usr/local/Homebrew/Library/Homebrew/os/mac/version.rb:26:in `initialize'
	from /usr/local/Homebrew/Library/Homebrew/os/mac.rb:24:in `new'
	from /usr/local/Homebrew/Library/Homebrew/os/mac.rb:24:in `version'
	from /usr/local/Homebrew/Library/Homebrew/os/mac.rb:58:in `prerelease?'
	from /usr/local/Homebrew/Library/Homebrew/os.rb:21:in `<module:OS>'
	from /usr/local/Homebrew/Library/Homebrew/os.rb:3:in `<top (required)>'
	from /usr/local/Homebrew/Library/Homebrew/global.rb:28:in `require'
	from /usr/local/Homebrew/Library/Homebrew/global.rb:28:in `<top (required)>'
	from /usr/local/Homebrew/Library/Homebrew/brew.rb:23:in `require_relative'
	from /usr/local/Homebrew/Library/Homebrew/brew.rb:23:in `<main>'
```
* 方法：打开version.rb，定位到368行，进行如何编辑。
```shell
$ vim /usr/local/Homebrew/Library/Homebrew/version.rb
```
```ruby
def initialize(val)
    #raise TypeError, "Version value must be a string; got a #{val.class} (#{val})" unless val.respond_to?(:to_str)

    #@version = '10.14.1'
    @version = '11.2.1'
  end
```

### 3、Error: Failed to upgrade Homebrew Portable Ruby!
```shell
$ brew uninstall putty
==> Downloading https://homebrew.bintray.com/bottles-portable-ruby/portable-ruby-2.6.3_2.yosemite.bottle.tar.gz
Already downloaded: /Users/wjj/Library/Caches/Homebrew/portable-ruby-2.6.3_2.yosemite.bottle.tar.gz
Error: Checksum mismatch.
Expected: b065e5e3783954f3e65d8d3a6377ca51649bfcfa21b356b0dd70490f74c6bd86
  Actual: d3b23d015346282ec081e6a6b3034b6753967076ac833b2b5182d2c074404842
 Archive: /Users/wjj/Library/Caches/Homebrew/portable-ruby-2.6.3_2.yosemite.bottle.tar.gz
To retry an incomplete download, remove the file above.
Error: Failed to upgrade Homebrew Portable Ruby!
```
* 方法：删除文件
```shell
rm -rf /Users/wjj/Library/Caches/Homebrew/portable-ruby-2.6.3_2.yosemite.bottle.tar.gz
```

## 参考资料
* [Mac 解决brew一直卡在Updating Homebrew](https://www.jianshu.com/p/7cb05a2b39a5)
* [brew报错：`initialize': Version value must be a string; got a NilClass () (TypeError)](https://cloud.tencent.com/developer/article/1681987)
* [报错：Failed to upgrade Homebrew Portable Ruby](https://www.jianshu.com/p/53a7d11a7250)