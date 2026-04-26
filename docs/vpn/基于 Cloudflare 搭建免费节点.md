---
title: 基于 Cloudflare 搭建免费节点
category: vpn
pubDate: 2026-04-25
---

如果你在找一种真正`长期可用`的免费节点方案，那么2026年，这套基于 Cloudflare 的搭建方式，可能是目前最值得尝试的一种选择

相比过去那些复杂、容易失效、需要频繁维护的方式，这种方案更像是一种“轻量级长期解决方案”：一次搭建，持续可用，几乎不需要额外折腾，非常适合个人用户或轻度使用场景。

# **部署步骤**

### **第一步**

注册一个永久免费的域名

> 这里就不追述了，你需要自己去搞一个域名，然后解析到cloudflare

### 第二步

创建KV 空间，在Cloudflare后台找到：存储和数据库 – Worker KV，来创建一个KV空间以备后面对接。一定要记住这个名称，我们后面要用，我的是vpn-edgetunnel

![image.png](https://img.zhengz.cc/PicGo/20260425171036917.png)

### **第三步**

我们先前往[GitHub - cmliu/edgetunnel: edgetunnel2 VLESS/Trojan 多功能面板 · GitHub](https://github.com/cmliu/edgetunnel)

fork到我们自己的仓库

### 第四步

我们前往 Workers 和 Pages，前往创建应用程序  

![image.png](https://img.zhengz.cc/PicGo/20260425171257496.png)  
![image.png](https://img.zhengz.cc/PicGo/20260425171455591.png)  

选择从github导入  

![image.png](https://img.zhengz.cc/PicGo/20260425171534956.png)  
![image.png](https://img.zhengz.cc/PicGo/20260425171821304.png)  

部署完成后点击 `继续处理站点` 后，选择 `设置` > `环境变量` > **制作**为生产环境定义变量 > `添加变量`。 变量名称填写**ADMIN**，值则为你的管理员密码，后点击 `保存`即可。 

 ![image.png](https://img.zhengz.cc/PicGo/20260425172155272.png)

返回 `部署` 选项卡，在右下角点击 `创建新部署` 后，重新点击 `保存并部署` 即可

### 第五步

绑定 KV 命名空间：

在 `设置`选项卡中选择 `绑定` > `+ 添加` > `KV 命名空间`，然后选择一个已有的命名空间或创建一个新的命名空间进行绑定。

`变量名称`填写**KV**，然后点击 `保存`后重试部署即可 

![image.png](https://img.zhengz.cc/PicGo/20260425172524616.png)

### 第六步

设置绑定一个域名或者二级域名  

![image.png](https://img.zhengz.cc/PicGo/20260425175118976.png)

### 第七步

访问 `https://域名/admin` 输入管理员密码即可登录后台。 

![image.png](https://img.zhengz.cc/PicGo/20260425172928294.png)  

接着把上方的节点链接格式或者自适应订阅地址，导入到你的代理软件里，他支持 VLESS、Trojan 等主流协议，深度集成加密传输。


## **优选订阅地址：**

Cm.Soso.Edu.Kg

Sub.Cmliussss.Net
 
Owo.O00o.Ooo

**PROXYIP 订阅:**

ProxyIP.US.CMLiussss.Net

ProxyIP.SG.CMLiussss.Net

ProxyIP.JP.CMLiussss.Net

**圈x代理软件的导入说明：**

**不能直接导入的话可以使用节点转换工具：https://suburl.v1.mk/