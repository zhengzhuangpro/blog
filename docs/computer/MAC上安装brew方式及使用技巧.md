---
title: MAC上安装brew方式及使用技巧
date: 2022-07-13 15:50:56
tags:
categories: mac
---

**brew**是**Mac**下的一个包管理工具，可以简化**MacOS**系统上软件的安装，作用类是**centos**下的**yum**。

**brew**既可以安装包管理工具，还可以安装软件，我的**vs Code**就是**brew**安装的啦

#### 1. 使用ruby安装brew

**brew**是**ruby**开发的，需要确认**ruby**是否已安装，默认在**MacOS**下是已经安装的。

```bash
$ whick ruby
$ ruby --version
```

<img width="565" alt="image-20210526091550956" src="https://tva1.sinaimg.cn/large/e6c9d24ely1h45cncatw8j20ve04gjrq.jpg" />

#### 2. 安装

执行命令（网上好多方式都卡住，找了一个gitee源）

```bash
$ /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

安装过程需要输入一次密码，根据命令一直进行下去(不要着急)

#### 3. 确认

```bash
$ brew --version    // 测试是否已安装成功
$ which brew    // 安装成功则显示路径
```

<img width="600" alt="image-20210526092134873" src="https://tva1.sinaimg.cn/large/e6c9d24ely1h45cnel52dj20xc07amy0.jpg" />

#### 4. brew基本用法

> brew作为使用mac电脑的程序员的必备工具，基本用法也很简单, 基础的git，nodejs都交给brew吧

##### 安装软件

brew的安装目录在 `/usr/local/Cellar`，我们以安装`nodejs`为例子，只需要执行：

```bash
$ brew install nodejs
```

然后等待安装就行了，安装成功之后输入命令查看，nodejs的最新版本就被安装成功啦

<img width="165" alt="image-20210526092536599" src="https://tva1.sinaimg.cn/large/e6c9d24ely1h45cnggyryj2096026wec.jpg" />

> 当然我这里习惯先安装nvm管理node，brew先安装nvm，用nvm来进行安装和管理node版本

**brew**还可以安装软件到你的**MacOs**

```bash
$ brew cask install visual-studio-code
```



其他命令

```bash
$ brew upgrade nodejs             # 更新软件
$ brew remove nodejs              # 卸载软件
$ brew list                       # 列出当前安装的软件 
$ brew search nodejs              # 查询与 nodejs 相关的可用软件(以nodejs举例)
$ brew info nodejs                # 查询 nodejs 的安装信息(以nodejs举例)
```

### brew services

brew services 是一个非常强大的工具，可以管理软件，进行停止、重启等

```bash
brew install elasticsearch          # 安装 elasticsearch
brew services start elasticsearch   # 启动 elasticsearch
brew services stop elasticsearch    # 停止 elasticsearch
brew services restart elasticsearch # 重启 elasticsearch
brew services list                  # 列出当前的状态
```

开始你的brew之旅吧！
