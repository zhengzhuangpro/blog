---
title: Docker安装MySQL
---

# Docker 安装 MySQL

##### 查看可用的 Redis 版本

访问 Redis 镜像库地址： https://hub.docker.com/_/redis?tab=tags。

##### 查看可用版本

```bash
$ docker search mysql
```

##### 取最新版的 Redis 镜像

```bash
$ docker pull mysql:latest
```

##### 查看本地镜像

```bash
$ docker images
```

##### 安装完成后运行容器

```bash
$ docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```



```
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```

