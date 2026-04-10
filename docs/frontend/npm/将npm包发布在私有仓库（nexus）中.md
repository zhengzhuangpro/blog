---
title: 将npm包发布在私有仓库（nexus）中
---

有时候需要将自己写的一些前端项目打包发布到公司内部的nexus仓库中。

### 新建一个 UI库项目

1. 新建一个目录@base/ydy-ui-vue，并切换到其中

   ```bash
   $ mkdir @base/ydy-ui-vue && cd @base/ydy-ui-vue
   ```

2. 初始化一个项目

   ```bash
   $ npm init
   ```

3. 然后一路回车，最后键入`y`即可

   ![1](https://tva1.sinaimg.cn/large/e6c9d24ely1h43xr50y85j21m60u00vu.jpg)

4. 添加用户

   ```bash
   $ npm adduser -registry 仓库地址
   ```

