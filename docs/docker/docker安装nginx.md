---
title: docker安装nginx
---

# Docker 安装 nginx

### 查看可用的版本


```bash
docker search nginx
```

### 安装最新版本
```bash
docker pull nginx:latest
```

### 运行nginx

```bash
docker run --name nginx -p 80:80 -d nginx
```
