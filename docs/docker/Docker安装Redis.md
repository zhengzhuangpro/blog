---
title: Docker安装Redis
---

# Docker 安装 Redis

##### 查看可用的 Redis 版本

访问 Redis 镜像库地址： https://hub.docker.com/_/redis?tab=tags。

##### 查看可用版本

```bash
$ docker search redis
```

##### 取最新版的 Redis 镜像

```bash
$ docker pull redis:latest
```

##### 查看本地镜像

```bash
$ docker images
```

##### 安装完成后运行容器

```bash
$ docker run -itd --name redis-test -p 6379:6379 redis
```

##### 连接测试使用 redis 服务(进入redis中)

```bash
$ docker exec -it redis-test /bin/bash
```

