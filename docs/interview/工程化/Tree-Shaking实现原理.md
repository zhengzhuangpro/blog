---
title: Tree-Shaking实现原理
---

# Tree-Shaking 实现原理

## 什么是 Tree Shaking

`Tree-Shaking` 是一种基于 `ES Module` 规范的 `Dead Code Elimination` 技术，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化。

`Tree Shaking` 较早前由 Rich Harris 在 `Rollup`中率先实现，`Webpack` 自 2.0 版本开始接入，至今已经成为一种应用广泛的性能优化手段。

## 实现原理

Webpack 中，Tree-shaking 的实现一是先标记出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

- 标记: Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
- 删除: Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
- 输出: 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

> 标记功能需要配置 optimization.usedExports = true 开启

也就是说，标记的效果就是删除没有被其它模块使用的导出语句

## 在 Webpack 中启动 Tree Shaking

在 Webpack 中，启动 Tree Shaking 功能必须同时满足三个条件：

- 使用 `ESM` 规范编写模块代码
- 配置 `optimization.usedExports` 为 `true`，启动标记功能
- 启动代码优化功能，可以通过如下方式实现：
  - 配置 `mode = production`
  - 配置 `optimization.minimize = true`
  - 提供 `optimization.minimizer` 数组

例如：

```js
// webpack.config.js
module.exports = {
  entry: "./src/index",
  mode: "production",
  devtool: false,
  optimization: {
    usedExports: true,
  },
};
```

### 理论基础

在 `CommonJs`、`AMD`、`CMD` 等旧版本的 `JavaScript` 模块化方案中，导入导出行为是高度动态，难以预测的，例如：

```js
if (process.env.NODE_ENV === "development") {
  require("./bar");
  exports.foo = "foo";
}
```

而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量，这意味着下述代码在 ESM 方案下是非法的：

```js
if (process.env.NODE_ENV === "development") {
  import bar from "bar";
  export const foo = "foo";
}
```

所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。

### 示例

对于下述代码：

```js
// index.js
import { bar } from "./bar";
console.log(bar);

// bar.js
export const bar = "bar";
export const foo = "foo";
```

示例中，`bar.js` 模块导出了 `bar` `、foo` ，但只有 `bar` 导出值被其它模块使用，经过 Tree Shaking 处理后，foo 变量会被视作无用代码删除。
