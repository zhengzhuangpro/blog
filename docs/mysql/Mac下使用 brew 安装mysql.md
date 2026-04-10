---
title: Mac下使用 brew 安装mysql
---

### 打开控制台

```
$ brew install mysql
```

![image](https://tva1.sinaimg.cn/large/e6c9d24ely1h45d6gpb56j20u017x7bf.jpg)

2. 我们现在已经配置成功了，需要设置根密码，它让我们输入mysql_secure_installation

```
$ mysql_secure_installation
```

![image](https://user-images.githubusercontent.com/29434858/77275763-14806400-6cf4-11ea-9506-72741e2dbb0b.png)


结果输入密码后报错：Error: Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)

解决方法：先执行mysql.server start重启一下，然后mysql_secure_installation，在输入密码基本上就成功了

然后会有很多问题，来让你回复, 
```
Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
同意呢就回复y，不同意就回复其他的，比如a呀b呀c呀
```

```
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.
默认情况下，MySQL安装有一个匿名用户，
允许任何人登录MySQL而不必
为他们创建的用户帐户。这只是为了
测试，使安装更顺利。
你应该在投入生产前把它们去掉环境。
```
这样的就是看你自己的意愿了
```
Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.
通常，根目录只允许从
“本地主机”。这保证了有人不能猜到
来自网络的根密码。
```

```
Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.
重新加载特权表将确保所有更改
到目前为止所做的将立即生效。
```

3. 然后前往下载，mac navicat免激活版
第一步：控制台执行
sudo spctl --master-disable
第二步：下载安装即可使用，里面还有一个汉化包

```
链接:https://pan.baidu.com/s/1LJAXn13KBcb4Xq8xfVXlhw  密码:ra1k
```
第三步：汉化
复制中文包”zh-Hans.lproj”放到 /Contents/Resources 即可。（应用程序右键显示包内容）
![image](https://user-images.githubusercontent.com/29434858/77275001-2cef7f00-6cf2-11ea-8b59-2cb9f84502ec.png)
![image](https://user-images.githubusercontent.com/29434858/77275088-60320e00-6cf2-11ea-9d08-34ca96d271fb.png)
![image](https://user-images.githubusercontent.com/29434858/77275120-7b9d1900-6cf2-11ea-8a78-1e728c307fc0.png)
到这里就安装完成了，
![image](https://user-images.githubusercontent.com/29434858/77275216-bb640080-6cf2-11ea-9342-625dfcb018a4.png)
 完了点好。如果出现连接错误:
打开终端，通过终端连接mysql数据库时候我们会看到这样的信息：

```
1045 - Access denied for user 'root'@'localhost' (using password: YES)
```
不要慌，正常，解决上面错误的方法之一就是重新设置我们的mysql的root密码
第一，右击选择这条数据库，选择编辑连接
第二，在常规里面重新编辑密码即可

到这一步就大功告成
![image](https://user-images.githubusercontent.com/29434858/77275684-e6028900-6cf3-11ea-9d7b-0c9360af3979.png)