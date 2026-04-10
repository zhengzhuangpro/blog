---
title: eslint校验
---

https://blog.csdn.net/mrhaoxiaojun/article/details/109637369

```
git add 添加到暂存区
git commit
husky注册在pre-commit的钩子调起lint-staged
lint-staged取得被提交的文件依次执行任务 eslint和prettier
有错误则停止任务，等待下次commit，同时打印错误信息
```

```
git commit -no-verify
```

