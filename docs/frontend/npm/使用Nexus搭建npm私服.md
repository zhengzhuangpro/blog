---
title: 使用Nexus搭建npm私服
---

搭建npm私服，我们使用nexus3

Nexus与其他私服一样的，npm私服同样有三种类型：

- `hosted` : 本地存储，即同 docker 官方仓库一样提供本地私服功能
- `proxy` : 提供代理其他仓库的类型，如 docker 中央仓库
- `group` : 组类型，实质作用是组合多个仓库为一个地址

那么就来一个一个创建。

### 1. 创建blob存储

为其创建一个单独的存储空间。

![image-20220712181648721](https://tva1.sinaimg.cn/large/e6c9d24ely1h44b8egmoxj20xe0l2abv.jpg)

### 2. 创建hosted类型的npm

- `Name`: 定义一个名称local-npm
- `Storage`：Blob store，我们下拉选择前面创建好的专用blob：npm-hub。
- `Hosted`：开发环境，我们运行重复发布，因此Delpoyment policy 我们选择Allow redeploy。这个很重要！

![img](https://tva1.sinaimg.cn/large/e6c9d24ely1h44b9wwe30j20yl0lu41z.jpg)

## 3. 创建一个proxy类型的npm仓库

- `Name`: proxy-npm
- `Proxy`：Remote Storage: 远程仓库地址，这里填写: [https://registry.npmjs.org](http://www.eryajf.net/go?url=https://registry.npmjs.org)
- `Storage`: npm-hub。

其他的均是默认。

整体配置截图如下：

![img](https://tva1.sinaimg.cn/large/e6c9d24ely1h44bacs8a1j20pp0n0q5v.jpg)

## 4. 创建一个group类型的npm仓库[#](https://www.cnblogs.com/54chensongxia/p/14930128.html#4-创建一个group类型的npm仓库)

- `Name`：group-npm
- `Storage`：选择专用的blob存储npm-hub。
- `group` : 将左边可选的2个仓库，添加到右边的members下。

整体配置截图如下：

![img](https://tva1.sinaimg.cn/large/e6c9d24ely1h44bam68f9j20qg0j2dhs.jpg)

这些配置完成之后，就可以使用了。

## 5. 验证使用

### 获取默认的仓库地址[#](https://www.cnblogs.com/54chensongxia/p/14930128.html#获取默认的仓库地址)

```bash
# npm config get registry
https://registry.npmjs.org/
```

### 配置为私服地址。[#](https://www.cnblogs.com/54chensongxia/p/14930128.html#配置为私服地址)

从如下截图中查看(其实就是创建的组对外的地址)。

![image-20220712182301304](https://tva1.sinaimg.cn/large/e6c9d24ely1h44bettejmj21dv0k1di5.jpg)

通过如下命令配置：

```ruby
npm config set registry http://***.com/repository/npm-group/
```

现在开始安装，安装之前先看一下组里的内容：

![img](https://tva1.sinaimg.cn/large/e6c9d24ely1h44bjxureej20jm09gmxp.jpg)

可以看到还是空的。

### 安装编译

```bash
npm install yarn -g
```

在编译的过程中，我们已经可以看看组里的变化了：

![image-20220712182838572](https://tva1.sinaimg.cn/large/e6c9d24ely1h44bknxxcpj20m60coaao.jpg)

## 验证问题（npm 401）解决

很多时候，Nexus的设置是不允许匿名用户访问资源的。这种情况下就需要登录才能访问。使用下面的配置，就不需要每次登录。

首先使用管理员用户激活npm realms。

![img](https://tva1.sinaimg.cn/large/e6c9d24ely1h44blpkg1gj211s0g3405.jpg)

然后配置

```bash
# 根据提示输入用户/密码/邮箱
npm adduser --registry=私服地址

# 再设置仓库
npm config set registry http:私服地址
```