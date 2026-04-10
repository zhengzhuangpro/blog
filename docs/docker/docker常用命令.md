---
title: docker常用命令
---

### 查看本地镜像
```bash
docker images
```

### 运行容器
```bash
docker run --name nginx-test -p 8080:80 -d nginx
```

参数说明：

 - `--name nginx-test`：容器名称。
 - `-p 8080:80`： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
 - `-d nginx`： 设置容器在在后台一直运行。

### 停止一个容器
```bash
docker stop <容器 ID>
```

参数说明：

 - `--name nginx-test`：容器名称。
 - `-p 8080:80`： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
 - `-d nginx`： 设置容器在在后台一直运行。

停止的容器可以通过 `docker restart` 重启：

### 进入docker的nginx容器
```bash
docker exec -it 容器名或id /bin/bash ## docker exec -it nginx bash
```

### vi或者vim命令没有用，解决办法：

```bash
# 第一步
apt-get  update

# 第二步
apt-get install vim
```
