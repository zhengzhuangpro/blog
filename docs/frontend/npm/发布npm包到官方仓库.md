---
title: 发布npm包到官方仓库
---

# 发布npm包到官方仓库

### 注册npm账号

注册地址：[https://www.npmjs.com/](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.npmjs.com%2F)
注册时需要提供

- Username：用户名，唯一性

- Email address： 邮箱，比较重要，需要收邮件验证后才能发布，另外邮箱是公开的

- Password：登录密码


### 登录npm账号

打开cmd命令行，输入 `npm login`
分别输入用户名，密码，邮箱



### 发布npm包到仓库

cmd命令行执行 `npm publish`

#### 发布成功后，到npm仓库搜索package name即可查询到



### npm 命令

```bash
npm login   ## npm账号登录
npm publish   ## 发布npm包到仓库
npm version patch   ## 自动修改版本，版本+1迭代
npm unpublish peak-cli@0.0.2  ## 删除npm包中发布过的历史某一个版本
```
