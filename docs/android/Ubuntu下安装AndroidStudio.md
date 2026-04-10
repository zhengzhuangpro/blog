---
title: Ubuntu下安装AndroidStudio
---

# 写在前面

接触 Ubuntu 已经有一段时间了，对于使用 Ubuntu 进行程序开发，在爽不过了，接下来把自己学习的 Android-studio 在 Ubuntu 系统下的安装过程记录下来，进行习惯性的记忆

# 步骤

## 第一步：安装 JDK

打开终端
使用快捷键：Ctrl+Alt+T

## 使用如下三条命令，安装 JDK

```
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
```

按照上面三条指令进行以此安装
![1](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c8uf898j20ke0dq428.jpg)
![2](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c8x2qo4j20ke0dqaeq.jpg)
![3](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c8z8xjnj20ke0dqwfo.jpg)
![4](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c92prp8j20ke0dqq74.jpg)

按照命令依次安装，如图所是，证明你就安装成功拉，嘻嘻！

## 检验 JDK 是否安装成功

输入：

    java -version

![5](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c95rwgdj20ke0dqgmk.jpg)

# 安装 AndroidStudio

## 下载 AndroidStudio

打开“https://developer.android.google.cn/studio/“链接，下载AndroidStudio

![6](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c98mu2tj20m80blmy1.jpg)

## 解压 AndroidStudio

将 Android 复制到某个位置，并执行 unzip 指令解压
![7](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9bx7vfj20ke0dqdiw.jpg)

将解压好的文件移动到指定位置

本文移动到：/home/zhengzhuang/software 下
![8](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9ew06ij20m80dumxu.jpg)

## 打开终端，cd 进入 android-studio/bin 目录“./studio.sh”进行安装

![9](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9iyi6vj20ke0dqmzs.jpg)

## 其他配置如 Windows

设置使用之前配置
![10](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9l9wb9j20k80dnwgl.jpg)

设置是否代理，我选择取消
![11](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9p4qgpj20kd0dpjtw.jpg)

## 安装向导，依次按照步骤安装

![12](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9s98uij20m80go755.jpg)
![13](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9uqmqpj20m80go751.jpg)
![14](https://tva1.sinaimg.cn/large/e6c9d24ely1h45c9xm8alj20m80go0u6.jpg)
![15](https://tva1.sinaimg.cn/large/e6c9d24ely1h45ca0p8x1j20m80goab8.jpg)
![16](https://tva1.sinaimg.cn/large/e6c9d24ely1h45ca3k85vj20m80gogm4.jpg)
![17](https://tva1.sinaimg.cn/large/e6c9d24ely1h45ca6e8quj20m80gowhq.jpg)

到此步骤，就大功告成啦，开始新建项目吧！

## 新建项目
