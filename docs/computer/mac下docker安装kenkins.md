---
title: mac下docker安装kenkins
date: 2022-07-13 15:50:56
tags:
categories: mac
---

### mac下docker安装kenkins

##### 1: 新建本地挂载文件地址

```bash
$ mkdir /Users/你的主机名/docker/jenkins
```

##### 2.拉取jenkins镜像

```bash
$ docker pull jenkins/jenkins
```

![image-20210602152641796](./image-20210602152641796.png)

##### 3.部署jenkins

```bash
$ docker run -d -p 8080:8080 -p 50000:50000 --name jenkins --privileged=true -v /Users/你的主机名/docker/jenkins:/var/jenkins_home jenkins/jenkins
```

8080: jenkins后台启动的端口号

##### 4.启动服务端

需要等待一段时间，你可以在docker中查看运行状态，看是否运行起来

http://localhost:8080/

##### 5:输入密码

密码在`/Users/你的主机名/docker/jenkins/secrets/initialAdminPassword`文件保存

或者是用命令查看`cat /Users/你的主机名/docker/jenkins/secrets/initialAdminPassword`

![image-20210602153455113](./image-20210602153455113.png)
