---
title: pnpm基础
---

#### 安装

```bash
# 通过 npm 安装
$ npm install -g pnpm

# 使用 HomeBrew
$ brew install pnpm
```

### pnpm本地存储位置

```bash
Downloading nexus.yuanduyun.com/typescript/4.7.4: 11.7 MB/11.7 MB, done
Packages: +125
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /Users/zhengzhuang/Library/pnpm/store/v3
  Virtual store is at:             node_modules/.pnpm
```

#### 安装依赖

##### pnpm add

| Command              | Meaning                       |
| -------------------- | ----------------------------- |
| `pnpm add sax`       | 保存到 `dependencies`         |
| `pnpm add -D sax`    | 保存到 `devDependencies`      |
| `pnpm add -O sax`    | 保存到 `optionalDependencies` |
| `pnpm add -g sax`    | 全局安装软件包                |
| `pnpm add sax@next`  | 从 `next` 标签下安装          |
| `pnpm add sax@3.0.0` | 安装指定版本 `3.0.0`          |

##### pnpm update

别名: `up`, `upgrade`

| Command              | Meaning                                                |
| -------------------- | ------------------------------------------------------ |
| `pnpm up`            | 遵循 `package.json` 指定的范围更新所有的依赖项         |
| `pnpm up --latest`   | 更新所有依赖项，此操作会忽略 `package.json` 指定的范围 |
| `pnpm up foo@2`      | 将 `foo` 更新到 v2 上的最新版本                        |
| `pnpm up "@babel/*"` | 更新 `@babel` 范围内的所有依赖项                       |

##### pnpm remove

别名: `rm`, `uninstall`, `un`
