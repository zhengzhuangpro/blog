---
title: 常见的shell脚本
---

```
# 执行打包
jdp p pro
cd build
# 打包结束后删除PLUS业务专用的vconsole注入
sed 's|#parse("/WEB-INF/vm/debugjs.xml")||' index.html > index.html.tmp
mv index.html.tmp index.html
cd ../
# 压缩build文件夹以方便通天塔部署
zip -r build.zip build
```

