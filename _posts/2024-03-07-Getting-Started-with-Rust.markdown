---
layout: post
title:  "Rust 入门"
date:   2024-03-07 08:00:00 +0800
categories: Rust GettingStarted
tags: [Rust, GettingStarted]
---

## Rust 安装

### macOS
- 安装 `rustup`，它是 Rust 的版本管理工具。

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sudo sh
```
> 这里加了 `sudo` 是因为修改配置文件需要权限。

Rustup 元数据和工具链将安装到 Rustup 的主目录，位于：`~/.rustup`，这可以使用 RUSTUP_HOME 环境变量进行修改。

Cargo 主目录位于：`~/.cargo`，这可以使用 CARGO_HOME 环境变量进行修改。

cargo、rustc、rustup 等命令安装到 Cargo 的 bin 目录，位于：`~/.cargo/bin`。

- 更新 Rust

```bash
sudo rustup update
```

- 卸载 Rust

```bash
sudo rustup self uninstall
```

- 查看版本

```bash
$ cargo --version
cargo 1.76.0 (c84b36747 2024-01-18)
$ rust rustc --version
rustc 1.76.0 (07dca489a 2024-02-04)
$ rust rustdoc --version
rustdoc 1.76.0 (07dca489a 2024-02-04)
```

cargo 是 Rust 的构建工具，类似于 npm、pip、go 等。

rustc 是 Rust 的编译器。

rustdoc 是 Rust 的文档生成工具。


## Hello World
创建 cargo 包

```bash
cargo new hello
cd hello
```

目录结构如下：

```bash
hello
├── .git
├── .gitignore
├── Cargo.toml
└── src
    └── main.rs
```

Cargo.toml
```toml
[package]
name = "hello"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
```

src/main.rs
```rust
fn main() {
    println!("Hello, world!");
}
```

构建和运行

```bash
$ cargo run
   Compiling hello v0.1.0 (/Users/junjian/tmp/rust/hello)
    Finished dev [unoptimized + debuginfo] target(s) in 6.58s
     Running `target/debug/hello`
Hello, world!
```

如果只构建不运行，可以使用 `cargo build` 命令。

构建的程序放在 `./target/debug` 目录下。

```bash
total 800
drwxr-xr-x   2 junjian  staff    64B  3  7 17:07 build
drwxr-xr-x  10 junjian  staff   320B  3  7 17:07 deps
drwxr-xr-x   2 junjian  staff    64B  3  7 17:07 examples
-rwxr-xr-x   1 junjian  staff   394K  3  7 17:07 hello
-rw-r--r--   1 junjian  staff    92B  3  7 17:07 hello.d
drwxr-xr-x   3 junjian  staff    96B  3  7 17:07 incremental
```

清理构建的程序

```bash
cargo clean
```
