---
title: npm指令集
---

1. 全局安装

   ```bash
   $ npm install *** -g
   # or
   $ npm i ** -g
   ```

2. 项目安装

   ```bash
   # 保存到package.json
   $ npm install ** --save
   # or
   $ npm install ** -S
   # or
   $ npm i ** --save
   # or
   $ npm i ** -S

   # 不保存到package.json
   $ npm install **
   # or
   $ npm i **
   ```

3. 清除缓存

   ```bash
   npm cache clean -f
   ```

4. 查看npm全局安装的包

   ```bash
   npm list -g --depth 0
   ```