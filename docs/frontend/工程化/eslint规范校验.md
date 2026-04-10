---
title: eslint规范校验
---

# git commit 提交规范之ESlint规范校验

在软件开发过程中，代码风格检查（Code Linting）是保障代码规范和一致性的有效手段。过去，Lint 的工作一般在 CodeReview 或者 CI 的时候进行，但这样会导致问题的反馈链，浪费不必要的时间。因此，我们需要利用 Git 的 Pre Commit 钩子，将 Lint 过程放到开发者提交代码之前。

简介
简单介绍一下这三个工具：

prettier 用来优化代码格式，比如缩进、空格、分号等等
husky可以用于实现各种 Git Hook。这里主要用到 pre-commit这个 hook，在执行 commit 之前，运行一些自定义操作
lint-staged 用于对 Git 暂存区中的文件执行代码检测

实现过程

待提交的代码
-> git add 添加到暂存区
-> 执行 git commit
-> husky注册在git pre-commit的钩子调起 lint-staged
-> lint-staged 取得所有被提交的文件依次执行写好的任务（ESLint 和 Prettier）
-> 如果有错误（没通过ESlint检查）则停止任务，等待下次commit，同时打印错误信息
-> 成功提交

安装
首先，我们使用下面的命令把 husky 和 lint-staged 安装到package.json的 devDependencies中：

```bash
npm install husky lint-staged --save-dev
# 或者
yarn add husky lint-staged --dev
```



配置package.json（无prettier）
将下面的代码追加到 package.json文件中：

```json
"scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js --open",
    ...
    "eslint": "eslint --ext .js,.vue src",
    "eslintfix": "eslint --fix --ext .js,.vue src",
    "lint-staged": "lint-staged"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint-staged"
    }
  },
  "lint-staged": {
    "**/*.{js,vue}": [
      "npm run eslint"
    ]
  },
```


这里我没有 加 prettier

配置package.json （有prettier）
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,vue}": [
      "prettier --write",
      "vue-cli-service lint",
      "git add"
    ]
  }
}
```


上面示例中lint-staged下的选项是vue项目中常用的配置，你可以根据你项目的技术栈配置相应的代码检查。

prettier --write会自动美化你的代码格式
vue-cli-service lint是vue项目中语法检查
git add将更改后到文件添加到暂存区

#### .prettierrc文件
新建一个.prettierrc文件，将以下内容复制进去：

```json
{
  "trailingComma": "es5", // 尾随逗号
  "tabWidth": 2, // 缩进
  "semi": false, // 句尾分号
  "singleQuote": true, // 单引号
  "end-of-line": "lf" // 换行符
}
```


这样，当在终端输入 git commit命令提交代码的时候，Lint 程序便会自动检查本次提交所修改的文件是否符合本项目的代码规范。如果代码不符合规范，便会拒绝提交代码。

如果想要跳过 Lint 程序，可以使用 git commit -no-verify进行提交。
