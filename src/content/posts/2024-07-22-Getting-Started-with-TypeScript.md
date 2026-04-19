---
layout: single
title:  "TypeScript 入门"
date:   2024-07-22 08:00:00 +0800
categories: TypeScript GettingStarted
tags: [TypeScript, GettingStarted]
---

## TypeScript 安装

安装 tsc，它是 TypeScript 的编译器。
```bash
npm i -g typescript
```

查看版本
```bash
tsc -v
Version 5.5.3
```

安装 ts-node，它是 TypeScript 的运行时。
```bash
npm i -g ts-node
```

查看版本
```bash
ts-node -v
v10.9.2
```

## Hello World

使用 `tsc --init` 命令快速创建一个 `tsconfig.json` 文件。
```bash
tsc --init

Created a new tsconfig.json with:                                                                                       
                                                                                                                     TS 
  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true


You can learn more at https://aka.ms/tsconfig
```

创建一个 `hello.ts` 文件。
```ts
function hello(name: string) {
  console.log(`Hello, ${name}!`);
}

hello("TypeScript");
```

使用 `tsc` 命令编译 `hello.ts` 文件。
```bash
tsc hello.ts
```

编译后生成一个 `hello.js` 文件。
```js
function hello(name) {
    console.log("Hello, ".concat(name, "!"));
}
hello("TypeScript");
```

注意：指定转译的目标文件后，tsc 将忽略当前应用路径下的 tsconfig.json 配置，因此我们需要通过显式设定如下所示的参数，让 tsc 以严格模式检测并转译 TypeScript 代码。

```bash
tsc hello.ts --strict --alwaysStrict false
```

使用 `ts-node hello.ts` 命令直接运行 TypeScript 文件。
```bash
ts-node hello.ts
Hello, TypeScript!
```

## 类型

### 字符串（string）

```ts
let firstname: string = 'Captain';                              // 字符串字面量
let familyname: string = String('S');                           // 显式类型转换
let fullname: string = `my name is ${firstname}.${familyname}`; // 模板字符串
```

### 数字（number）

```ts
let integer: number = 6;            // 十进制整数
let integer2: number = Number(42);  // 显式类型转换
let decimal: number = 3.14;         // 十进制浮点数
let binary: number = 0b1010;        // 二进制整数
let octal: number = 0o744;          // 八进制整数
let hex: number = 0xf00d;           // 十六进制整数
let big: bigint =  100n;            // 大整数
```

bigint 类型是在 ECMAScript 2020 中引入的。因此您需要确保 TypeScript 的编译目标（target）设置为 ES2020 或更高版本，通过修改 tsconfig.json 文件来实现。

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### 布尔（boolean）

```ts
let isDone: boolean = false;        // 布尔值
let isTrue: boolean = Boolean(1);   // 显式类型转换
```

### Symbol

Symbol 类型的值是独一无二的，不可变的，并且主要用于对象属性的键，提供了一种创建私有或唯一的属性标识符的方法。

```ts
let sym1: symbol = Symbol('key');
let sym2: symbol = Symbol('key');
sym1 == sym2    // false
```

### 数组（Array）

```ts
let list: number[] = [1, 2, 3];     // 数字数组
let list2: Array<number> = [1, 2];  // 数字数组
```

### 元组（Tuple）

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```ts
let x: [string, number];
x = ['hello', 10];  // OK
x = [10, 'hello'];  // Error
```

### any

任意值（Any）用来表示允许赋值为任意类型。

```ts
let notSure: any = 4;
notSure = 'maybe a string instead';
let bool: boolean = notSure;
```

### unknown

未知类型（Unknown）是 TypeScript 3.0 中引入的新类型，它是安全的 any 类型。

```ts
let userInput: unknown;
let userName: string;

userInput = 5;
userInput = 'Max';
userName = userInput;  // Error
```

