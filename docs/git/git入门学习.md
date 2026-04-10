---
title: git入门学习
date: 2022-07-13 15:35:01
tags:
categories: git
---

前言
==

Git(读音为/gɪt/。)是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理。Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。------ 来自git的基本介绍

说点废话，这里作者只是在用到git的时候，将自己学习到的东西，在这里进行记录，防止后期忘记，哈哈哈

开始
==

第一步
---

首先设置一下Git的user name和email, 这里的用户名和邮箱作者理解成了GitHub的用户名和登录邮箱：
```bash
$ git config --global user.name "zhengzhuang96"
$ git config --global user.email "zheng960108@163.com"
```
第二步
---
第二步生成SSH密钥，这里生成SSh是因为git是有SSH加密验签的：

 1. 查看是否先`cd C:\Users\Administrator\.ssh`文件夹查看一下看是否已经有了ssh密钥，如果没有密钥则不会有此文件夹，有的话就备份删除
 2. 生成密钥：`$ssh-keygen -t rsa -C "zheng960108@163.com"`, 最后得到两个文件<br />
    ![1](https://user-images.githubusercontent.com/29434858/51579166-e8ecc880-1efa-11e9-9776-3a7b364783ee.png)

    加上原来的一个文件，共3个文件
 3. 添加密钥到ssh: ssh-add id_rsa.pub 输入之前输入密码
 4. 在github上添加ssh密钥，这要添加的是"id_rsa.pub"里面的公钥。
    登录自己的github，进入到https://github.com/settings/keys
    New SSH key
    复制id_rsa.pub里面的内容到Key里，直接 Add SSH key

第三步
---
开始使用github：

 1. 创建github库<br />
    <img src="https://user-images.githubusercontent.com/29434858/51579175-f30ec700-1efa-11e9-8861-14c369445e1a.png" width="700px" height="auto" />


 2. 在本地创建新文件夹，并在文件夹中生成README.md文件，这里主要用于测试上传<br />
     ![3](https://user-images.githubusercontent.com/29434858/51579182-f99d3e80-1efa-11e9-8316-7ef6b0d1eb86.png)

 3. 打开Git Bash，其实打开CMD也可以，看着也舒服，这里作者就打开CMD进行操作
    cd到你自己刚才创建的文件夹中，分别执行

    * git init
    * git add README.md
    * git commit -m "first commit"
    * git remote add origin git@github.com:zhengzhuang96/test.git
    * git push -u origin main

     ![4](https://user-images.githubusercontent.com/29434858/51579193-0326a680-1efb-11e9-9b9f-953a3e574cc8.png)


第四步
---
本地仓库修改同步到远程仓库：
```bash
    git add --all
    git commit -m 'second'
    git pull origin main
    git push origin main
```
结束语
===
到这里，最基本的git仓库就算创建成功啦