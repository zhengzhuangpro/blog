---
title: 打造一款企业级cli脚手架
---

#### 创建项目

```bash
$ mkdir ydy-cli & cd ydy-cli & npm init -y
```

#### 添加依赖

以下依赖项是我们构建`rollup`+`ts`需要的

1. 添加依赖项到`devDependencies`中

   ```bash
   yarn add @rollup/plugin-json @rollup/plugin-node-resolve @types/fs-extra @types/inquirer rollup rollup-plugin-terser rollup-plugin-typescript2 typescript -D
   ```

2. 添加依赖项到`dependencies`中

   ```bash
   yarn add chalk commander fs-extra inquirer readline
   ```

   



